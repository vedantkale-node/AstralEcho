/// <reference path="./electron.d.ts" />
const app = document.getElementById("app");

async function init() {
  if (app) {
    const lastFolder = await window.api.getLastFolder();

    app.innerHTML = `
      <div class="flex flex-row-reverse h-screen bg-zinc-950 text-white overflow-hidden">

  <!-- Portrait-only top bar (hidden in landscape) -->
  <div id="portrait-header" class="hidden items-center gap-2.5 px-5 py-4 border-b border-white/5 bg-zinc-900">
    <div class="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
      <img src="../.././public/assets/icon-main.png">
    </div>
    <h1 class="text-[15px] font-semibold tracking-tight text-white">Astral Echo</h1>
  </div>

  <!-- App Loading Overlay -->
  <div
    id="app-loading"
    class="absolute inset-0 z-100 flex flex-col items-center justify-center gap-3 bg-zinc-950"
  >
    <span class="material-symbols-rounded text-4xl animate-spin text-violet-500">progress_activity</span>
    <p class="text-sm text-zinc-500">Loading Astral Echo...</p>
  </div>

  <!-- Sidebar -->
  <aside
  id="sidebar"
  class="relative w-100 shrink-0 flex flex-col bg-zinc-900 border-r border-white/5 shadow-2xl"
>

    <!-- App Header -->
    <div class="px-5 pt-6 pb-5 border-b border-white/5">
      <div class="flex items-center gap-2.5 mb-5">
        <div class="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
          <img src="../.././public/assets/icon-main.png">
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
    class="w-full rounded-lg mt-5 bg-zinc-800 px-3 py-2 text-sm text-white outline-none ring-1 ring-zinc-700 focus:ring-violet-500"
  />
</div>

    <!-- Folder Path -->
    <div class="px-5 py-3 border-b border-white/5 min-h-11 flex items-center justify-between gap-2">
    <button
      id="refresh-folder"
      title="Refresh folder"
      class="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-150"
    >
      <span class="material-symbols-rounded text-[16px]">refresh</span>
    </button>
    <p id="folder-path" class="text-xs text-zinc-500 truncate leading-relaxed flex-1"></p>

      <div class="flex items-center gap-1 shrink-0">

        <button
          id="remove-folder"
          title="Remove folder"
          class="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-500/10 active:scale-90 transition-all duration-150"
        >
          <span class="material-symbols-rounded text-[16px]">folder_off</span>
        </button>
      </div>
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
    class="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 z-10 gap-4 px-8 text-center"
  >
    <span class="material-symbols-rounded text-6xl text-violet-500">library_music</span>
    <div>
      <h2 class="text-lg font-semibold text-white mb-1">No music library yet</h2>
      <p class="text-sm text-zinc-500">Open a folder to start building your library.</p>
    </div>
    <button
      id="placeholder-open-folder"
      class="flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 transition-colors duration-150"
    >
      <span class="material-symbols-rounded text-[18px]">folder_open</span>
      Open Folder
    </button>
  </div>

  <!-- Session Restore Loading -->
  <div
    id="restore-loading"
    class="hidden absolute inset-0 flex flex-col items-center justify-center gap-3 text-zinc-500 z-20 bg-zinc-900"
  >
    <span class="material-symbols-rounded text-4xl animate-spin text-violet-500">progress_activity</span>
    <p class="text-sm">Restoring your session...</p>
  </div>

  <!-- Video -->
  <video
    id="player"
    class="hidden absolute inset-0 h-full w-full object-contain z-10"
  ></video>

  <!-- Volume Indicator -->
  <div
    id="volume-indicator"
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-md px-4 py-2 opacity-0 pointer-events-none transition-opacity duration-200"
  >
    <span id="volume-indicator-icon" class="material-symbols-rounded text-white text-[20px]">volume_up</span>
    <span id="volume-indicator-value" class="text-white text-sm font-medium tabular-nums w-9">100%</span>
  </div>

  <!-- Seek Indicator -->
  <div
    id="seek-indicator"
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-md px-4 py-2 opacity-0 pointer-events-none transition-opacity duration-200"
  >
    <span id="seek-indicator-icon" class="material-symbols-rounded text-white text-[20px]">fast_forward</span>
    <span id="seek-indicator-value" class="text-white text-sm font-medium tabular-nums">+5s</span>
  </div>

  <!-- Play/Pause Indicator -->
  <div
    id="playpause-indicator"
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-black/70 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-200"
  >
    <span id="playpause-indicator-icon" class="material-symbols-rounded text-white text-[32px]">play_arrow</span>
  </div>

  </div>

  <!-- Bottom Controls -->
  <div
    id="player-controls"
        class="hidden w-full shrink-0 rounded-xl border border-white/5 bg-zinc-900 px-6 py-4 transition-opacity duration-300"

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
      class="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:not-[.text-violet-500]:text-white hover:bg-white/10 active:scale-90 active:bg-white/20 transition-all duration-150"
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
      class="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:not-[.text-violet-500]:text-white hover:bg-white/10 active:scale-90 active:bg-white/20 transition-all duration-150"
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
    <div id="toast-container" class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"></div>
</div>
    `;

    const button = document.getElementById("pick-folder");
    const pathElement = document.getElementById("folder-path");
    const fileList = document.getElementById("file-list")!;
    const search = document.getElementById("search") as HTMLInputElement;
    const sidebar = document.getElementById("sidebar")!;
    const resizeHandle = document.getElementById("resize-handle")!;

    function showToast(
      message: string,
      type: "error" | "info" = "error",
      duration = 3500,
    ) {
      const container = document.getElementById("toast-container")!;
      const toast = document.createElement("div");
      const isError = type === "error";

      toast.className =
        "pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-white shadow-2xl backdrop-blur-md transition-all duration-300 " +
        (isError ? "bg-red-600/90" : "bg-zinc-800/90 border border-white/10");

      const icon = document.createElement("span");
      icon.className = "material-symbols-rounded text-[18px]";
      icon.textContent = isError ? "error" : "info";

      const text = document.createElement("span");
      text.textContent = message;

      toast.appendChild(icon);
      toast.appendChild(text);
      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.add("opacity-0", "translate-x-4");
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    const player = document.getElementById("player") as HTMLMediaElement;
    const playPauseBtn = document.getElementById("play-pause")!;
    const progress = document.getElementById("progress") as HTMLInputElement;
    const currentTimeEl = document.getElementById("current-time")!;
    const durationEl = document.getElementById("duration")!;

    async function safePlay() {
      try {
        await player.play();
      } catch (err) {
        console.error("Playback failed:", err);
        showToast(
          "Couldn't play this file. It may be corrupted or unsupported.",
        );
      }
    }

    player.addEventListener("error", () => {
      showToast("This file couldn't be loaded.");
    });

    function formatTime(sec: number) {
      if (!isFinite(sec)) return "0:00";

      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = Math.floor(sec % 60)
        .toString()
        .padStart(2, "0");

      if (h > 0) {
        return `${h}:${m.toString().padStart(2, "0")}:${s}`;
      }
      return `${m}:${s}`;
    }

    playPauseBtn.addEventListener("click", () => {
      if (player.paused) safePlay();
      else player.pause();
    });

    player.addEventListener("play", () => {
      playPauseBtn.querySelector("span")!.textContent = "pause";
      flashPlayPauseIndicator(false);
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "playing";
      }
    });
    player.addEventListener("pause", () => {
      playPauseBtn.querySelector("span")!.textContent = "play_arrow";
      flashPlayPauseIndicator(true);
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "paused";
      }
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
      flashVolumeIndicator();
      saveVolumeDebounced();
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
      flashVolumeIndicator();
      saveVolumeDebounced();
    });

    updateVolumeIcon();

    const playPauseIndicator = document.getElementById("playpause-indicator")!;
    const playPauseIndicatorIcon = document.getElementById(
      "playpause-indicator-icon",
    )!;
    let playPauseIndicatorTimeout: ReturnType<typeof setTimeout> | null = null;

    function flashPlayPauseIndicator(isPlaying: boolean) {
      playPauseIndicatorIcon.textContent = isPlaying ? "play_arrow" : "pause";

      playPauseIndicator.classList.remove("opacity-0");
      clearTimeout(playPauseIndicatorTimeout!);
      playPauseIndicatorTimeout = setTimeout(() => {
        playPauseIndicator.classList.add("opacity-0");
      }, 500);
    }

    const seekIndicator = document.getElementById("seek-indicator")!;
    const seekIndicatorIcon = document.getElementById("seek-indicator-icon")!;
    const seekIndicatorValue = document.getElementById("seek-indicator-value")!;
    let seekIndicatorTimeout: ReturnType<typeof setTimeout> | null = null;

    function flashSeekIndicator(deltaSeconds: number) {
      seekIndicatorIcon.textContent =
        deltaSeconds > 0 ? "fast_forward" : "fast_rewind";
      seekIndicatorValue.textContent = `${deltaSeconds > 0 ? "+" : ""}${deltaSeconds}s`;

      seekIndicator.classList.remove("opacity-0");
      clearTimeout(seekIndicatorTimeout!);
      seekIndicatorTimeout = setTimeout(() => {
        seekIndicator.classList.add("opacity-0");
      }, 700);
    }

    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => safePlay());
      navigator.mediaSession.setActionHandler("pause", () => player.pause());
      navigator.mediaSession.setActionHandler("previoustrack", () =>
        playPrevious(),
      );
      navigator.mediaSession.setActionHandler("nexttrack", () => playNext());
      navigator.mediaSession.setActionHandler("seekbackward", () => {
        player.currentTime = Math.max(player.currentTime - 5, 0);
        flashSeekIndicator(-5);
      });
      navigator.mediaSession.setActionHandler("seekforward", () => {
        player.currentTime = Math.min(
          player.currentTime + 5,
          player.duration || 0,
        );
        flashSeekIndicator(5);
      });
    }

    const volumeIndicator = document.getElementById("volume-indicator")!;
    const volumeIndicatorIcon = document.getElementById(
      "volume-indicator-icon",
    )!;
    const volumeIndicatorValue = document.getElementById(
      "volume-indicator-value",
    )!;
    let volumeIndicatorTimeout: ReturnType<typeof setTimeout> | null = null;

    function flashVolumeIndicator() {
      const isMuted = player.muted || player.volume === 0;
      const percent = Math.round(player.volume * 100);

      volumeIndicatorIcon.textContent = isMuted
        ? "volume_off"
        : player.volume < 0.5
          ? "volume_down"
          : "volume_up";

      volumeIndicatorValue.textContent = isMuted ? "Muted" : `${percent}%`;

      volumeIndicator.classList.remove("opacity-0");

      clearTimeout(volumeIndicatorTimeout!);
      volumeIndicatorTimeout = setTimeout(() => {
        volumeIndicator.classList.add("opacity-0");
      }, 1000);
    }

    window.api.getVolume().then((savedVolume) => {
      player.volume = savedVolume;
      volumeSlider.value = String(savedVolume * 100);
      if (savedVolume > 0) lastVolume = savedVolume;
      updateVolumeIcon();
    });

    player.addEventListener("timeupdate", () => {
      progress.value = String(player.currentTime);
      currentTimeEl.textContent = formatTime(player.currentTime);

      if ("mediaSession" in navigator && isFinite(player.duration)) {
        try {
          navigator.mediaSession.setPositionState({
            duration: player.duration,
            playbackRate: player.playbackRate,
            position: player.currentTime,
          });
        } catch {
          // setPositionState can throw if duration/position are momentarily
          // out of sync during a track switch — safe to ignore
        }
      }
    });

    let volumeSaveTimeout: ReturnType<typeof setTimeout> | null = null;
    function saveVolumeDebounced() {
      clearTimeout(volumeSaveTimeout!);
      volumeSaveTimeout = setTimeout(() => {
        window.api.saveVolume(player.muted ? 0 : player.volume);
      }, 400);
    }

    progress.addEventListener("input", () => {
      player.currentTime = Number(progress.value);
    });

    let currentPlaylist: MediaFile[] = [];
    let currentIndex = -1;
    let isShuffle = false;
    let isRepeat = false;
    let currentPlayingPath: string | null = null;

    function updateActiveListItem() {
      const items = fileList.querySelectorAll<HTMLLIElement>("li[data-path]");
      items.forEach((item) => {
        const isActive = item.dataset.path === currentPlayingPath;
        item.classList.toggle("bg-violet-500/15", isActive);
        item.classList.toggle("ring-1", isActive);
        item.classList.toggle("ring-violet-500/30", isActive);
      });
    }

    const shuffleBtn = document.getElementById("shuffle")!;
    const repeatBtn = document.getElementById("repeat")!;
    const previousBtn = document.getElementById("previous")!;
    const nextBtn = document.getElementById("next")!;

    function setControlsEnabled(enabled: boolean) {
      const controlButtons = [
        playPauseBtn,
        previousBtn,
        nextBtn,
        shuffleBtn,
        repeatBtn,
      ];
      controlButtons.forEach((btn) => {
        (btn as HTMLButtonElement).disabled = !enabled;
        btn.classList.toggle("opacity-40", !enabled);
        btn.classList.toggle("pointer-events-none", !enabled);
      });
      progress.disabled = !enabled;
      progress.classList.toggle("opacity-40", !enabled);
    }

    setControlsEnabled(false);

    function renderLoadingState(
      container: HTMLElement,
      message = "Scanning folder...",
    ) {
      container.innerHTML = `
    <li class="flex flex-col items-center justify-center gap-3 py-10 text-zinc-500">
      <span class="material-symbols-rounded text-3xl animate-spin">progress_activity</span>
      <p class="text-sm">${message}</p>
    </li>
  `;
    }

    nextBtn.addEventListener("click", () => playNext());
    previousBtn.addEventListener("click", () => playPrevious());

    shuffleBtn.addEventListener("click", () => {
      isShuffle = !isShuffle;
      shuffleBtn.classList.toggle("text-violet-500", isShuffle);
      shuffleBtn.classList.toggle("text-zinc-300", !isShuffle);
      window.api.saveShuffle(isShuffle);
    });

    repeatBtn.addEventListener("click", () => {
      isRepeat = !isRepeat;
      repeatBtn.classList.toggle("text-violet-500", isRepeat);
      repeatBtn.classList.toggle("text-zinc-300", !isRepeat);
      window.api.saveRepeat(isRepeat);
    });

    Promise.all([window.api.getShuffle(), window.api.getRepeat()]).then(
      ([savedShuffle, savedRepeat]) => {
        isShuffle = savedShuffle;
        isRepeat = savedRepeat;
        shuffleBtn.classList.toggle("text-violet-500", isShuffle);
        shuffleBtn.classList.toggle("text-zinc-300", !isShuffle);
        repeatBtn.classList.toggle("text-violet-500", isRepeat);
        repeatBtn.classList.toggle("text-zinc-300", !isRepeat);
      },
    );

    const playerWrapper = document.getElementById("player-wrapper")!;
    const fullscreenBtn = document.getElementById("fullscreen")!;

    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        playerWrapper.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });

    const playerContainer = document.getElementById("player-container")!;

    document.addEventListener("fullscreenchange", () => {
      const icon = fullscreenBtn.querySelector("span")!;
      const isFs = !!document.fullscreenElement;

      icon.textContent = isFs ? "fullscreen_exit" : "fullscreen";

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
    });

    // Single click toggles play/pause, double click toggles fullscreen (YouTube-style)
    let playerClickTimer: ReturnType<typeof setTimeout> | null = null;

    document
      .getElementById("player-container")!
      .addEventListener("click", (e) => {
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

    document
      .getElementById("player-container")!
      .addEventListener("dblclick", () => {
        if (playerClickTimer) {
          clearTimeout(playerClickTimer);
          playerClickTimer = null;
        }
        fullscreenBtn.click();
      });

    const playerControls = document.getElementById("player-controls")!;
    let hideControlsTimeout: ReturnType<typeof setTimeout> | null = null;

    function showControls() {
      if (playerControls.classList.contains("player-active")) {
        playerControls.classList.remove("opacity-0", "pointer-events-none");
      }
      playerWrapper.classList.remove("cursor-none");
      clearTimeout(hideControlsTimeout!);

      if (document.fullscreenElement) {
        hideControlsTimeout = setTimeout(() => {
          if (!player.paused) {
            playerControls.classList.add("opacity-0", "pointer-events-none");
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
        }
      }
    });

    document.addEventListener("fullscreenchange", () => {
      showControls();
    });

    player.addEventListener("ended", () => {
      if (isRepeat) {
        player.currentTime = 0;
        safePlay();
        return;
      }
      playNext();
    });

    document.addEventListener("keydown", (e) => {
      // Don't hijack keys while typing in the search box
      if (document.activeElement === search) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          playPauseBtn.click();
          break;

        case "ArrowRight":
          e.preventDefault();
          player.currentTime = Math.min(
            player.currentTime + 5,
            player.duration || 0,
          );
          flashSeekIndicator(5);
          break;

        case "ArrowLeft":
          e.preventDefault();
          player.currentTime = Math.max(player.currentTime - 5, 0);
          flashSeekIndicator(-5);
          break;

        case "ArrowUp":
          e.preventDefault();
          player.volume = Math.min(player.volume + 0.05, 1);
          player.muted = false;
          volumeSlider.value = String(player.volume * 100);
          updateVolumeIcon();
          flashVolumeIndicator();
          saveVolumeDebounced();
          break;

        case "ArrowDown":
          e.preventDefault();
          player.volume = Math.max(player.volume - 0.05, 0);
          volumeSlider.value = String(player.volume * 100);
          updateVolumeIcon();
          flashVolumeIndicator();
          saveVolumeDebounced();
          break;

        case "KeyM":
          muteToggleBtn.click();
          break;

        case "KeyF":
          fullscreenBtn.click();
          break;

        case "KeyN":
          playNext();
          break;

        case "KeyP":
          playPrevious();
          break;

        case "KeyS":
          shuffleBtn.click();
          break;

        case "KeyR":
          repeatBtn.click();
          break;

        case "Escape":
          if (document.fullscreenElement) document.exitFullscreen();
          break;
      }
    });

    let allFiles: MediaFile[] = [];
    let currentFolder: string | null = lastFolder ?? null;

    function formatFileName(fileName: string) {
      return fileName
        .replace(/\.[^/.]+$/, "")
        .replace(/_/g, " ")
        .replace(/\(.*?\)/g, "")
        .replace(/[-–—]\s*$/, "")
        .trim();
    }

    const VIDEO_EXTS = ["mp4", "mkv", "webm"];

    function isVideoFile(fileName: string): boolean {
      const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
      return VIDEO_EXTS.includes(ext);
    }

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

    function formatDuration(seconds: number): string {
      if (!isFinite(seconds) || seconds < 0) return "";

      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

      if (h > 0) {
        return `${h}:${m.toString().padStart(2, "0")}:${s}`;
      }
      return `${m}:${s}`;
    }

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
          if (onDuration && isFinite(video.duration))
            onDuration(video.duration);
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

          ctx.drawImage(
            video,
            sx,
            sy,
            sw,
            sh,
            0,
            0,
            canvas.width,
            canvas.height,
          );
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

    async function loadFolder(folder: string) {
      renderLoadingState(fileList);

      try {
        allFiles = await window.api.readFolder(folder);
        await renderFiles(allFiles, fileList);
        pathElement!.textContent = folder;
        currentFolder = folder;
      } catch (err) {
        console.error("Failed to read folder:", err);
        showToast(`Couldn't load folder: ${folder}`);
        fileList.innerHTML = "";
        allFiles = [];
      }
    }

    async function playFile(
      file: MediaFile,
      list: MediaFile[],
      index: number,
      isVideo: boolean,
    ) {
      currentPlaylist = list;
      currentIndex = index;
      currentPlayingPath = file.path;
      updateActiveListItem();
      setControlsEnabled(true);

      window.api.saveLastPlayed(file.path);

      document.getElementById("now-playing")!.textContent =
        file.title ?? formatFileName(file.name);

      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: file.title ?? formatFileName(file.name),
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
      } else {
        player.classList.add("hidden");
        backgroundCover.classList.remove("hidden");
        let cover = file.thumbnail;
        if (!cover) {
          const meta = await window.api.getAudioMetadata(file);
          cover = meta.cover;
          file.thumbnail = cover;
          if (meta.duration) file.duration = meta.duration;
          if (meta.title) file.title = meta.title;
        }
        const bg = cover ?? "../.././public/assets/music-placeholder.png";

        backgroundCover.style.opacity = "0";
        setTimeout(() => {
          backgroundCover.src = bg;
          backgroundCover.style.opacity = "1";
        }, 150);
      }

      await safePlay();
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
      const isVideo = isVideoFile(file.name);
      playFile(file, currentPlaylist, nextIndex, isVideo);
    }

    function playPrevious() {
      if (currentPlaylist.length === 0) return;

      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = currentPlaylist.length - 1;
      }

      const file = currentPlaylist[prevIndex];
      const isVideo = isVideoFile(file.name);
      playFile(file, currentPlaylist, prevIndex, isVideo);
    }

    async function renderFiles(files: MediaFile[], fileList: HTMLElement) {
      fileList.innerHTML = "";

      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const item = document.createElement("li");
        const isVideo = isVideoFile(file.name);
        const displayTitle = file.title ?? formatFileName(file.name);

        item.innerHTML = `
  <div class="flex items-center gap-3">
    <div class="relative w-28 aspect-video rounded overflow-hidden shrink-0 bg-zinc-800">
      <img
        src=""
        alt="Thumbnail"
        class="w-full h-full object-cover object-center"
      />
      <span
        class="duration-badge hidden absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[10px] font-medium text-white tabular-nums"
      ></span>
    </div>

    <div class="min-w-0 flex-1">
  <p class="truncate text-sm font-medium text-white item-title">
    ${displayTitle}
  </p>

  <p class="text-xs text-zinc-400">
    ${isVideo ? "Video" : "Audio"}
  </p>
</div>
  </div>
`;
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

        if (typeof file.duration === "number") {
          setDurationBadge(file.duration);
        }

        if (file.thumbnail) {
          thumbnail.src = file.thumbnail;
        } else if (!isVideo) {
          thumbnail.src = "../.././public/assets/music-placeholder.png";
        }

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
              }
            });
          }
        } else {
          if (!file.thumbnail) {
            thumbnail.src = "../.././public/assets/music-placeholder.png";
          }

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
        item.className =
          "cursor-pointer rounded-xl p-2 hover:bg-zinc-800 transition-colors" +
          (file.path === currentPlayingPath
            ? " bg-violet-500/15 ring-1 ring-violet-500/30"
            : "");
        item.addEventListener("click", () => {
          playFile(file, files, index, isVideo);
        });

        fileList.appendChild(item);
      }
    }

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

      if (width >= 250 && width <= 600) {
        sidebar.style.width = `${width}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      if (isResizing) {
        window.api.saveSidebarWidth(sidebar.offsetWidth);
      }
      isResizing = false;
    });

    search.addEventListener("input", async () => {
      const query = search.value.toLowerCase();

      const filtered = allFiles.filter((file) =>
        formatFileName(file.name).toLowerCase().includes(query),
      );
      await renderFiles(filtered, fileList);
    });
    const appLoading = document.getElementById("app-loading")!;

    if (lastFolder) {
      await loadFolder(lastFolder);

      const restoreLoading = document.getElementById("restore-loading")!;
      const lastPlayedPath = await window.api.getLastPlayed();
      if (lastPlayedPath) {
        restoreLoading.classList.remove("hidden");

        const lastIndex = allFiles.findIndex((f) => f.path === lastPlayedPath);
        if (lastIndex !== -1) {
          const file = allFiles[lastIndex];
          const isVideo = isVideoFile(file.name);

          currentPlaylist = allFiles;
          currentIndex = lastIndex;
          currentPlayingPath = file.path;
          updateActiveListItem();
          setControlsEnabled(true);

          document.getElementById("now-playing")!.textContent =
            file.title ?? formatFileName(file.name);

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
          } else {
            player.classList.add("hidden");
            backgroundCover.classList.remove("hidden");

            let cover = file.thumbnail;
            if (!cover) {
              const meta = await window.api.getAudioMetadata(file);
              cover = meta.cover;
              file.thumbnail = cover;
              if (meta.duration) file.duration = meta.duration;
              if (meta.title) {
                file.title = meta.title;
                document.getElementById("now-playing")!.textContent =
                  meta.title;
              }
            }
            const bg = cover ?? "../.././public/assets/music-placeholder.png";

            backgroundCover.style.opacity = "0";
            setTimeout(() => {
              backgroundCover.src = bg;
              backgroundCover.style.opacity = "1";
            }, 150);
          }
        }

        restoreLoading.classList.add("hidden");
      }
    }

    appLoading.classList.add("hidden");

    button?.addEventListener("click", async () => {
      const folder = await window.api.pickFolder();

      if (!folder) return;

      await window.api.saveLastFolder(folder);
      search.value = "";
      await loadFolder(folder);
    });

    document
      .getElementById("refresh-folder")
      ?.addEventListener("click", async () => {
        if (!currentFolder) {
          showToast("No folder open to refresh.", "info");
          return;
        }
        search.value = "";
        showToast("Refreshing folder...", "info", 1500);
        await loadFolder(currentFolder);
      });

    document
      .getElementById("remove-folder")
      ?.addEventListener("click", async () => {
        if (!currentFolder) return;

        await window.api.clearLastFolder();
        currentFolder = null;
        allFiles = [];
        currentPlaylist = [];
        currentIndex = -1;
        currentPlayingPath = null;

        fileList.innerHTML = "";
        pathElement!.textContent = "";
        search.value = "";

        player.pause();
        player.src = "";
        document.getElementById("now-playing")!.textContent = "Nothing Playing";
        document.getElementById("player-controls")!.classList.add("hidden");
        document.getElementById("placeholder")!.classList.remove("hidden");
        setControlsEnabled(false);

        showToast("Folder removed.", "info", 2000);
      });
    document
      .getElementById("placeholder-open-folder")
      ?.addEventListener("click", () => {
        button?.click();
      });
  }
}

init();
