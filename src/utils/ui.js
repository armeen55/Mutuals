export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Minimal dependency-free toast store for demo confirmations.
// Migration note: this is UI-only sugar — safe to drop or replace.
let listeners = [];
let timer = null;

export function showToast(message) {
  listeners.forEach((fn) => fn(message));
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => listeners.forEach((fn) => fn("")), 1600);
}

export function subscribeToast(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

// Native share when available (mobile), clipboard fallback otherwise.
export async function shareOrCopy({ text = "", url = "", toast = "Link copied" }) {
  const joined = [text, url].filter(Boolean).join(" ");
  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title: "MUTUALS", text, url: url || undefined });
      return;
    }
  } catch (e) {
    if (e && e.name === "AbortError") return; // user dismissed the share sheet
  }
  try {
    await navigator.clipboard?.writeText(joined);
  } catch {
    // ignore
  }
  showToast(toast);
}
