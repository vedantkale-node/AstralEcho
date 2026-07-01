/// <reference path="./electron.d.ts" />
const app = document.getElementById("app");

async function init() {
  if (app) {
    const lastFolder = await window.api.getLastFolder();

    app.innerHTML = `
      <div class="flex flex-row-reverse h-screen bg-zinc-950 text-white overflow-hidden">

  <!-- Sidebar -->
  <aside
  id="sidebar"
  class="relative w-100 shrink-0 flex flex-col bg-zinc-900 border-r border-white/5 shadow-2xl"
>

    <!-- App Header -->
    <div class="px-5 pt-6 pb-5 border-b border-white/5">
      <div class="flex items-center gap-2.5 mb-5">
        <div class="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 0 0-1.196-.98l-10 2A1 1 0 0 0 6 5v6.499A3 3 0 1 0 8 14V8.82l8-1.6V11.5A3 3 0 1 0 18 14V3z"/>
          </svg>
        </div>
        <h1 class="text-[15px] font-semibold tracking-tight text-white">Astral Echo</h1>
      </div>

      <button
        id="pick-folder"
        class="w-full flex items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-sm font-medium px-4 py-2.5 transition-colors duration-150 shadow-lg shadow-violet-900/30"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>
        </svg>
        Open Folder
      </button>
    </div>

    <!-- NEW: Search -->
<div class="px-2 pb-2">
  <input
    id="search"
    type="text"
    placeholder="Search..."
    class="w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white outline-none ring-1 ring-zinc-700 focus:ring-violet-500"
  />
</div>

    <!-- Folder Path -->
    <div class="px-5 py-3 border-b border-white/5 min-h-11 flex items-center">
      <p id="folder-path" class="text-xs text-zinc-500 truncate leading-relaxed"></p>
    </div>

    <!-- File List -->
    <div class="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
      <p class="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Library</p>
      <ul id="file-list" class="space-y-0.5"></ul>
    </div>

    <!-- Resize Handle -->
<div
  id="resize-handle"
  class="absolute top-0 left-0 h-full w-1 cursor-ew-resize hover:bg-violet-500"
></div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 flex flex-col bg-zinc-950 min-w-0">

    <!-- Now Playing Header -->
    <header class="shrink-0 px-8 pt-7 pb-5 border-b border-white/5">
      <p class="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1">Now Playing</p>
      <h2
        id="now-playing"
        class="text-xl font-semibold tracking-tight text-white truncate"
      >Nothing Playing</h2>
    </header>

   <div id="player-wrapper" class="flex-1 flex flex-col items-center justify-center p-8 gap-4 min-h-0 bg-zinc-950">
  <div
    id="player-container"
    class="relative w-full flex-1 flex items-center justify-center rounded-xl bg-zinc-900 shadow-2xl shadow-black/60 ring-1 ring-white/5 overflow-hidden min-h-0"
  >


  <!-- Background -->
  <img
    id="background-cover"
    src="../.././public/assets/music-placeholder.png"
    class="absolute inset-0 z-10 w-full h-full object-cover bg-black/30"
  />

  <div class="absolute inset-0 bg-black/50"></div>

  <!-- Placeholder -->
  <div
    id="placeholder"
    class="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 z-10"
  >
    <div class="text-7xl mb-4">✨</div>

    <h2 class="text-2xl font-semibold text-white">
      Astral Echo
    </h2>

    <p class="mt-2 text-sm">
      Select a song or video to begin.
    </p>
  </div>

  <!-- Video -->
  <video
    id="player"
    class="hidden absolute inset-0 h-full w-full object-contain z-10"
  ></video>

  </div>

  <!-- Bottom Controls -->
  <div
    id="player-controls"
    class="hidden w-full shrink-0 rounded-xl border border-white/5 bg-zinc-900 px-6 py-4"
  >

    <div class="flex flex-col items-center gap-4">





  <!-- Center -->
  <div class="w-full max-w-4xl ">



  <div class="flex items-center justify-between mb-4 px-1">

  <!-- Volume - far left -->
  <div class="flex items-center gap-2 group/volume w-32">
    <button
      id="mute-toggle"
      class="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/10 active:scale-90 active:bg-white/20 transition-all duration-150"
    >
      <span class="material-symbols-rounded text-[20px]">volume_up</span>
    </button>

    <input
      id="volume"
      type="range"
      min="0"
      max="100"
      value="100"
      class="w-0 group-hover/volume:w-20 opacity-0 group-hover/volume:opacity-100 transition-all duration-200 h-1 rounded-full accent-violet-600 cursor-pointer [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3"
    />
  </div>

  <!-- Transport controls - centered -->
  <div class="flex items-center gap-3">

    <button
      id="shuffle"
      class="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/10 active:scale-90 active:bg-white/20 transition-all duration-150"
    >
      <span class="material-symbols-rounded text-[20px]">shuffle</span>
    </button>

    <button
      id="previous"
      class="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/10 active:scale-90 active:bg-white/20 transition-all duration-150"
    >
      <span class="material-symbols-rounded text-[22px]">skip_previous</span>
    </button>

    <button
      id="play-pause"
      class="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 hover:bg-violet-500 active:scale-90 active:bg-violet-700 transition-all duration-150 shadow-xl shadow-violet-900/40"
    >
      <span class="material-symbols-rounded text-[28px]">play_arrow</span>
    </button>

    <button
      id="next"
      class="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/10 active:scale-90 active:bg-white/20 transition-all duration-150"
    >
      <span class="material-symbols-rounded text-[22px]">skip_next</span>
    </button>

    <button
      id="repeat"
      class="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/10 active:scale-90 active:bg-white/20 transition-all duration-150"
    >
      <span class="material-symbols-rounded text-[20px]">repeat</span>
    </button>

  </div>

  <!-- Fullscreen - far right -->
  <div class="flex items-center justify-end w-32">
    <button
      id="fullscreen"
      class="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/10 active:scale-90 active:bg-white/20 transition-all duration-150"
    >
      <span class="material-symbols-rounded text-[20px]">fullscreen</span>
    </button>
  </div>

</div>


<div class="flex items-center gap-3 w-full group">

  <span
    id="current-time"
    class="w-10 text-right text-xs text-zinc-400 tabular-nums"
  >
    0:00
  </span>

  <input
    id="progress"
    type="range"
    min="0"
    max="100"
    value="0"
    class="flex-1 h-1 rounded-full accent-violet-600 cursor-pointer [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5"
  />

  <span
    id="duration"
    class="w-10 text-xs text-zinc-400 tabular-nums"
  >
    0:00
  </span>

</div>

  </div>

</div>

  </div>

</div>


  </main>
</div>
    `;

    const button = document.getElementById("pick-folder");
    const pathElement = document.getElementById("folder-path");
    const fileList = document.getElementById("file-list")!;
    const search = document.getElementById("search") as HTMLInputElement;
    const sidebar = document.getElementById("sidebar")!;
    const resizeHandle = document.getElementById("resize-handle")!;

    const player = document.getElementById("player") as HTMLMediaElement;
    const playPauseBtn = document.getElementById("play-pause")!;
    const progress = document.getElementById("progress") as HTMLInputElement;
    const currentTimeEl = document.getElementById("current-time")!;
    const durationEl = document.getElementById("duration")!;

    function formatTime(sec: number) {
      if (!isFinite(sec)) return "0:00";
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60)
        .toString()
        .padStart(2, "0");
      return `${m}:${s}`;
    }

    playPauseBtn.addEventListener("click", () => {
      if (player.paused) player.play();
      else player.pause();
    });

    player.addEventListener("play", () => {
      playPauseBtn.querySelector("span")!.textContent = "pause";
    });
    player.addEventListener("pause", () => {
      playPauseBtn.querySelector("span")!.textContent = "play_arrow";
    });

    player.addEventListener("loadedmetadata", () => {
      progress.max = String(player.duration);
      durationEl.textContent = formatTime(player.duration);
    });

    const volumeSlider = document.getElementById("volume") as HTMLInputElement;
    const muteToggleBtn = document.getElementById("mute-toggle")!;

    let lastVolume = 1;

    function updateVolumeIcon() {
      const icon = muteToggleBtn.querySelector("span")!;
      if (player.muted || player.volume === 0) {
        icon.textContent = "volume_off";
      } else if (player.volume < 0.5) {
        icon.textContent = "volume_down";
      } else {
        icon.textContent = "volume_up";
      }
    }

    volumeSlider.addEventListener("input", () => {
      const value = Number(volumeSlider.value) / 100;
      player.volume = value;
      player.muted = value === 0;
      if (value > 0) lastVolume = value;
      updateVolumeIcon();
    });

    muteToggleBtn.addEventListener("click", () => {
      if (player.muted || player.volume === 0) {
        player.muted = false;
        player.volume = lastVolume || 1;
        volumeSlider.value = String(player.volume * 100);
      } else {
        lastVolume = player.volume;
        player.muted = true;
        player.volume = 0;
        volumeSlider.value = "0";
      }
      updateVolumeIcon();
    });

    updateVolumeIcon();

    player.addEventListener("timeupdate", () => {
      progress.value = String(player.currentTime);
      currentTimeEl.textContent = formatTime(player.currentTime);
    });

    progress.addEventListener("input", () => {
      player.currentTime = Number(progress.value);
    });

    let currentPlaylist: any[] = [];
    let currentIndex = -1;
    let isShuffle = false;
    let isRepeat = false;

    const shuffleBtn = document.getElementById("shuffle")!;
    const repeatBtn = document.getElementById("repeat")!;
    const previousBtn = document.getElementById("previous")!;
    const nextBtn = document.getElementById("next")!;

    nextBtn.addEventListener("click", () => playNext());
    previousBtn.addEventListener("click", () => playPrevious());

    shuffleBtn.addEventListener("click", () => {
      isShuffle = !isShuffle;
      shuffleBtn.classList.toggle("text-violet-500", isShuffle);
      shuffleBtn.classList.toggle("text-zinc-300", !isShuffle);
    });

    repeatBtn.addEventListener("click", () => {
      isRepeat = !isRepeat;
      repeatBtn.classList.toggle("text-violet-500", isRepeat);
      repeatBtn.classList.toggle("text-zinc-300", !isRepeat);
    });

    const playerWrapper = document.getElementById("player-wrapper")!;
    const fullscreenBtn = document.getElementById("fullscreen")!;

    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        playerWrapper.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });

    document.addEventListener("fullscreenchange", () => {
      const icon = fullscreenBtn.querySelector("span")!;
      icon.textContent = document.fullscreenElement
        ? "fullscreen_exit"
        : "fullscreen";
    });

    // Double-click the video/cover area to toggle fullscreen, YouTube-style
    document
      .getElementById("player-container")!
      .addEventListener("dblclick", () => {
        fullscreenBtn.click();
      });

    player.addEventListener("ended", () => {
      if (isRepeat) {
        player.currentTime = 0;
        player.play();
        return;
      }
      playNext();
    });

    let allFiles: any[] = [];

    function formatFileName(fileName: string) {
      return fileName
        .replace(/\.[^/.]+$/, "")
        .replace(/_/g, " ")
        .replace(/\(.*?\)/g, "")
        .trim();
    }

    async function generateThumbnail(videoPath: string): Promise<string> {
      return new Promise((resolve) => {
        const video = document.createElement("video");
        video.preload = "auto";
        video.muted = true;
        video.src = videoPath;
        video.load();

        video.addEventListener("loadeddata", () => {
          video.currentTime = 2;
        });

        video.addEventListener("seeked", () => {
          const canvas = document.createElement("canvas");

          canvas.width = 320;
          canvas.height = 180;

          const ctx = canvas.getContext("2d");

          if (!ctx) {
            resolve("");
            return;
          }

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          resolve(canvas.toDataURL("image/jpeg"));
        });

        video.addEventListener("error", () => resolve(""));
      });
    }

    async function playFile(
      file: any,
      list: any[],
      index: number,
      isVideo: boolean,
    ) {
      currentPlaylist = list;
      currentIndex = index;

      document.getElementById("now-playing")!.textContent = formatFileName(
        file.name,
      );

      const placeholder = document.getElementById("placeholder")!;
      const backgroundCover = document.getElementById(
        "background-cover",
      ) as HTMLImageElement;
      const controls = document.getElementById("player-controls")!;

      controls.classList.remove("hidden");
      player.src = file.path;
      placeholder.classList.add("hidden");

      if (isVideo) {
        player.classList.remove("hidden");
        backgroundCover.classList.add("hidden");
      } else {
        player.classList.add("hidden");
        backgroundCover.classList.remove("hidden");

        let cover = file.thumbnail;
        if (!cover) {
          cover = await window.api.getThumbnail(file);
          file.thumbnail = cover;
        }
        const bg = cover ?? "../.././public/assets/music-placeholder.png";

        backgroundCover.style.opacity = "0";
        setTimeout(() => {
          backgroundCover.src = bg;
          backgroundCover.style.opacity = "1";
        }, 150);
      }

      await player.play();
    }

    function playNext() {
      if (currentPlaylist.length === 0) return;

      let nextIndex: number;
      if (isShuffle) {
        if (currentPlaylist.length === 1) {
          nextIndex = 0;
        } else {
          do {
            nextIndex = Math.floor(Math.random() * currentPlaylist.length);
          } while (nextIndex === currentIndex);
        }
      } else {
        nextIndex = currentIndex + 1;
        if (nextIndex >= currentPlaylist.length) {
          if (!isRepeat) return;
          nextIndex = 0;
        }
      }

      const file = currentPlaylist[nextIndex];
      const ext = file.name.split(".").pop()?.toLowerCase();
      const isVideo = ["mp4", "mkv", "webm"].includes(ext ?? "");
      playFile(file, currentPlaylist, nextIndex, isVideo);
    }

    function playPrevious() {
      if (currentPlaylist.length === 0) return;

      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = currentPlaylist.length - 1;
      }

      const file = currentPlaylist[prevIndex];
      const ext = file.name.split(".").pop()?.toLowerCase();
      const isVideo = ["mp4", "mkv", "webm"].includes(ext ?? "");
      playFile(file, currentPlaylist, prevIndex, isVideo);
    }

    async function renderFiles(files: any[], fileList: HTMLElement) {
      fileList.innerHTML = "";

      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const item = document.createElement("li");
        const ext = file.name.split(".").pop()?.toLowerCase();
        const isVideo = ["mp4", "mkv", "webm"].includes(ext ?? "");
        item.innerHTML = `
  <div class="flex items-center gap-3">
    <img
  src=""
  alt="Thumbnail"
  class="w-28 h-16 rounded object-cover shrink-0"
/>

    <div class="min-w-0 flex-1">
  <p class="truncate text-sm font-medium text-white">
    ${formatFileName(file.name)}
  </p>

  <p class="text-xs text-zinc-400">
    ${isVideo ? "Video" : "Audio"}
  </p>
</div>
  </div>
`;
        const thumbnail = item.querySelector("img") as HTMLImageElement;

        if (file.thumbnail) {
          thumbnail.src = file.thumbnail;
        } else if (!isVideo) {
          thumbnail.src = "../.././public/assets/music-placeholder.png";
        }

        if (isVideo) {
          file.thumbnail ??= await generateThumbnail(file.path);
          if (file.thumbnail) thumbnail.src = file.thumbnail;
        }
        // Audio
        else {
          if (!file.thumbnail) {
            thumbnail.src = "../.././public/assets/music-placeholder.png";
            window.api.getThumbnail(file).then((cover) => {
              if (cover) {
                file.thumbnail = cover;
                thumbnail.src = cover;
              }
            });
          }
        }
        item.title = file.name;
        item.className =
          "cursor-pointer rounded-xl p-2 hover:bg-zinc-800 transition-colors";
        item.addEventListener("click", () => {
          playFile(file, files, index, isVideo);
        });

        fileList.appendChild(item);
      }
    }

    let isResizing = false;

    resizeHandle.addEventListener("mousedown", () => {
      isResizing = true;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return;
      e.preventDefault();
      const width = window.innerWidth - e.clientX;

      if (width >= 250 && width <= 600) {
        sidebar.style.width = `${width}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      isResizing = false;
    });

    search.addEventListener("input", async () => {
      const query = search.value.toLowerCase();

      const filtered = allFiles.filter((file) =>
        formatFileName(file.name).toLowerCase().includes(query),
      );
      await renderFiles(filtered, fileList);
    });

    if (lastFolder) {
      allFiles = await window.api.readFolder(lastFolder);

      await renderFiles(allFiles, fileList);
      pathElement!.textContent = lastFolder;
    }
    button?.addEventListener("click", async () => {
      const folder = await window.api.pickFolder();

      if (!folder) return;

      await window.api.saveLastFolder(folder);

      search.value = "";
      allFiles = await window.api.readFolder(folder);

      await renderFiles(allFiles, fileList);

      pathElement!.textContent = folder;
    });
  }
}

init();
