import { contextBridge } from "electron";
import { ipcRenderer } from "electron";
import { MediaFile } from "./types/media";

contextBridge.exposeInMainWorld("api", {
  version: "1.0.0",
  openExternal: (url: string) => ipcRenderer.invoke("open-external", url),
  pickFolder: () => ipcRenderer.invoke("pick-folder"),
  readFolder: (path: string) => ipcRenderer.invoke("read-folder", path),
  getLastFolder: () => ipcRenderer.invoke("get-last-folder"),
  saveLastFolder: (folder: string) =>
    ipcRenderer.invoke("save-last-folder", folder),
  clearLastFolder: () => ipcRenderer.invoke("clear-last-folder"),
  saveThumbnailCacheEntry: (
    filePath: string,
    thumbnail: string,
    duration: number | null,
  ) =>
    ipcRenderer.invoke(
      "save-thumbnail-cache-entry",
      filePath,
      thumbnail,
      duration,
    ),
  getFileOrder: (folder: string) =>
    ipcRenderer.invoke("get-file-order", folder),
  saveFileOrder: (folder: string, order: string[]) =>
    ipcRenderer.invoke("save-file-order", folder, order),
  getThumbnailCache: () => ipcRenderer.invoke("get-thumbnail-cache"),
  getAudioMetadata: (file: MediaFile) =>
    ipcRenderer.invoke("get-audio-metadata", file),
  getLastPlayed: () => ipcRenderer.invoke("get-last-played"),
  saveLastPlayed: (filePath: string) =>
    ipcRenderer.invoke("save-last-played", filePath),
  getVolume: () => ipcRenderer.invoke("get-volume"),
  saveVolume: (volume: number) => ipcRenderer.invoke("save-volume", volume),
  getShuffle: () => ipcRenderer.invoke("get-shuffle"),
  saveShuffle: (shuffle: boolean) =>
    ipcRenderer.invoke("save-shuffle", shuffle),
  getRepeat: () => ipcRenderer.invoke("get-repeat"),
  saveRepeat: (repeat: "off" | "all" | "one") =>
    ipcRenderer.invoke("save-repeat", repeat),
  getSidebarWidth: () => ipcRenderer.invoke("get-sidebar-width"),
  saveSidebarWidth: (width: number) =>
    ipcRenderer.invoke("save-sidebar-width", width),
});
