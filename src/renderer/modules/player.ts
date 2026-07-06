import { state, formatTime } from "./state.js";
import { showToast } from "./toast.js";

export function setupPlayer() {
  const player = document.getElementById("player") as HTMLMediaElement;
  const playPauseBtn = document.getElementById("play-pause")!;
  const progress = document.getElementById("progress") as HTMLInputElement;
  const currentTimeEl = document.getElementById("current-time")!;
  const durationEl = document.getElementById("duration")!;
  const volumeSlider = document.getElementById("volume") as HTMLInputElement;
  const muteToggleBtn = document.getElementById("mute-toggle")!;

  let lastVolume = 1;

  async function safePlay() {
    try {
      await player.play();
    } catch (err) {
      console.error("Playback failed:", err);
      showToast("Couldn't play this file. It may be corrupted or unsupported.");
    }
  }
  state.safePlay = safePlay;

  player.addEventListener("error", () => {
    showToast("This file couldn't be loaded.");
  });

  playPauseBtn.addEventListener("click", () => {
    if (player.paused) safePlay();
    else player.pause();
  });

  player.addEventListener("play", () => {
    playPauseBtn.querySelector("span")!.textContent = "pause";
    flashPlayPauseIndicator(false);
    if ("mediaSession" in navigator)
      navigator.mediaSession.playbackState = "playing";
  });
  player.addEventListener("pause", () => {
    playPauseBtn.querySelector("span")!.textContent = "play_arrow";
    flashPlayPauseIndicator(true);
    if ("mediaSession" in navigator)
      navigator.mediaSession.playbackState = "paused";
  });

  player.addEventListener("loadedmetadata", () => {
    progress.max = String(player.duration);
    durationEl.textContent = formatTime(player.duration);
  });

  function updateVolumeIcon() {
    const icon = muteToggleBtn.querySelector("span")!;
    if (player.muted || player.volume === 0) icon.textContent = "volume_off";
    else if (player.volume < 0.5) icon.textContent = "volume_down";
    else icon.textContent = "volume_up";
  }

  let volumeSaveTimeout: ReturnType<typeof setTimeout> | null = null;
  function saveVolumeDebounced() {
    clearTimeout(volumeSaveTimeout!);
    volumeSaveTimeout = setTimeout(() => {
      window.api.saveVolume(player.muted ? 0 : player.volume);
    }, 400);
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
  state.flashPlayPauseIndicator = flashPlayPauseIndicator;

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
  state.flashSeekIndicator = flashSeekIndicator;

  const volumeIndicator = document.getElementById("volume-indicator")!;
  const volumeIndicatorIcon = document.getElementById("volume-indicator-icon")!;
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
  state.flashVolumeIndicator = flashVolumeIndicator;

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
      } catch (err) {
        console.debug("Ignored:", err);
      }
    }
  });

  progress.addEventListener("input", () => {
    player.currentTime = Number(progress.value);
  });

  if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler("play", () => safePlay());
    navigator.mediaSession.setActionHandler("pause", () => player.pause());
    navigator.mediaSession.setActionHandler("previoustrack", () =>
      state.playPrevious?.(),
    );
    navigator.mediaSession.setActionHandler("nexttrack", () =>
      state.playNext?.(),
    );
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

  player.addEventListener("ended", () => {
    if (state.repeatMode === "one") {
      player.currentTime = 0;
      safePlay();
      return;
    }
    state.playNext?.();
  });

  const search = document.getElementById("search") as HTMLInputElement;
  document.addEventListener("keydown", (e) => {
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
        document
          .getElementById("fullscreen")
          ?.dispatchEvent(new MouseEvent("click"));
        break;
      case "KeyN":
        state.playNext?.();
        break;
      case "KeyP":
        state.playPrevious?.();
        break;
      case "KeyS":
        document
          .getElementById("shuffle")
          ?.dispatchEvent(new MouseEvent("click"));
        break;
      case "KeyR":
        document
          .getElementById("repeat")
          ?.dispatchEvent(new MouseEvent("click"));
        break;
      case "Escape":
        if (document.fullscreenElement) document.exitFullscreen();
        break;
    }
  });

  return { player, playPauseBtn };
}
