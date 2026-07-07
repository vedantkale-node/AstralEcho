import type {} from "./electron.d.ts";
import { state, isVideoFile, formatFileName } from "./modules/state.js";
import { renderAppTemplate } from "./modules/template.js";
import { setupPlayer } from "./modules/player.js";
import { setupLibrary } from "./modules/library.js";
import { setupControls } from "./modules/controls.js";
import { showToast } from "./modules/toast.js";

const app = document.getElementById("app");

async function init() {
  if (!app) return;

  const lastFolder = await window.api.getLastFolder();
  state.thumbnailCache = await window.api.getThumbnailCache();

  app.innerHTML = renderAppTemplate();

  const { player } = setupPlayer();
  const { loadFolder, fileList } = setupLibrary(player);
  setupControls(loadFolder, fileList);

  const appLoading = document.getElementById("app-loading")!;

  if (lastFolder) {
    await loadFolder(lastFolder);

    const restoreLoading = document.getElementById("restore-loading")!;
    const lastPlayedPath = await window.api.getLastPlayed();
    if (lastPlayedPath) {
      restoreLoading.classList.remove("hidden");
      const lastIndex = state.allFiles.findIndex(
        (f) => f.path === lastPlayedPath,
      );
      if (lastIndex === -1) {
        showToast("Last played file could not be found.", "info", 3000);
      } else {
        const file = state.allFiles[lastIndex];
        const isVideo = isVideoFile(file.name);

        state.currentPlaylist = state.allFiles;
        state.currentIndex = lastIndex;
        state.currentPlayingPath = file.path;
        state.updateActiveListItem?.();
        state.setControlsEnabled?.(true);

        const restoredDisplayName = file.title ?? formatFileName(file.name);
        document.getElementById("now-playing")!.textContent =
          restoredDisplayName;
        document.getElementById("fullscreen-title-text")!.textContent =
          restoredDisplayName;

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
              document.getElementById("now-playing")!.textContent = meta.title;
              document.getElementById("fullscreen-title-text")!.textContent =
                meta.title;
            }

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
      }
      restoreLoading.classList.add("hidden");
    }
  }

  appLoading.classList.add("hidden");
}

init();
