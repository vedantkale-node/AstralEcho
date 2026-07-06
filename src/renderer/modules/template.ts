export function renderAppTemplate(): string {
  return `
      <div class="flex flex-row-reverse h-screen bg-zinc-950 text-white overflow-hidden">

  <!-- Portrait-only top bar (hidden in landscape) -->
  <div id="portrait-header" class="hidden items-center justify-between gap-2.5 px-5 py-4 border-b border-white/5 bg-zinc-900">
    <div class="flex items-center gap-2.5">
      <div class="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
        <img src="../.././public/assets/icon-main.png">
      </div>
      <h1 class="text-[15px] font-semibold tracking-tight text-white">Astral Echo</h1>
    </div>

    <p class="text-xs text-zinc-400">
      Built by
    <a
        href="#"
        id="portrait-credit-link"
        class="font-medium text-zinc-200 hover:text-violet-400 transition-colors"
      >Vedant Kale</a>
    </p>
  </div>

  <!-- App Loading Overlay -->
  <div
    id="app-loading"
    class="absolute inset-0 z-100 flex flex-col items-center justify-center gap-3 bg-zinc-950"
  >
    <span class="material-symbols-rounded text-4xl animate-spin text-violet-500">progress_activity</span>
    <p class="text-sm text-zinc-500">Loading Astral Echo...</p>
  </div>

  <!-- Sidebar -->
  <aside
  id="sidebar"
  class="relative w-100 shrink-0 flex flex-col bg-zinc-900 border-r border-white/5 shadow-2xl"
>

    <!-- App Header (logo/title only — hidden in portrait, replaced by #portrait-header) -->
    <div id="sidebar-header-logo" class="px-5 pt-6 pb-5 border-b border-white/5">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
          <img src="../.././public/assets/icon-main.png">
        </div>
        <h1 class="text-[15px] font-semibold tracking-tight text-white">Astral Echo</h1>
      </div>
    </div>

    <!-- Open Folder (always visible, both orientations) -->
    <div class="px-5 pt-5 ">
      <button
        id="pick-folder"
        class="w-full flex items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-sm font-medium px-4 py-2.5 transition-colors duration-150 shadow-lg shadow-violet-900/30"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>
        </svg>
        Open Folder
      </button>
    </div>

    <!-- NEW: Search -->
<div class="px-5 pb-2">
  <input
    id="search"
    type="text"
    placeholder="Search..."
    class="w-full rounded-lg mt-5 bg-zinc-800 px-3 py-2 text-sm text-white outline-none ring-1 ring-zinc-700 focus:ring-violet-500"
  />
</div>

    <!-- Folder Path -->
    <div class="px-5 py-3 border-b border-white/5 min-h-11 flex items-center justify-between gap-2">
    <button
      id="refresh-folder"
      title="Refresh folder"
      class="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-150"
    >
      <span class="material-symbols-rounded text-[16px]">refresh</span>
    </button>
    <p id="folder-path" class="text-xs text-zinc-500 truncate leading-relaxed flex-1"></p>

      <div class="flex items-center gap-1 shrink-0">

        <button
          id="remove-folder"
          title="Remove folder"
          class="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-500/10 active:scale-90 transition-all duration-150"
        >
          <span class="material-symbols-rounded text-[16px]">folder_off</span>
        </button>
      </div>
    </div>

    <!-- File List -->
    <div class="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
      <p class="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Library</p>
      <ul id="file-list" class="space-y-0.5"></ul>
    </div>

    <!-- Resize Handle -->
<div
  id="resize-handle"
  class="absolute top-0 left-0 h-full w-1 cursor-ew-resize hover:bg-violet-500"
></div>

    <!-- Footer credit -->
    <div id="sidebar-footer-credit" class="px-5 py-3 border-t border-white/5 text-center">
      <p class="text-[10px] text-zinc-400">
        Astral Echo · Built by
          <a
          href="#"
          id="footer-credit-link"
          class="text-zinc-500 hover:text-violet-400 transition-colors"
        >Vedant Kale</a>
      </p>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 flex flex-col bg-zinc-950 min-w-0">

    <!-- Now Playing Header -->
    <header class="shrink-0 px-8 pt-7 pb-5 border-b border-white/5">
      <p class="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1">Now Playing</p>
      <h2
        id="now-playing"
        class="text-xl font-semibold tracking-tight text-white truncate"
      >Nothing Playing</h2>
    </header>

   <div id="player-wrapper" class="flex-1 flex flex-col items-center justify-center p-8 gap-4 min-h-0 bg-zinc-950">
  <div
    id="player-container"
    class="relative w-full flex-1 flex items-center justify-center rounded-xl bg-zinc-900 shadow-2xl shadow-black/60 ring-1 ring-white/5 overflow-hidden min-h-0"
  >


  <!-- Background -->
  <img
    id="background-cover"
    src=""
    class="hidden absolute inset-0 z-10 w-full h-full object-cover bg-black/30"
  />

  <div id="background-overlay" class="hidden absolute inset-0 bg-black/50"></div>

  <!-- Placeholder -->
  <div
    id="placeholder"
    class="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 z-10 gap-4 px-8 text-center bg-zinc-900"
  >
    <span class="material-symbols-rounded text-6xl text-violet-500">library_music</span>
    <div>
      <h2 class="text-lg font-semibold text-white mb-1">No music library yet</h2>
      <p class="text-sm text-zinc-500">Open a folder to start building your library.</p>
    </div>
    <button
      id="placeholder-open-folder"
      class="flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 transition-colors duration-150"
    >
      <span class="material-symbols-rounded text-[18px]">folder_open</span>
      Open Folder
    </button>
  </div>

  <!-- Session Restore Loading -->
  <div
    id="restore-loading"
    class="hidden absolute inset-0 flex flex-col items-center justify-center gap-3 text-zinc-500 z-20 bg-zinc-900"
  >
    <span class="material-symbols-rounded text-4xl animate-spin text-violet-500">progress_activity</span>
    <p class="text-sm">Restoring your session...</p>
  </div>

  <!-- Video -->
  <video
    id="player"
    class="hidden absolute inset-0 h-full w-full object-contain z-10"
  ></video>

  <!-- Fullscreen title overlay (hidden outside fullscreen) -->
  <div
    id="fullscreen-title"
    class="hidden absolute top-0 left-0 right-0 z-30 px-8 pt-6 pb-16 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300"
  >
    <p class="text-lg font-semibold text-white truncate" id="fullscreen-title-text">Nothing Playing</p>
  </div>

  <!-- Volume Indicator -->
  <div
    id="volume-indicator"
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-md px-4 py-2 opacity-0 pointer-events-none transition-opacity duration-200"
  >
    <span id="volume-indicator-icon" class="material-symbols-rounded text-white text-[20px]">volume_up</span>
    <span id="volume-indicator-value" class="text-white text-sm font-medium tabular-nums w-9">100%</span>
  </div>

  <!-- Seek Indicator -->
  <div
    id="seek-indicator"
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-md px-4 py-2 opacity-0 pointer-events-none transition-opacity duration-200"
  >
    <span id="seek-indicator-icon" class="material-symbols-rounded text-white text-[20px]">fast_forward</span>
    <span id="seek-indicator-value" class="text-white text-sm font-medium tabular-nums">+5s</span>
  </div>

  <!-- Play/Pause Indicator -->
  <div
    id="playpause-indicator"
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-black/70 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-200"
  >
    <span id="playpause-indicator-icon" class="material-symbols-rounded text-white text-[32px]">play_arrow</span>
  </div>

  </div>

  <!-- Bottom Controls -->
  <div
    id="player-controls"
        class="hidden w-full shrink-0 rounded-xl border border-white/5 bg-zinc-900 px-6 py-4 transition-opacity duration-300"

  >

    <div class="flex flex-col items-center gap-4">





  <!-- Center -->
  <div class="w-full max-w-4xl ">



  <div class="flex items-center justify-between mb-4 px-1">

  <!-- Volume - far left -->
  <div class="flex items-center gap-2 group/volume w-32">
    <button
      id="mute-toggle"
      class="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/10 active:scale-90 active:bg-white/20 transition-all duration-150"
    >
      <span class="material-symbols-rounded text-[20px]">volume_up</span>
    </button>

    <input
      id="volume"
      type="range"
      min="0"
      max="100"
      value="100"
      class="w-0 group-hover/volume:w-20 opacity-0 group-hover/volume:opacity-100 transition-all duration-200 h-1 rounded-full accent-violet-600 cursor-pointer [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3"
    />
  </div>

  <!-- Transport controls - centered -->
  <div class="flex items-center gap-3">

    <button
      id="shuffle"
      class="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:not-[.text-violet-500]:text-white hover:bg-white/10 active:scale-90 active:bg-white/20 transition-all duration-150"
    >
      <span class="material-symbols-rounded text-[20px]">shuffle</span>
    </button>

    <button
      id="previous"
      class="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/10 active:scale-90 active:bg-white/20 transition-all duration-150"
    >
      <span class="material-symbols-rounded text-[22px]">skip_previous</span>
    </button>

    <button
      id="play-pause"
      class="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 hover:bg-violet-500 active:scale-90 active:bg-violet-700 transition-all duration-150 shadow-xl shadow-violet-900/40"
    >
      <span class="material-symbols-rounded text-[28px]">play_arrow</span>
    </button>

    <button
      id="next"
      class="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/10 active:scale-90 active:bg-white/20 transition-all duration-150"
    >
      <span class="material-symbols-rounded text-[22px]">skip_next</span>
    </button>

    <button
      id="repeat"
      class="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:not-[.text-violet-500]:text-white hover:bg-white/10 active:scale-90 active:bg-white/20 transition-all duration-150"
    >
      <span class="material-symbols-rounded text-[20px]">repeat</span>
    </button>

  </div>

  <!-- Fullscreen - far right -->
  <div class="flex items-center justify-end w-32">
    <button
      id="fullscreen"
      class="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:text-white hover:bg-white/10 active:scale-90 active:bg-white/20 transition-all duration-150"
    >
      <span class="material-symbols-rounded text-[20px]">fullscreen</span>
    </button>
  </div>

</div>


<div class="flex items-center gap-3 w-full group">

  <span
    id="current-time"
    class="w-10 text-right text-xs text-zinc-400 tabular-nums"
  >
    0:00
  </span>

  <input
    id="progress"
    type="range"
    min="0"
    max="100"
    value="0"
    class="flex-1 h-1 rounded-full accent-violet-600 cursor-pointer [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5"
  />

  <span
    id="duration"
    class="w-10 text-xs text-zinc-400 tabular-nums"
  >
    0:00
  </span>

</div>

  </div>

</div>

  </div>

</div>


  </main>
    <div id="toast-container" class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"></div>
</div>
    `;
}
