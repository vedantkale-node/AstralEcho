export {};

declare global {
  interface Window {
    api: {
      version: string;
      pickFolder: () => Promise<string | null>;
      readFolder: (folderPath: string) => Promise<string[]>;
      getLastFolder: () => Promise<string | null>;
      saveLastFolder: (folder: string) => Promise<void>;
    };
  }
}
