import path from "node:path";
import { app, ipcMain } from "electron";
import fs from "node:fs/promises";

const thumbnailCachePath = path.join(
  app.getPath("userData"),
  "thumbnails.json",
);

async function readThumbnailCache(): Promise<Record<string, string>> {
  try {
    const content = await fs.readFile(thumbnailCachePath, "utf8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

async function writeThumbnailCache(cache: Record<string, string>) {
  await fs.mkdir(path.dirname(thumbnailCachePath), { recursive: true });
  await fs.writeFile(thumbnailCachePath, JSON.stringify(cache));
}

export function registerThumbnailHandlers() {
  ipcMain.handle("get-thumbnail-cache", async () => {
    return readThumbnailCache();
  });

  ipcMain.handle(
    "save-thumbnail-cache-entry",
    async (_, filePath: unknown, thumbnail: unknown, duration: unknown) => {
      if (typeof filePath !== "string" || typeof thumbnail !== "string") return;

      const cache = await readThumbnailCache();
      cache[filePath] = JSON.stringify({
        thumbnail,
        duration: typeof duration === "number" ? duration : null,
      });
      await writeThumbnailCache(cache);
    },
  );
}
