// Dependency-free local analytics: console + a capped localStorage event buffer.
// No backend, no schema — for local funnel debugging only. Safe to no-op anywhere.
const KEY = "mutuals.events.v1";
const MAX = 200;

export function track(event, props = {}) {
  try {
    console.debug("[mutuals]", event, props);
  } catch {
    // ignore
  }
  try {
    const raw = localStorage.getItem(KEY);
    const buf = raw ? JSON.parse(raw) : [];
    buf.push({ event, props, t: Date.now() });
    if (buf.length > MAX) buf.splice(0, buf.length - MAX);
    localStorage.setItem(KEY, JSON.stringify(buf));
  } catch {
    // ignore (private mode / quota / SSR)
  }
}

export function getEvents() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}
