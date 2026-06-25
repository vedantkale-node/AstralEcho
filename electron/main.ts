import * as electron from "electron/main";
const { app, BrowserWindow } = electron;
import path from "node:path";
import { dialog, ipcMain, screen } from "electron";
import fs from "node:fs/promises";

ipcMain.handle("pick-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  if (result.canceled) {
    return null;
  }

  return result.filePaths[0];
});

ipcMain.handle("read-folder", async (_, folderPath: string) => {
  const files = await fs.readdir(folderPath);

  const mediaFiles = files.filter((file) => {
    const ext = path.extname(file).toLocaleLowerCase();
    return [
      ".mp3",
      ".wav",
      ".flac",
      ".m4a",
      ".mp4",
      ".mkv",
      ".webm",
      ".opus",
    ].includes(ext);
  });
  return mediaFiles.map((file) => ({
    name: file,
    path: path.join(folderPath, file),
  }));
});

ipcMain.handle("get-last-folder", async () => {
  try {
    const settingsPath = path.join(
      process.cwd(),
      "electron",
      "storage",
      "settings.json",
    );
    const content = await fs.readFile(settingsPath, "utf8");
    console.log("content", content);
    const settings = JSON.parse(content);
    return settings.lastFolder ?? null;
  } catch {
    return null;
  }
});

ipcMain.handle("save-last-folder", async (_, folder: string) => {
  const settingsPath = path.join(
    process.cwd(),
    "electron",
    "storage",
    "settings.json",
  );

  await fs.writeFile(
    settingsPath,
    JSON.stringify({ lastFolder: folder }, null, 2),
  );
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(process.cwd(), "dist", "electron", "preload.cjs"),
    },
  });
  win.setBounds({
    x: -1540,
    y: 0,
    width: 1235,
    height: 700,
  });
  win.webContents.openDevTools();

  win.loadFile(path.join(process.cwd(), "src", "renderer", "index.html"));
};

app.whenReady().then(createWindow);
