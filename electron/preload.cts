import { contextBridge } from "electron";
import { ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  version: "1.0.0",
  pickFolder: () => ipcRenderer.invoke("pick-folder"),
  readFolder: (path: string) => ipcRenderer.invoke("read-folder", path),
  getLastFolder: () => ipcRenderer.invoke("get-last-folder"),
  saveLastFolder: (folder: string) =>
    ipcRenderer.invoke("save-last-folder", folder),
});
