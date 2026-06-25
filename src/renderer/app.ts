const app = document.getElementById("app");

async function init() {
  if (app) {
    const lastFolder = await window.api.getLastFolder();

    app.innerHTML = `
      <div class="flex flex-row-reverse h-screen bg-zinc-950 text-white overflow-hidden">

  <!-- Sidebar -->
  <aside class="w-72 shrink-0 flex flex-col bg-zinc-900 border-r border-white/5 shadow-2xl">

    <!-- App Header -->
    <div class="px-5 pt-6 pb-5 border-b border-white/5">
      <div class="flex items-center gap-2.5 mb-5">
        <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 0 0-1.196-.98l-10 2A1 1 0 0 0 6 5v6.499A3 3 0 1 0 8 14V8.82l8-1.6V11.5A3 3 0 1 0 18 14V3z"/>
          </svg>
        </div>
        <h1 class="text-[15px] font-semibold tracking-tight text-white">Astral Echo</h1>
      </div>

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

    <input
  id="search"
  type="text"
  placeholder="Search..."
  class="w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm outline-none ring-1 ring-zinc-700 focus:ring-violet-500"
/>

    <!-- Folder Path -->
    <div class="px-5 py-3 border-b border-white/5 min-h-[2.75rem] flex items-center">
      <p id="folder-path" class="text-xs text-zinc-500 truncate leading-relaxed"></p>
    </div>

    <!-- File List -->
    <div class="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700">
      <p class="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Library</p>
      <ul id="file-list" class="space-y-0.5"></ul>
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

    <!-- Player Area -->
<div class="flex-1 flex items-center justify-center p-8 min-h-0">
  <div
    id="player-container"
    class="relative w-full h-full flex items-center justify-center rounded-xl bg-zinc-900 shadow-2xl shadow-black/60 ring-1 ring-white/5 overflow-hidden"
  >
    <!-- Placeholder -->
    <div
      id="placeholder"
      class="absolute inset-0 flex flex-col items-center justify-center text-zinc-500"
    >
      <div class="text-7xl mb-4">✨</div>

      <h2 class="text-2xl font-semibold text-white">
        Astral Echo
      </h2>

      <p class="mt-2 text-sm">
        Select a song or video to begin.
      </p>
    </div>

    <!-- Player -->
    <video
      id="player"
      controls
      class="hidden h-full w-full object-contain"
    ></video>
  </div>
</div>

  </main>
</div>
    `;

    const button = document.getElementById("pick-folder");
    const pathElement = document.getElementById("folder-path");
    const fileList = document.getElementById("file-list")!;

    function formatFileName(fileName: string) {
      return fileName
        .replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/_/g, " ") // _ -> space
        .replace(/\(.*?\)/g, "") // Remove (...) groups
        .trim();
    }
    function renderFiles(files: any[], fileList: HTMLElement) {
      fileList.innerHTML = "";

      files.forEach((file) => {
        const item = document.createElement("li");
        const ext = file.name.split(".").pop()?.toLowerCase();
        const isVideo = ["mp4", "mkv", "webm"].includes(ext ?? "");
        item.textContent = `${isVideo ? "🎬" : "🎵"} ${formatFileName(file.name)}`;
        item.title = file.name;
        item.className =
          "cursor-pointer rounded px-2 py-1 hover:bg-zinc-800 truncate whitespace-nowrap overflow-hidden";

        item.addEventListener("click", async () => {
          const player = document.getElementById("player") as HTMLMediaElement;
          const nowPlaying = document.getElementById("now-playing");
          const placeholder = document.getElementById("placeholder");

          player.src = file.path;

          player.classList.remove("hidden");
          placeholder?.classList.add("hidden");

          if (nowPlaying) {
            nowPlaying.textContent = file.name;
          }

          await player.play();
        });

        fileList.appendChild(item);
      });
    }

    // Load last opened folder
    if (lastFolder) {
      const files = await window.api.readFolder(lastFolder);

      renderFiles(files, fileList);

      pathElement!.textContent = lastFolder;
    }
    button?.addEventListener("click", async () => {
      const folder = await window.api.pickFolder();

      if (!folder) return;

      await window.api.saveLastFolder(folder);

      const files = await window.api.readFolder(folder);

      renderFiles(files, fileList);

      pathElement!.textContent = folder;
    });
  }
}

init();
