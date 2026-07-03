export {};

declare global {
  interface MediaFile {
    name: string;
    path: string;
    thumbnail?: string | null;
  }

  interface Window {
    api: {
      version: string;
      pickFolder: () => Promise<string | null>;
      readFolder: (folder: string) => Promise<MediaFile[]>;
      getLastFolder: () => Promise<string | null>;
      saveLastFolder: (folder: string) => Promise<void>;
      getAudioMetadata(file: any): Promise<{
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
      getRepeat: () => Promise<boolean>;
      saveRepeat: (repeat: boolean) => Promise<void>;
      getSidebarWidth: () => Promise<number>;
      saveSidebarWidth: (width: number) => Promise<void>;
    };
  }
}
