import { contextBridge } from "electron";
import { ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  version: "1.0.0",
  pickFolder: () => ipcRenderer.invoke("pick-folder"),
  readFolder: (path: string) => ipcRenderer.invoke("read-folder", path),
  getLastFolder: () => ipcRenderer.invoke("get-last-folder"),
  saveLastFolder: (folder: string) =>
    ipcRenderer.invoke("save-last-folder", folder),
  clearLastFolder: () => ipcRenderer.invoke("clear-last-folder"),
  getAudioMetadata: (file: any) =>
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
  saveRepeat: (repeat: boolean) => ipcRenderer.invoke("save-repeat", repeat),
  getSidebarWidth: () => ipcRenderer.invoke("get-sidebar-width"),
  saveSidebarWidth: (width: number) =>
    ipcRenderer.invoke("save-sidebar-width", width),
});
