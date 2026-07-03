# 🌌 Astral Echo

A desktop media player built with Electron and TypeScript. Astral Echo scans a local folder for audio and video files, builds a searchable library, and plays media through a focused, minimal player interface.

> **Status:** Active development. Packaging and production builds are not yet finalized — see [Known Limitations & Roadmap](#-known-limitations--roadmap).

<!-- TODO: Add a screenshot or short GIF of the player UI here. This is the highest-impact missing piece for a media player project. -->

## ✨ Features

- Pick a local folder and recursively scan it for audio/video media
- Auto-generated, searchable media library (search by cleaned file name)
- Video thumbnail generation in the renderer
- Embedded audio artwork extraction (via `music-metadata`)
- Persistent state: last opened folder, last played file, and volume
- Full playback controls — play/pause, next/previous, shuffle, repeat, mute, volume, seek, fullscreen
- Keyboard shortcuts for common playback actions
- Resizable library sidebar

## 🎞️ Supported Media

The main process scans for the following file extensions:

| Type  | Extensions                               |
| ----- | ---------------------------------------- |
| Audio | `.mp3`, `.wav`, `.flac`, `.m4a`, `.opus` |
| Video | `.mp4`, `.mkv`, `.webm`                  |

This list controls what the scanner _indexes_ — actual playback support depends on the Electron/Chromium codec support available on the host system, so a scanned file isn't guaranteed to play on every machine.

## 🛠️ Tech Stack

| Category        | Technology       |
| --------------- | ---------------- |
| App shell       | Electron         |
| Language        | TypeScript       |
| Styling         | Tailwind CSS     |
| Metadata        | `music-metadata` |
| Package manager | pnpm             |

## ✅ Prerequisites

- Node.js <!-- TODO: specify minimum version, e.g. 18+ -->
- pnpm <!-- TODO: specify minimum version -->

## 🚀 Getting Started

Install dependencies:

```bash
pnpm install
```

Start the app in development mode (runs Electron with TypeScript watchers):

```bash
pnpm dev
```

This runs the following concurrently:

- `pnpm watch:main` — recompiles the Electron main process on change
- `pnpm watch:renderer` — recompiles the renderer on change
- `pnpm electron` — launches the Electron app

If you're editing Tailwind styles, run the CSS watcher in a separate terminal:

```bash
pnpm build:css
```

## 🏗️ Build

Compile the main process and renderer for production:

```bash
pnpm build
```

Compiled output is written to `dist/`.

<!-- TODO: Document how to actually launch the compiled app from dist/, or note explicitly that packaging (electron-builder) isn't wired up yet and this step is currently source-only. -->

## 🔍 Quality Checks

```bash
pnpm lint            # Run ESLint
pnpm format          # Format files
pnpm format:check    # Check formatting without writing changes
```

## 📁 Project Structure

```text
.
├── electron/
│   ├── main.cts          # Electron main process — folder scanning, settings, IPC
│   ├── preload.cts       # Renderer-safe API exposed via contextBridge
│   ├── dev-runner.cjs    # Launches Electron during development
│   └── storage/          # Local development settings JSON
├── public/
│   └── assets/           # App icon and placeholder artwork
├── src/
│   └── renderer/
│       ├── app.ts        # Renderer UI and playback logic
│       ├── electron.d.ts # Window API typings
│       ├── index.html    # Renderer entry HTML
│       └── css/          # Tailwind input/output CSS
├── dist/                 # Compiled output
├── package.json
└── todo.md               # Project backlog
```

## 💾 App Data

During development, settings are stored locally at:

```text
electron/storage/settings.json
```

Currently persisted:

- Last opened folder
- Last played file path
- Volume

> Planned: migrate this to Electron's `app.getPath("userData")` for proper production-style app data handling (tracked in [todo.md](./todo.md)).

## ⌨️ Keyboard Shortcuts

| Shortcut | Action            |
| -------- | ----------------- |
| `Space`  | Play / pause      |
| `←`      | Seek backward 5s  |
| `→`      | Seek forward 5s   |
| `↑`      | Increase volume   |
| `↓`      | Decrease volume   |
| `M`      | Mute / unmute     |
| `F`      | Toggle fullscreen |
| `N`      | Next item         |
| `P`      | Previous item     |
| `S`      | Toggle shuffle    |
| `R`      | Toggle repeat     |
| `Escape` | Exit fullscreen   |

Shortcuts are disabled while the search input is focused.

## ⚠️ Known Limitations & Roadmap

Astral Echo is functional but not yet production-polished:

- **Packaging** — `electron-builder` is installed but not fully configured; there's no distributable build yet.
- **CSS pipeline** — `build:css` is currently watch-only; there's no dedicated one-shot production CSS build script.
- **Renderer architecture** — UI and playback logic currently live in a single `app.ts` file; component-level decomposition is planned.
- **Scanning at scale** — folder scanning and thumbnail generation are straightforward implementations without caching or cancellation, and may not scale well to very large libraries.

Full backlog — including playback polish, metadata caching, Electron security hardening, packaging, and tests — is tracked in [`todo.md`](./todo.md).

<!-- TODO: Add a License section once one is chosen. -->
<!-- TODO: Add a Contributing section if external contributions are welcome (even a one-liner pointing to todo.md + PR process). -->
