// Local analytics (console + capped localStorage buffer) that also mirrors into
// the Supabase `events` table when configured. The Supabase write is strictly
// fire-and-forget and never blocks or throws into the UI; localStorage is the
// always-on fallback for local funnel debugging.
import { isSupabaseEnabled, supabase } from "../lib/supabaseClient";
import { getMutualsState, getParticipantId } from "./mutualsStorage";

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
  if (isSupabaseEnabled && supabase) {
    try {
      const s = getMutualsState();
      const gid = s.activeGroupId || null;
      const pid = gid ? getParticipantId(gid) : null;
      supabase
        .from("events")
        .insert({ event, group_id: gid, participant_id: pid, props })
        .then(
          () => {},
          () => {}
        );
    } catch {
      // ignore — analytics must never break the game
    }
  }
}

export function getEvents() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}
