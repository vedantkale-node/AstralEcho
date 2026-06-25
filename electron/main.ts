import * as electron from "electron/main";
const { app, BrowserWindow } = electron;
import path from "node:path";
import { dialog, ipcMain } from "electron";
import fs from "node:fs/promises";

async function scanFolder(folderPath: string): Promise<any[]> {
  const entries = await fs.readdir(folderPath, {
    withFileTypes: true,
  });

  const media: any[] = [];

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);

    if (entry.isDirectory()) {
      media.push(...(await scanFolder(fullPath)));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();

    if (
      [".mp3", ".wav", ".flac", ".m4a", ".mp4", ".mkv", ".webm"].includes(ext)
    ) {
      media.push({
        name: entry.name,
        path: fullPath,
      });
    }
  }
  return media;
}

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
  const files = await scanFolder(folderPath);
  return files;
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
