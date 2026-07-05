export {};

declare global {
  interface MediaFile {
    name: string;
    path: string;
    thumbnail?: string | null;
    duration?: number;
    title?: string;
    metadataFetched?: boolean;
  }

  interface Window {
    api: {
      version: string;
      pickFolder: () => Promise<string | null>;
      readFolder: (folder: string) => Promise<MediaFile[]>;
      getLastFolder: () => Promise<string | null>;
      saveLastFolder: (folder: string) => Promise<void>;
      clearLastFolder: () => Promise<void>;
      getThumbnailCache(): Promise<Record<string, string>>;
      saveThumbnailCacheEntry(
        filePath: string,
        thumbnail: string,
        duration: number | null,
      ): Promise<void>;
      getAudioMetadata(file: MediaFile): Promise<{
        cover: string | null;
        duration: number | null;
        title: string | null;
      }>;
      getLastPlayed: () => Promise<string | null>;
      saveLastPlayed: (filePath: string) => Promise<void>;
      getVolume: () => Promise<number>;
      saveVolume: (volume: number) => Promise<void>;
      getShuffle: () => Promise<boolean>;
      saveShuffle: (shuffle: boolean) => Promise<void>;
      getRepeat: () => Promise<"off" | "all" | "one" | boolean>;
      saveRepeat: (repeat: "off" | "all" | "one") => Promise<void>;
      getSidebarWidth: () => Promise<number>;
      saveSidebarWidth: (width: number) => Promise<void>;
    };
  }
}
