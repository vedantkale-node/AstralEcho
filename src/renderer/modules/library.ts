import { state, formatFileName, isVideoFile, formatDuration } from "./state.js";
import { showToast } from "./toast.js";

function createQueue(limit: number) {
  let active = 0;
  const queue: (() => void)[] = [];
  function runNext() {
    if (active >= limit || queue.length === 0) return;
    active++;
    const task = queue.shift()!;
    task();
  }
  return function enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      queue.push(() => {
        fn()
          .then(resolve, reject)
          .finally(() => {
            active--;
            runNext();
          });
      });
      runNext();
    });
  };
}
const thumbnailQueue = createQueue(4);

async function generateThumbnail(
  videoPath: string,
  onDuration?: (duration: number) => void,
): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.src = videoPath;
    video.load();

    video.addEventListener("loadedmetadata", () => {
      if (onDuration && isFinite(video.duration)) onDuration(video.duration);
    });
    video.addEventListener("loadeddata", () => {
      video.currentTime = 2;
    });

    function cleanup() {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = 320;
      canvas.height = 180;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        cleanup();
        resolve("");
        return;
      }
      const targetRatio = canvas.width / canvas.height;
      const videoRatio = video.videoWidth / video.videoHeight;
      let sx = 0,
        sy = 0,
        sw = video.videoWidth,
        sh = video.videoHeight;
      if (videoRatio > targetRatio) {
        sw = video.videoHeight * targetRatio;
        sx = (video.videoWidth - sw) / 2;
      } else {
        sh = video.videoWidth / targetRatio;
        sy = (video.videoHeight - sh) / 2;
      }
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      const result = canvas.toDataURL("image/jpeg");
      cleanup();
      resolve(result);
    });

    video.addEventListener("error", () => {
      cleanup();
      resolve("");
    });
  });
}

export function setupLibrary(player: HTMLMediaElement) {
  const fileList = document.getElementById("file-list")!;
  const pathElement = document.getElementById("folder-path");
  const search = document.getElementById("search") as HTMLInputElement;

  function renderLoadingState(
    container: HTMLElement,
    message = "Scanning folder...",
  ) {
    container.innerHTML = `
      <li class="flex flex-col items-center justify-center gap-3 py-10 text-zinc-500">
        <span class="material-symbols-rounded text-3xl animate-spin">progress_activity</span>
        <p class="text-sm">${message}</p>
      </li>`;
  }

  function updateActiveListItem() {
    const items = fileList.querySelectorAll<HTMLLIElement>("li[data-path]");
    items.forEach((item) => {
      const isActive = item.dataset.path === state.currentPlayingPath;
      item.classList.toggle("bg-violet-500/15", isActive);
      item.classList.toggle("ring-1", isActive);
      item.classList.toggle("ring-violet-500/30", isActive);
    });
  }
  state.updateActiveListItem = updateActiveListItem;

  async function playFile(
    file: MediaFile,
    list: MediaFile[],
    index: number,
    isVideo: boolean,
  ) {
    state.currentPlaylist = list;
    state.currentIndex = index;
    state.currentPlayingPath = file.path;
    updateActiveListItem();
    state.setControlsEnabled?.(true);

    window.api.saveLastPlayed(file.path);

    const displayName = file.title ?? formatFileName(file.name);
    document.getElementById("now-playing")!.textContent = displayName;
    document.getElementById("fullscreen-title-text")!.textContent = displayName;

    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: displayName,
        artist: "Astral Echo",
        artwork: file.thumbnail
          ? [{ src: file.thumbnail, sizes: "512x512", type: "image/jpeg" }]
          : [],
      });
    }

    const placeholder = document.getElementById("placeholder")!;
    const backgroundCover = document.getElementById(
      "background-cover",
    ) as HTMLImageElement;
    const controls = document.getElementById("player-controls")!;

    controls.classList.remove("hidden");
    controls.classList.add("player-active");
    player.src = file.path;
    placeholder.classList.add("hidden");

    if (isVideo) {
      player.classList.remove("hidden");
      backgroundCover.classList.add("hidden");
      document.getElementById("background-overlay")!.classList.add("hidden");
    } else {
      player.classList.add("hidden");
      backgroundCover.classList.remove("hidden");
      document.getElementById("background-overlay")!.classList.remove("hidden");

      let cover = file.thumbnail;
      if (!cover) {
        const meta = await window.api.getAudioMetadata(file);
        cover = meta.cover;
        file.thumbnail = cover;
        if (meta.duration) file.duration = meta.duration;
        if (meta.title) file.title = meta.title;

        if (
          cover &&
          "mediaSession" in navigator &&
          state.currentPlayingPath === file.path
        ) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: file.title ?? formatFileName(file.name),
            artist: "Astral Echo",
            artwork: [{ src: cover, sizes: "512x512", type: "image/jpeg" }],
          });
        }
      }
      const bg = cover ?? "../.././public/assets/music-placeholder.png";
      backgroundCover.style.opacity = "0";
      setTimeout(() => {
        backgroundCover.src = bg;
        backgroundCover.style.opacity = "1";
      }, 150);
    }

    await state.safePlay?.();
  }

  function playNext() {
    if (state.currentPlaylist.length === 0) return;
    let nextIndex: number;
    if (state.isShuffle) {
      if (state.currentPlaylist.length === 1) nextIndex = 0;
      else {
        do {
          nextIndex = Math.floor(Math.random() * state.currentPlaylist.length);
        } while (nextIndex === state.currentIndex);
      }
    } else {
      nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.currentPlaylist.length) {
        if (state.repeatMode === "off") return;
        nextIndex = 0;
      }
    }
    const file = state.currentPlaylist[nextIndex];
    playFile(file, state.currentPlaylist, nextIndex, isVideoFile(file.name));
  }
  state.playNext = playNext;

  function playPrevious() {
    if (state.currentPlaylist.length === 0) return;
    let prevIndex = state.currentIndex - 1;
    if (prevIndex < 0) prevIndex = state.currentPlaylist.length - 1;
    const file = state.currentPlaylist[prevIndex];
    playFile(file, state.currentPlaylist, prevIndex, isVideoFile(file.name));
  }
  state.playPrevious = playPrevious;

  async function renderFiles(files: MediaFile[], container: HTMLElement) {
    container.innerHTML = "";

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const item = document.createElement("li");
      const isVideo = isVideoFile(file.name);
      const displayTitle = file.title ?? formatFileName(file.name);

      item.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="drag-handle material-symbols-rounded text-zinc-600 text-[16px] leading-none cursor-grab active:cursor-grabbing shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -mx-1">drag_indicator</span>
          <div class="relative w-28 aspect-video rounded overflow-hidden shrink-0 bg-zinc-800">
            <img src="" alt="Thumbnail" class="w-full h-full object-cover object-center" />
            <span class="duration-badge hidden absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[10px] font-medium text-white tabular-nums"></span>
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-white item-title">${displayTitle}</p>
            <p class="text-xs text-zinc-400">${isVideo ? "Video" : "Audio"}</p>
          </div>
        </div>`;

      const thumbnail = item.querySelector("img") as HTMLImageElement;
      const durationBadge = item.querySelector(
        ".duration-badge",
      ) as HTMLElement;

      function setDurationBadge(seconds: number) {
        const formatted = formatDuration(seconds);
        if (!formatted) return;
        durationBadge.textContent = formatted;
        durationBadge.classList.remove("hidden");
        file.duration = seconds;
      }

      if (typeof file.duration === "number") setDurationBadge(file.duration);

      if (file.thumbnail) thumbnail.src = file.thumbnail;
      else if (!isVideo)
        thumbnail.src = "../.././public/assets/music-placeholder.png";

      if (isVideo) {
        if (file.thumbnail) {
          thumbnail.src = file.thumbnail;
        } else {
          thumbnailQueue(() =>
            generateThumbnail(file.path, setDurationBadge),
          ).then((result) => {
            if (result) {
              file.thumbnail = result;
              thumbnail.src = result;
              window.api.saveThumbnailCacheEntry(
                file.path,
                result,
                typeof file.duration === "number" ? file.duration : null,
              );
            }
          });
        }
      } else {
        if (!file.thumbnail)
          thumbnail.src = "../.././public/assets/music-placeholder.png";
        if (!file.metadataFetched) {
          file.metadataFetched = true;
          window.api
            .getAudioMetadata(file)
            .then(({ cover, duration, title }) => {
              if (cover) {
                file.thumbnail = cover;
                thumbnail.src = cover;
              }
              if (duration) setDurationBadge(duration);
              if (title) {
                file.title = title;
                const titleEl = item.querySelector(".item-title");
                if (titleEl) titleEl.textContent = title;
              }
            });
        }
      }

      item.title = file.name;
      item.dataset.path = file.path;
      item.draggable = true;
      item.className =
        "group cursor-pointer rounded-xl p-2 hover:bg-zinc-800 transition-colors" +
        (file.path === state.currentPlayingPath
          ? " bg-violet-500/15 ring-1 ring-violet-500/30"
          : "");

      item.addEventListener("click", () =>
        playFile(file, files, index, isVideo),
      );

      item.addEventListener("dragstart", (e) => {
        e.dataTransfer!.effectAllowed = "move";
        e.dataTransfer!.setData("text/plain", file.path);
        item.classList.add("opacity-40");
      });
      item.addEventListener("dragend", () =>
        item.classList.remove("opacity-40"),
      );
      item.addEventListener("dragover", (e) => {
        e.preventDefault();
        item.classList.add("border-t-2", "border-violet-500");
      });
      item.addEventListener("dragleave", () =>
        item.classList.remove("border-t-2", "border-violet-500"),
      );
      item.addEventListener("drop", async (e) => {
        e.preventDefault();
        item.classList.remove("border-t-2", "border-violet-500");
        const draggedPath = e.dataTransfer!.getData("text/plain");
        if (!draggedPath || draggedPath === file.path || !state.currentFolder)
          return;
        const draggedIndex = state.allFiles.findIndex(
          (f) => f.path === draggedPath,
        );
        const targetIndex = state.allFiles.findIndex(
          (f) => f.path === file.path,
        );
        if (draggedIndex === -1 || targetIndex === -1) return;
        const [movedFile] = state.allFiles.splice(draggedIndex, 1);
        state.allFiles.splice(targetIndex, 0, movedFile);
        await renderFiles(state.allFiles, fileList);
        window.api.saveFileOrder(
          state.currentFolder,
          state.allFiles.map((f) => f.path),
        );
      });

      container.appendChild(item);
    }
  }

  async function loadFolder(folder: string) {
    renderLoadingState(fileList);
    try {
      state.allFiles = await window.api.readFolder(folder);

      const savedOrder = await window.api.getFileOrder(folder);
      if (savedOrder) {
        const orderMap = new Map(savedOrder.map((p, i) => [p, i]));
        state.allFiles.sort((a, b) => {
          const aIndex = orderMap.has(a.path)
            ? orderMap.get(a.path)!
            : Infinity;
          const bIndex = orderMap.has(b.path)
            ? orderMap.get(b.path)!
            : Infinity;
          return aIndex - bIndex;
        });
      }

      for (const file of state.allFiles) {
        const cached = state.thumbnailCache[file.path];
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            file.thumbnail = parsed.thumbnail;
            if (typeof parsed.duration === "number")
              file.duration = parsed.duration;
          } catch (err) {
            console.debug("Ignoring corrupt cache entry:", err);
          }
        }
      }

      await renderFiles(state.allFiles, fileList);
      pathElement!.textContent = folder;
      state.currentFolder = folder;

      state.currentPlaylist = [];
      state.currentIndex = -1;
      state.currentPlayingPath = null;
      state.setControlsEnabled?.(false);
      updateActiveListItem();

      const placeholder = document.getElementById("placeholder")!;
      placeholder.classList.toggle("hidden", state.allFiles.length > 0);
    } catch (err) {
      console.error("Failed to read folder:", err);
      showToast(`Couldn't load folder: ${folder}`);
      fileList.innerHTML = "";
      state.allFiles = [];
    }
  }

  search.addEventListener("input", async () => {
    const query = search.value.toLowerCase();
    const filtered = state.allFiles.filter((file) =>
      formatFileName(file.name).toLowerCase().includes(query),
    );
    await renderFiles(filtered, fileList);
  });

  return { loadFolder, renderFiles, playFile, fileList };
}
