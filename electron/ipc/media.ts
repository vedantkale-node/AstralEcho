import path from "node:path";
import { dialog, ipcMain } from "electron";
import fs from "node:fs/promises";
import { parseFile } from "music-metadata";
import {
  MEDIA_EXTENSIONS,
  AUDIO_EXTENSIONS,
  type MediaFile,
} from "../types/media.js";

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

export function registerMediaHandlers() {
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
}
