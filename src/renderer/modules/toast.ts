export function showToast(
  message: string,
  type: "error" | "info" = "error",
  duration = 3500,
) {
  const container = document.getElementById("toast-container")!;
  const toast = document.createElement("div");
  const isError = type === "error";

  toast.className =
    "pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-white shadow-2xl backdrop-blur-md transition-all duration-300 " +
    (isError ? "bg-red-600/90" : "bg-zinc-800/90 border border-white/10");

  const icon = document.createElement("span");
  icon.className = "material-symbols-rounded text-[18px]";
  icon.textContent = isError ? "error" : "info";

  const text = document.createElement("span");
  text.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(text);
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-x-4");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
