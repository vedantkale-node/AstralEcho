import type {} from "../electron.d.ts";

export const state = {
  allFiles: [] as MediaFile[],
  currentFolder: null as string | null,
  currentPlaylist: [] as MediaFile[],
  currentIndex: -1,
  isShuffle: false,
  repeatMode: "off" as "off" | "all" | "one",
  currentPlayingPath: null as string | null,
  thumbnailCache: {} as Record<string, string>,

  safePlay: null as (() => Promise<void>) | null,
  playNext: null as (() => void) | null,
  playPrevious: null as (() => void) | null,
  flashPlayPauseIndicator: null as ((isPlaying: boolean) => void) | null,
  flashSeekIndicator: null as ((delta: number) => void) | null,
  flashVolumeIndicator: null as (() => void) | null,
  updateActiveListItem: null as (() => void) | null,
  setControlsEnabled: null as ((enabled: boolean) => void) | null,
  applyRepeatModeUI: null as (() => void) | null,
};

export function formatFileName(fileName: string) {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/_/g, " ")
    .replace(/\(.*?\)/g, "")
    .replace(/[-–—]\s*$/, "")
    .trim();
}

const VIDEO_EXTS = ["mp4", "mkv", "webm"];
export function isVideoFile(fileName: string): boolean {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return VIDEO_EXTS.includes(ext);
}

export function formatTime(sec: number) {
  if (!isFinite(sec)) return "0:00";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s}`;
  return `${m}:${s}`;
}

export function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "";
  return formatTime(seconds);
}
