// Browser-only state layer for MUTUALS. No backend.
// Single localStorage key, a tiny pub/sub so components re-render on change.

const KEY = "mutuals.state.v1";

const DEFAULT_STATE = {
  signedUp: false,
  demoSkippedSignup: false,
  soloDemo: false,
  currentUserName: "",
  participantIdsByGroup: {}, // { [groupId]: participantId } — scoped per room
  roundsByGroup: {}, // { [groupId]: { targets:[pid], known:[pid] } } — this player's guess round
  groupMode: "duo", // 'duo' (1:1, unlocks at 2) | 'group' (3+)
  createdGroups: [], // [{ id, name, createdBy, createdAt }]
  activeGroupId: null,
  groupMembers: [], // [name, ...]
  selfAnswers: {}, // { [questionId]: optionIndex }
  guesses: {}, // { [targetName]: { [questionId]: optionIndex } }
  completedSteps: [], // [stepName, ...]
  revealUnlocked: false,
  lastVisitedAt: null,
};

let listeners = [];

export function loadMutualsState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : { ...DEFAULT_STATE };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

let state = loadMutualsState();

export function getMutualsState() {
  return state;
}

export function saveMutualsState(next) {
  state = { ...state, ...next };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore (private mode / quota)
  }
  listeners.forEach((fn) => fn(state));
  return state;
}

export function resetMutualsState() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  state = { ...DEFAULT_STATE };
  listeners.forEach((fn) => fn(state));
  return state;
}

export function subscribeMutuals(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

// Append a completed step name without duplicates.
export function withStep(name) {
  const cs = getMutualsState().completedSteps || [];
  return cs.includes(name) ? cs : [...cs, name];
}

// --- helpers ---

function prettyName(id) {
  return id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Fresh, shareable room id for every new real room (never "chaotic-six").
export function newRoomId() {
  return "m-" + Math.random().toString(36).slice(2, 9);
}

// Participant identity is scoped per room so playing multiple rooms never
// cross-contaminates answers/guesses.
export function getParticipantId(groupId) {
  if (!groupId) return null;
  return (getMutualsState().participantIdsByGroup || {})[groupId] || null;
}
export function setParticipantId(groupId, participantId) {
  if (!groupId) return;
  const map = { ...(getMutualsState().participantIdsByGroup || {}) };
  map[groupId] = participantId;
  saveMutualsState({ participantIdsByGroup: map });
}

// If our stored participant id for this room is missing or stale (not in the
// room), re-link it by matching currentUserName to a real participant. Stops
// stale local identity from making the app think it has no valid target.
export function repairParticipantId(groupId, participants) {
  const s = getMutualsState();
  if (!groupId || !s.currentUserName) return;
  const current = (s.participantIdsByGroup || {})[groupId];
  const valid = current && (participants || []).some((p) => p.id === current);
  if (valid) return;
  const match = (participants || []).find((p) => p.displayName === s.currentUserName);
  if (match) setParticipantId(groupId, match.id);
}

// --- guess round (this player's stable target list for a room) ---
// Locked in when the player first enters Guess so the targets don't shuffle
// mid-flow. `known` = participant ids present at lock time, used to detect
// people who joined late.
export function getRound(groupId) {
  if (!groupId) return null;
  return (getMutualsState().roundsByGroup || {})[groupId] || null;
}
function setRound(groupId, round) {
  if (!groupId) return;
  const map = { ...(getMutualsState().roundsByGroup || {}) };
  map[groupId] = round;
  saveMutualsState({ roundsByGroup: map });
}
export function ensureRound(groupId, targetIds, knownIds) {
  if (!groupId) return null;
  const existing = getRound(groupId);
  if (existing) return existing;
  const round = { targets: [...targetIds], known: [...knownIds] };
  setRound(groupId, round);
  return round;
}
// Append a late joiner to this player's round (and mark them known so they
// stop reading as "late").
export function addRoundTarget(groupId, targetId) {
  const r = getRound(groupId) || { targets: [], known: [] };
  const next = {
    targets: r.targets.includes(targetId) ? r.targets : [...r.targets, targetId],
    known: r.known.includes(targetId) ? r.known : [...r.known, targetId],
  };
  setRound(groupId, next);
  return next;
}

// Create the active group if it does not exist yet. Pass a fresh id from
// newRoomId() for real rooms; "chaotic-six" is reserved for the solo fallback.
export function ensureGroup(id) {
  const s = getMutualsState();
  const gid = id || s.activeGroupId || "chaotic-six";
  const exists = (s.createdGroups || []).some((g) => g.id === gid);
  const createdGroups = exists
    ? s.createdGroups
    : [
        ...(s.createdGroups || []),
        { id: gid, name: prettyName(gid), createdBy: "Armeen", createdAt: Date.now() },
      ];
  saveMutualsState({ createdGroups, activeGroupId: gid });
  return gid;
}

// Real, openable share link (query param so invite detection works on paste).
export function shareUrl(groupId) {
  const id = groupId || getMutualsState().activeGroupId || "chaotic-six";
  if (typeof window === "undefined") return `mutuals.app/g/${id}?ref=EAZO-ARMEEN`;
  return `${window.location.origin}${window.location.pathname}?group=${id}&ref=EAZO-ARMEEN`;
}

// Read an invite group id from ?group=... or #/g/...
export function readGroupFromUrl() {
  if (typeof window === "undefined") return null;
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.get("group")) return q.get("group");
    const m = (window.location.hash || "").match(/\/g\/([^/?#]+)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}
