// The real question pack. Answer + Guess both pull the SAME room-scoped subset via
// selectQuestions(groupId, mode), so guesses are scorable against real self-answers.
//
// Each question has:
//   prompt  — first-person self-answer text (Answer screen)
//   about   — "{name}"-templated text for guessing + the Receipts reveal card
//   options — 4 guessable multiple-choice labels
//   lean    — "duo" (intimate) | "group" (social) | "both" — orders the pack by mode

export const ALL_QUESTIONS = [
  {
    id: "q1",
    lean: "group",
    prompt: "In conflict, I'm most likely to…",
    about: "In conflict, {name} is most likely to…",
    options: ["Go quiet and shut down", "Hit back twice as hard", "Try to fix everyone", "Disappear for a bit"],
  },
  {
    id: "q2",
    lean: "duo",
    prompt: "I pretend not to care, but I definitely do, about…",
    about: "{name} pretends not to care, but definitely does, about…",
    options: ["Being invited", "Being right", "What an ex thinks", "Being the funny one"],
  },
  {
    id: "q3",
    lean: "group",
    prompt: "My worst group-chat habit is…",
    about: "{name}'s worst group-chat habit is…",
    options: ["Leaving everyone on read", "Dry one-word replies", "Hijacking every topic", "Reacting instead of replying"],
  },
  {
    id: "q4",
    lean: "duo",
    prompt: "What makes me go quiet is…",
    about: "What makes {name} go quiet is…",
    options: ["Feeling judged", "Being talked over", "Too many people", "Someone I like is there"],
  },
  {
    id: "q5",
    lean: "duo",
    prompt: "The compliment that would hit me hardest is…",
    about: "The compliment that would hit {name} hardest is…",
    options: ["That I'm funny", "That I'm easy to trust", "That I really get people", "That I'm the strong one"],
  },
  {
    id: "q6",
    lean: "duo",
    prompt: "What I need from friends but rarely ask for is…",
    about: "What {name} needs from friends but rarely asks for is…",
    options: ["To be checked on first", "To be told I matter", "To be invited anyway", "To be left alone sometimes"],
  },
  {
    id: "q7",
    lean: "both",
    prompt: "The thing people most misunderstand about me is…",
    about: "The thing people most misunderstand about {name} is…",
    options: ["I'm shy, not rude", "I'm joking, not mean", "I need space, not distance", "I care more than I show"],
  },
  {
    id: "q8",
    lean: "group",
    prompt: "What makes me feel left out is…",
    about: "What makes {name} feel left out is…",
    options: ["Inside jokes I missed", "Plans made without me", "Being the last to know", "Everyone pairing off"],
  },
];

const BY_ID = Object.fromEntries(ALL_QUESTIONS.map((q) => [q.id, q]));
export function getQuestion(id) {
  return BY_ID[id] || null;
}

export function fillName(template, name) {
  return String(template || "").replace(/\{name\}/g, name || "they");
}

// Deterministic per-room hash so every player in a room derives the SAME pack.
function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 6 of 8, stable per groupId (the SET never changes — keeps scoring honest even if
// the mode flips via "unlock as 1:1"). `mode` only re-ORDERS the set so duo leads
// with intimate questions and group leads with social ones (order doesn't affect
// scoring, which is keyed by question id).
export function selectQuestions(groupId, mode, count = 6) {
  const rng = mulberry32(hashStr(String(groupId || "default")));
  const pool = [...ALL_QUESTIONS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const set = pool.slice(0, Math.min(count, pool.length));
  if (mode === "duo" || mode === "group") {
    const rank = (q) => (q.lean === mode ? 0 : q.lean === "both" ? 1 : 2);
    set.sort((a, b) => rank(a) - rank(b));
  }
  return set;
}
