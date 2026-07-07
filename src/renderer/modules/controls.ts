import { state } from "./state.js";
import { showToast } from "./toast.js";

export function setupControls(
  loadFolder: (folder: string) => Promise<void>,
  fileList: HTMLElement,
) {
  const shuffleBtn = document.getElementById("shuffle")!;
  const repeatBtn = document.getElementById("repeat")!;
  const previousBtn = document.getElementById("previous")!;
  const nextBtn = document.getElementById("next")!;
  const playPauseBtn = document.getElementById("play-pause")!;
  const progress = document.getElementById("progress") as HTMLInputElement;

  function setControlsEnabled(enabled: boolean) {
    [playPauseBtn, previousBtn, nextBtn, shuffleBtn, repeatBtn].forEach(
      (btn) => {
        (btn as HTMLButtonElement).disabled = !enabled;
        btn.classList.toggle("opacity-40", !enabled);
        btn.classList.toggle("pointer-events-none", !enabled);
      },
    );
    progress.disabled = !enabled;
    progress.classList.toggle("opacity-40", !enabled);
  }
  state.setControlsEnabled = setControlsEnabled;
  setControlsEnabled(false);

  nextBtn.addEventListener("click", () => state.playNext?.());
  previousBtn.addEventListener("click", () => state.playPrevious?.());

  shuffleBtn.addEventListener("click", () => {
    state.isShuffle = !state.isShuffle;
    shuffleBtn.classList.toggle("text-violet-500", state.isShuffle);
    shuffleBtn.classList.toggle("text-zinc-300", !state.isShuffle);
    window.api.saveShuffle(state.isShuffle);
  });

  function applyRepeatModeUI() {
    const icon = repeatBtn.querySelector("span")!;
    icon.textContent = state.repeatMode === "one" ? "repeat_one" : "repeat";
    const isActive = state.repeatMode !== "off";
    repeatBtn.classList.toggle("text-violet-500", isActive);
    repeatBtn.classList.toggle("text-zinc-300", !isActive);
  }
  state.applyRepeatModeUI = applyRepeatModeUI;

  repeatBtn.addEventListener("click", () => {
    state.repeatMode =
      state.repeatMode === "off"
        ? "all"
        : state.repeatMode === "all"
          ? "one"
          : "off";
    applyRepeatModeUI();
    window.api.saveRepeat(state.repeatMode);
  });

  Promise.all([window.api.getShuffle(), window.api.getRepeat()]).then(
    ([savedShuffle, savedRepeat]) => {
      state.isShuffle = savedShuffle;
      state.repeatMode =
        savedRepeat === "one" || savedRepeat === "all" || savedRepeat === "off"
          ? savedRepeat
          : savedRepeat
            ? "all"
            : "off";
      shuffleBtn.classList.toggle("text-violet-500", state.isShuffle);
      shuffleBtn.classList.toggle("text-zinc-300", !state.isShuffle);
      applyRepeatModeUI();
    },
  );

  const playerWrapper = document.getElementById("player-wrapper")!;
  const fullscreenBtn = document.getElementById("fullscreen")!;
  const playerContainer = document.getElementById("player-container")!;
  const fullscreenTitle = document.getElementById("fullscreen-title")!;
  const playerControls = document.getElementById("player-controls")!;
  const player = document.getElementById("player") as HTMLMediaElement;
  const volumeIndicator = document.getElementById("volume-indicator")!;

  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) playerWrapper.requestFullscreen();
    else document.exitFullscreen();
  });

  document.addEventListener("fullscreenchange", () => {
    const icon = fullscreenBtn.querySelector("span")!;
    const isFs = !!document.fullscreenElement;
    icon.textContent = isFs ? "fullscreen_exit" : "fullscreen";
    fullscreenTitle.classList.toggle("hidden", !isFs);

    playerWrapper.classList.toggle("p-8", !isFs);
    playerWrapper.classList.toggle("gap-4", !isFs);
    playerWrapper.classList.toggle("p-0", isFs);
    playerWrapper.classList.toggle("gap-0", isFs);

    playerContainer.classList.toggle("rounded-xl", !isFs);
    playerContainer.classList.toggle("ring-1", !isFs);
    playerContainer.classList.toggle("ring-white/5", !isFs);
    playerContainer.classList.toggle("shadow-2xl", !isFs);
    playerContainer.classList.toggle("shadow-black/60", !isFs);

    playerControls.classList.toggle("shrink-0", !isFs);
    playerControls.classList.toggle("w-full", !isFs);
    playerControls.classList.toggle("rounded-xl", !isFs);
    playerControls.classList.toggle("border", !isFs);
    playerControls.classList.toggle("border-white/5", !isFs);
    playerControls.classList.toggle("bg-zinc-900", !isFs);

    playerControls.classList.toggle("fixed", isFs);
    playerControls.classList.toggle("bottom-0", isFs);
    playerControls.classList.toggle("left-0", isFs);
    playerControls.classList.toggle("right-0", isFs);
    playerControls.classList.toggle("z-30", isFs);
    playerControls.classList.toggle("bg-gradient-to-t", isFs);
    playerControls.classList.toggle("from-black/90", isFs);
    playerControls.classList.toggle("to-transparent", isFs);
    playerControls.classList.toggle("pt-16", isFs);

    showControls();
  });

  let playerClickTimer: ReturnType<typeof setTimeout> | null = null;
  playerContainer.addEventListener("click", (e) => {
    if (
      e.target === volumeIndicator ||
      volumeIndicator.contains(e.target as Node)
    )
      return;
    if (playerClickTimer) return;
    playerClickTimer = setTimeout(() => {
      playPauseBtn.click();
      playerClickTimer = null;
    }, 220);
  });
  playerContainer.addEventListener("dblclick", () => {
    if (playerClickTimer) {
      clearTimeout(playerClickTimer);
      playerClickTimer = null;
    }
    fullscreenBtn.click();
  });

  let hideControlsTimeout: ReturnType<typeof setTimeout> | null = null;
  function showControls() {
    if (playerControls.classList.contains("player-active")) {
      playerControls.classList.remove("opacity-0", "pointer-events-none");
    }
    fullscreenTitle.classList.remove("opacity-0");
    playerWrapper.classList.remove("cursor-none");
    clearTimeout(hideControlsTimeout!);
    if (document.fullscreenElement) {
      hideControlsTimeout = setTimeout(() => {
        if (!player.paused) {
          playerControls.classList.add("opacity-0", "pointer-events-none");
          fullscreenTitle.classList.add("opacity-0");
          playerWrapper.classList.add("cursor-none");
        }
      }, 3000);
    }
  }
  playerWrapper.addEventListener("mousemove", showControls);
  playerWrapper.addEventListener("mouseleave", () => {
    if (document.fullscreenElement) {
      clearTimeout(hideControlsTimeout!);
      if (!player.paused) {
        playerControls.classList.add("opacity-0", "pointer-events-none");
        fullscreenTitle.classList.add("opacity-0");
      }
    }
  });

  const sidebar = document.getElementById("sidebar")!;
  const resizeHandle = document.getElementById("resize-handle")!;
  let isResizing = false;

  window.api.getSidebarWidth().then((savedWidth) => {
    const clamped = Math.min(600, Math.max(250, savedWidth));
    sidebar.style.width = `${clamped}px`;
  });

  resizeHandle.addEventListener("mousedown", () => {
    isResizing = true;
  });
  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    e.preventDefault();
    const width = window.innerWidth - e.clientX;
    if (width >= 250 && width <= 600) sidebar.style.width = `${width}px`;
  });
  document.addEventListener("mouseup", () => {
    if (isResizing) window.api.saveSidebarWidth(sidebar.offsetWidth);
    isResizing = false;
  });

  const button = document.getElementById("pick-folder");
  const pathElement = document.getElementById("folder-path");
  const search = document.getElementById("search") as HTMLInputElement;

  button?.addEventListener("click", async () => {
    const folder = await window.api.pickFolder();
    if (!folder) return;
    await window.api.saveLastFolder(folder);
    search.value = "";
    await loadFolder(folder);
  });

  document
    .getElementById("placeholder-open-folder")
    ?.addEventListener("click", () => {
      button?.click();
    });

  document
    .getElementById("refresh-folder")
    ?.addEventListener("click", async () => {
      if (!state.currentFolder) {
        showToast("No folder open to refresh.", "info");
        return;
      }
      search.value = "";
      showToast("Refreshing folder...", "info", 1500);
      await loadFolder(state.currentFolder);
    });

  document
    .getElementById("remove-folder")
    ?.addEventListener("click", async () => {
      if (!state.currentFolder) return;
      await window.api.clearLastFolder();
      state.currentFolder = null;
      state.allFiles = [];
      state.currentPlaylist = [];
      state.currentIndex = -1;
      state.currentPlayingPath = null;

      fileList.innerHTML = "";
      pathElement!.textContent = "";
      search.value = "";

      player.pause();
      player.src = "";
      document.getElementById("now-playing")!.textContent = "Nothing Playing";
      document.getElementById("player-controls")!.classList.add("hidden");
      document.getElementById("placeholder")!.classList.remove("hidden");
      document.getElementById("background-cover")!.classList.add("hidden");
      document.getElementById("background-overlay")!.classList.add("hidden");
      setControlsEnabled(false);

      showToast("Folder removed.", "info", 2000);
    });

  const openPortfolio = (e: Event) => {
    e.preventDefault();
    window.api.openExternal?.("https://vedantkale.in");
  };
  document
    .getElementById("portrait-credit-link")
    ?.addEventListener("click", openPortfolio);
  document
    .getElementById("footer-credit-link")
    ?.addEventListener("click", openPortfolio);
}
