import * as electron from "electron/main";
import path from "node:path";
const { app, BrowserWindow } = electron;

import { Menu } from "electron";
import { readSettings, writeSettings } from "./ipc/settings.js";
import { registerSettingsHandlers } from "./ipc/settings.js";
import { registerThumbnailHandlers } from "./ipc/thumbnails.js";
import { registerMediaHandlers } from "./ipc/media.js";
import { registerSystemHandlers } from "./ipc/system.js";

app.setPath("userData", path.join(app.getPath("appData"), "astral-echo"));

registerSettingsHandlers();
registerThumbnailHandlers();
registerMediaHandlers();
registerSystemHandlers();

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
