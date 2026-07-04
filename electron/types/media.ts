export const VIDEO_EXTENSIONS = [".mp4", ".mkv", ".webm"] as const;

export const AUDIO_EXTENSIONS = [
  ".mp3",
  ".wav",
  ".flac",
  ".m4a",
  ".opus",
] as const;

export const MEDIA_EXTENSIONS = [
  ...VIDEO_EXTENSIONS,
  ...AUDIO_EXTENSIONS,
] as const;

export interface MediaFile {
  name: string;
  path: string;
  thumbnail?: string | null;
  duration?: number;
  title?: string;
  metadataFetched?: boolean;
}

export function isVideoFile(fileName: string): boolean {
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  return (VIDEO_EXTENSIONS as readonly string[]).includes(ext);
}
