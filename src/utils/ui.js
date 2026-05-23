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
