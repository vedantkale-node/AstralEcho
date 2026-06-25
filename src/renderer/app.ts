const app = document.getElementById("app");

async function init() {
  if (app) {
    const lastFolder = await window.api.getLastFolder();
    app.innerHTML = `
    <h2>Astral Echo</h2>
    <p>Version: ${window.api.version}</p>
    <button id="pick-folder">
      Pick Folder
      </button>

      <p id="folder-path"></p>
    `;

    const button = document.getElementById("pick-folder");
    const pathElement = document.getElementById("folder-path");

    if (lastFolder) {
      const files = await window.api.readFolder(lastFolder);

      const fileList = document.createElement("ul");
      fileList.id = "file-list";

      files.forEach((file: any) => {
        const item = document.createElement("li");

        item.textContent = file.name;

        item.addEventListener("click", async () => {
          const player = document.getElementById("player") as HTMLMediaElement;

          player.src = file.path;

          await player.play();
        });

        fileList.appendChild(item);
      });

      app.appendChild(fileList);

      if (pathElement) {
        pathElement.textContent = lastFolder;
      }
    }

    button?.addEventListener("click", async () => {
      const folder = await window.api.pickFolder();
      if (!folder) return;
      await window.api.saveLastFolder(folder);
      console.log(folder);
      const files = await window.api.readFolder(folder);
      console.log(files);

      const existingList = document.getElementById("file-list");
      if (existingList) {
        existingList.remove();
      }
      const fileList = document.createElement("ul");
      fileList.id = "file-list";

      files.forEach((file: any) => {
        const item = document.createElement("li");
        item.textContent = file.name;

        item.addEventListener("click", async () => {
          const player = document.getElementById("player") as HTMLMediaElement;
          player.src = file.path;
          await player.play();
        });

        fileList.appendChild(item);
      });

      app.appendChild(fileList);

      if (pathElement) {
        pathElement.textContent = folder ?? "No folder selected";
      }
    });
  }
}

init();
