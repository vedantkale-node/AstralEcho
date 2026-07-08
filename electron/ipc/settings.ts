import path from "node:path";
import { app, ipcMain } from "electron";
import fs from "node:fs/promises";

export interface AppSettings {
  lastFolder?: string | null;
  lastPlayedPath?: string | null;
  volume?: number;
  shuffle?: boolean;
  repeat?: "off" | "all" | "one";
  sidebarWidth?: number;
  windowBounds?: { x: number; y: number; width: number; height: number };
  windowMaximized?: boolean;
  fileOrders?: Record<string, string[]>;
}

const settingsPath = path.join(app.getPath("userData"), "settings.json");

export async function readSettings(): Promise<AppSettings> {
  try {
    const content = await fs.readFile(settingsPath, "utf8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

export async function writeSettings(patch: Partial<AppSettings>) {
  await fs.mkdir(path.dirname(settingsPath), { recursive: true });
  const current = await readSettings();
  const updated = { ...current, ...patch };
  await fs.writeFile(settingsPath, JSON.stringify(updated, null, 2));
}

export function registerSettingsHandlers() {
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
    return settings.repeat ?? "off";
  });

  ipcMain.handle("save-repeat", async (_, repeat: unknown) => {
    if (repeat !== "off" && repeat !== "all" && repeat !== "one") return;
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

  ipcMain.handle("get-file-order", async (_, folder: unknown) => {
    if (typeof folder !== "string") return null;
    const settings = await readSettings();
    return settings.fileOrders?.[folder] ?? null;
  });

  ipcMain.handle(
    "save-file-order",
    async (_, folder: unknown, order: unknown) => {
      if (typeof folder !== "string" || !Array.isArray(order)) return;
      const settings = await readSettings();
      const fileOrders = settings.fileOrders ?? {};
      fileOrders[folder] = order;
      await writeSettings({ fileOrders });
    },
  );
}
