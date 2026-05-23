import { isSupabaseEnabled, supabase } from "./supabaseClient";
import { getMutualsState, saveMutualsState, getParticipantId, setParticipantId } from "../utils/mutualsStorage";
import { computeInsights, computeReadiness } from "./insights";

// =============================================================================
// MUTUALS data API. Real cross-device via Supabase when configured, otherwise a
// localStorage fallback (single-browser, demo-safe). Same async surface either way.
// =============================================================================

const LS_KEY = "mutuals.api.v1";

function uid() {
  try {
    return crypto.randomUUID();
  } catch {
    return "p-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

// ---------------- localStorage backend ----------------
function lsDb() {
  let parsed = {};
  try {
    parsed = JSON.parse(localStorage.getItem(LS_KEY)) || {};
  } catch {
    parsed = {};
  }
  return {
    groups: {},
    participants: {},
    answers: {},
    guesses: {},
    completed: {},
    ...parsed,
  };
}
function lsWrite(db) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(db));
  } catch {
    // ignore (quota / private mode)
  }
}

const local = {
  async createGroup({ id, mode, createdBy }) {
    const db = lsDb();
    if (!db.groups[id]) {
      db.groups[id] = { id, mode: mode || "group", createdBy: createdBy || "Host", createdAt: Date.now() };
      db.participants[id] = db.participants[id] || [];
      lsWrite(db);
    }
    return db.groups[id];
  },
  async getGroup(id) {
    return lsDb().groups[id] || null;
  },
  async joinGroup(groupId, displayName) {
    const db = lsDb();
    db.participants[groupId] = db.participants[groupId] || [];
    let p = db.participants[groupId].find((x) => x.displayName === displayName);
    if (!p) {
      p = { id: uid(), groupId, displayName, joinedAt: Date.now() };
      db.participants[groupId].push(p);
      lsWrite(db);
    }
    return p;
  },
  async saveAnswers(groupId, participantId, answersObj) {
    const db = lsDb();
    db.answers[groupId] = db.answers[groupId] || {};
    db.answers[groupId][participantId] = { ...(db.answers[groupId][participantId] || {}), ...answersObj };
    lsWrite(db);
  },
  async saveGuesses(groupId, guesserId, byTarget) {
    const db = lsDb();
    db.guesses[groupId] = db.guesses[groupId] || {};
    const cur = db.guesses[groupId][guesserId] || {};
    for (const targetId of Object.keys(byTarget)) {
      cur[targetId] = { ...(cur[targetId] || {}), ...byTarget[targetId] };
    }
    db.guesses[groupId][guesserId] = cur;
    lsWrite(db);
  },
  async setCompleted(groupId, participantId, value) {
    const db = lsDb();
    db.completed[groupId] = db.completed[groupId] || {};
    db.completed[groupId][participantId] = value;
    lsWrite(db);
  },
  async getBundle(groupId) {
    const db = lsDb();
    return {
      group: db.groups[groupId] || null,
      participants: db.participants[groupId] || [],
      answers: db.answers[groupId] || {},
      guesses: db.guesses[groupId] || {},
      completed: db.completed[groupId] || {},
    };
  },
};

// ---------------- Supabase backend ----------------
const sb = {
  async createGroup({ id, mode, createdBy }) {
    const { error } = await supabase.from("groups").upsert({ id, mode: mode || "group", created_by: createdBy || "Host" });
    if (error) throw error;
    return { id, mode: mode || "group", createdBy };
  },
  async getGroup(id) {
    const { data } = await supabase.from("groups").select("*").eq("id", id).maybeSingle();
    return data ? { id: data.id, mode: data.mode, createdBy: data.created_by } : null;
  },
  async joinGroup(groupId, displayName) {
    // Idempotent per (group_id, display_name) — race-safe.
    const { data, error } = await supabase
      .from("participants")
      .upsert({ group_id: groupId, display_name: displayName }, { onConflict: "group_id,display_name" })
      .select()
      .single();
    if (error) throw error;
    return { id: data.id, groupId, displayName };
  },
  async saveAnswers(groupId, participantId, answersObj) {
    const rows = Object.keys(answersObj).map((qid) => ({
      group_id: groupId,
      participant_id: participantId,
      question_id: qid,
      option_index: answersObj[qid],
    }));
    if (rows.length) {
      const { error } = await supabase.from("answers").upsert(rows, { onConflict: "group_id,participant_id,question_id" });
      if (error) throw error;
    }
  },
  async saveGuesses(groupId, guesserId, byTarget) {
    const rows = [];
    for (const targetId of Object.keys(byTarget)) {
      for (const qid of Object.keys(byTarget[targetId])) {
        rows.push({
          group_id: groupId,
          guesser_id: guesserId,
          target_id: targetId,
          question_id: qid,
          option_index: byTarget[targetId][qid],
        });
      }
    }
    if (rows.length) {
      const { error } = await supabase
        .from("guesses")
        .upsert(rows, { onConflict: "group_id,guesser_id,target_id,question_id" });
      if (error) throw error;
    }
  },
  async setCompleted(groupId, participantId, value) {
    const { error } = await supabase.from("participants").update({ completed: value }).eq("id", participantId);
    if (error) throw error;
  },
  async getBundle(groupId) {
    const [groupRes, partRes, ansRes, guessRes] = await Promise.all([
      supabase.from("groups").select("*").eq("id", groupId).maybeSingle(),
      supabase.from("participants").select("*").eq("group_id", groupId),
      supabase.from("answers").select("*").eq("group_id", groupId),
      supabase.from("guesses").select("*").eq("group_id", groupId),
    ]);
    // Surface real query failures (don't return empty fake-looking state). A missing
    // group row is not an error — maybeSingle() yields data:null with error:null.
    const failure = groupRes.error || partRes.error || ansRes.error || guessRes.error;
    if (failure) throw failure;
    const group = groupRes.data;
    const participants = partRes.data;
    const answersRows = ansRes.data;
    const guessRows = guessRes.data;
    const answers = {};
    (answersRows || []).forEach((r) => {
      answers[r.participant_id] = answers[r.participant_id] || {};
      answers[r.participant_id][r.question_id] = r.option_index;
    });
    const guesses = {};
    (guessRows || []).forEach((r) => {
      guesses[r.guesser_id] = guesses[r.guesser_id] || {};
      guesses[r.guesser_id][r.target_id] = guesses[r.guesser_id][r.target_id] || {};
      guesses[r.guesser_id][r.target_id][r.question_id] = r.option_index;
    });
    const completed = {};
    (participants || []).forEach((p) => {
      completed[p.id] = p.completed;
    });
    return {
      group: group ? { id: group.id, mode: group.mode, createdBy: group.created_by } : null,
      participants: (participants || []).map((p) => ({ id: p.id, displayName: p.display_name })),
      answers,
      guesses,
      completed,
    };
  },
};

const backend = isSupabaseEnabled ? sb : local;

// ---------------- public async API ----------------
export const createGroup = (args) => backend.createGroup(args);
export const getGroup = (id) => backend.getGroup(id);
export const joinGroup = (groupId, displayName) => backend.joinGroup(groupId, displayName);
export const saveAnswers = (groupId, pid, answersObj) => backend.saveAnswers(groupId, pid, answersObj);
export const saveGuesses = (groupId, gid, byTarget) => backend.saveGuesses(groupId, gid, byTarget);
export const setCompleted = (groupId, pid, value) => backend.setCompleted(groupId, pid, value);
export const getBundle = (groupId) => backend.getBundle(groupId);

export async function getInsights(groupId) {
  const bundle = await getBundle(groupId);
  return { readiness: computeReadiness(bundle), cards: computeInsights(bundle), bundle };
}

// ---------------- fire-and-forget capture helpers (used by screens) ----------------
// These never throw and never block the UI; the localStorage demo flow is the
// source of truth for rendering. This just mirrors real data into the backend.
// Resolve THIS browser's participant id for the ACTIVE room only. Never reuses
// another room's id, and never overwrites an existing room's mode/host.
async function ensureParticipant() {
  const s = getMutualsState();
  const gid = s.activeGroupId;
  if (!gid) return null;
  const existing = getParticipantId(gid);
  if (existing) return existing;
  const name = s.currentUserName || "You";
  const grp = await getGroup(gid);
  if (!grp) await createGroup({ id: gid, mode: s.groupMode || "group", createdBy: name });
  const p = await joinGroup(gid, name);
  if (p?.id) setParticipantId(gid, p.id);
  return p?.id || null;
}

// Host-only: create/configure the room. Safe to upsert mode (the host owns it).
export function captureGroup() {
  const s = getMutualsState();
  if (!s.activeGroupId) return;
  createGroup({ id: s.activeGroupId, mode: s.groupMode || "group", createdBy: s.currentUserName || "Host" }).catch(
    () => {}
  );
}

// Invitee-safe join: only creates the group as a fallback, never overwrites mode/host.
export function captureJoin(name) {
  const s = getMutualsState();
  const gid = s.activeGroupId;
  if (!gid) return;
  (async () => {
    const grp = await getGroup(gid);
    if (!grp) await createGroup({ id: gid, mode: s.groupMode || "group", createdBy: name });
    const p = await joinGroup(gid, name);
    if (p?.id) setParticipantId(gid, p.id);
  })().catch(() => {});
}

export function captureAnswers(answersObj) {
  ensureParticipant()
    .then((pid) => {
      if (pid) return saveAnswers(getMutualsState().activeGroupId, pid, answersObj);
    })
    .catch(() => {});
}

export function captureGuesses(byTarget) {
  ensureParticipant()
    .then((pid) => {
      if (pid) return saveGuesses(getMutualsState().activeGroupId, pid, byTarget);
    })
    .catch(() => {});
}

export function captureComplete() {
  ensureParticipant()
    .then((pid) => {
      if (pid) return setCompleted(getMutualsState().activeGroupId, pid, true);
    })
    .catch(() => {});
}

// Awaitable: write this user's self-answers for the active room. Throws on failure
// so the Answer screen can keep the user there instead of advancing with no data.
export async function submitAnswers(answersObj) {
  const s = getMutualsState();
  if (s.soloDemo) return; // solo: local only
  const gid = s.activeGroupId;
  const pid = await ensureParticipant();
  if (!gid || !pid) return;
  await saveAnswers(gid, pid, answersObj);
}

// Awaitable: write ALL of this user's guesses for the active room, then mark
// them complete. Used by the real Guess flow so completion never races writes.
export async function submitGuesses(byTarget) {
  const gid = getMutualsState().activeGroupId;
  const pid = await ensureParticipant();
  if (!gid || !pid) return;
  await saveGuesses(gid, pid, byTarget);
  await setCompleted(gid, pid, true);
}
