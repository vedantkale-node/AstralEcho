import * as electron from "electron/main";
const { app, BrowserWindow } = electron;
import path from "node:path";
import { dialog, ipcMain, Menu } from "electron";
import fs from "node:fs/promises";
import { parseFile } from "music-metadata";
import {
  MEDIA_EXTENSIONS,
  AUDIO_EXTENSIONS,
  type MediaFile,
} from "./types/media.js";

async function scanFolder(folderPath: string): Promise<MediaFile[]> {
  const entries = await fs.readdir(folderPath, {
    withFileTypes: true,
  });

  const media: MediaFile[] = [];

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);

    if (entry.isDirectory()) {
      media.push(...(await scanFolder(fullPath)));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();

    if ((MEDIA_EXTENSIONS as readonly string[]).includes(ext)) {
      media.push({
        name: entry.name,
        path: fullPath,
        thumbnail: null,
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

ipcMain.handle("read-folder", async (_, folderPath: unknown) => {
  if (typeof folderPath !== "string" || folderPath.trim() === "") {
    throw new Error("Invalid folder path");
  }

  const stat = await fs.stat(folderPath).catch(() => null);
  if (!stat || !stat.isDirectory()) {
    throw new Error("Folder does not exist or is not a directory");
  }

  const files = await scanFolder(folderPath);
  return files;
});

const settingsPath = path.join(app.getPath("userData"), "settings.json");

async function readSettings(): Promise<Record<string, any>> {
  try {
    const content = await fs.readFile(settingsPath, "utf8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

async function writeSettings(patch: Record<string, any>) {
  await fs.mkdir(path.dirname(settingsPath), { recursive: true });
  const current = await readSettings();
  const updated = { ...current, ...patch };
  await fs.writeFile(settingsPath, JSON.stringify(updated, null, 2));
}

ipcMain.handle("get-last-folder", async () => {
  const settings = await readSettings();
  return settings.lastFolder ?? null;
});

ipcMain.handle("save-last-folder", async (_, folder: unknown) => {
  if (typeof folder !== "string" || folder.trim() === "") return;
  await writeSettings({ lastFolder: folder });
});

ipcMain.handle("clear-last-folder", async () => {
  await writeSettings({ lastFolder: null });
});

ipcMain.handle("get-last-played", async () => {
  const settings = await readSettings();
  return settings.lastPlayedPath ?? null;
});

ipcMain.handle("save-last-played", async (_, filePath: unknown) => {
  if (typeof filePath !== "string" || filePath.trim() === "") return;
  await writeSettings({ lastPlayedPath: filePath });
});

ipcMain.handle("get-volume", async () => {
  const settings = await readSettings();
  return typeof settings.volume === "number" ? settings.volume : 1;
});

ipcMain.handle("save-volume", async (_, volume: unknown) => {
  if (
    typeof volume !== "number" ||
    !isFinite(volume) ||
    volume < 0 ||
    volume > 1
  )
    return;
  await writeSettings({ volume });
});

ipcMain.handle("get-shuffle", async () => {
  const settings = await readSettings();
  return settings.shuffle ?? false;
});

ipcMain.handle("save-shuffle", async (_, shuffle: boolean) => {
  await writeSettings({ shuffle });
});

ipcMain.handle("get-repeat", async () => {
  const settings = await readSettings();
  return settings.repeat ?? false;
});

ipcMain.handle("save-repeat", async (_, repeat: boolean) => {
  await writeSettings({ repeat });
});

ipcMain.handle("get-sidebar-width", async () => {
  const settings = await readSettings();
  return settings.sidebarWidth ?? 400;
});

ipcMain.handle("save-sidebar-width", async (_, width: unknown) => {
  if (typeof width !== "number" || !isFinite(width) || width < 0) return;
  await writeSettings({ sidebarWidth: width });
});

ipcMain.handle("get-audio-metadata", async (_, file: MediaFile) => {
  if (!file || typeof file.path !== "string" || file.path.trim() === "") {
    return { cover: null, duration: null, title: null };
  }

  const ext = path.extname(file.path).toLowerCase();

  if (!(AUDIO_EXTENSIONS as readonly string[]).includes(ext)) {
    return { cover: null, duration: null, title: null };
  }

  try {
    const metadata = await parseFile(file.path);

    let cover: string | null = null;
    const picture = metadata.common.picture?.[0];
    if (picture) {
      const mimeType = picture.format.startsWith("image/")
        ? picture.format
        : `image/${picture.format}`;
      cover = `data:${mimeType};base64,${Buffer.from(picture.data).toString("base64")}`;
    }

    return {
      cover,
      duration: metadata.format.duration ?? null,
      title: metadata.common.title ?? null,
    };
  } catch {
    return { cover: null, duration: null, title: null };
  }
});

const createWindow = async () => {
  const settings = await readSettings();
  const savedBounds = settings.windowBounds;

  const win = new BrowserWindow({
    icon: path.join(__dirname, "..", "..", "public", "assets", "icon.ico"),
    width: savedBounds?.width ?? 1235,
    height: savedBounds?.height ?? 700,
    x: savedBounds?.x,
    y: savedBounds?.y,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
  Menu.setApplicationMenu(null);
  win.loadFile(
    path.join(__dirname, "..", "..", "src", "renderer", "index.html"),
  );

  if (settings.windowMaximized) {
    win.maximize();
  }

  let saveBoundsTimeout: ReturnType<typeof setTimeout> | null = null;
  const persistBounds = () => {
    if (win.isMaximized()) return;
    clearTimeout(saveBoundsTimeout!);
    saveBoundsTimeout = setTimeout(() => {
      writeSettings({ windowBounds: win.getBounds() });
    }, 500);
  };

  win.on("resize", persistBounds);
  win.on("move", persistBounds);
  win.on("maximize", () => writeSettings({ windowMaximized: true }));
  win.on("unmaximize", () => writeSettings({ windowMaximized: false }));

  return win;
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
