import { ipcMain, shell } from "electron";

export function registerSystemHandlers() {
  ipcMain.handle("open-external", async (_, url: unknown) => {
    if (typeof url !== "string" || !url.startsWith("https://")) return;
    await shell.openExternal(url);
  });
}
