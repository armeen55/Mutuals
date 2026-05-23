// The real question pack. Answer + Guess both pull the SAME room-scoped subset via
// selectQuestions(groupId), so guesses are scorable against real self-answers.
//
// Each question has:
//   prompt  — first-person self-answer text (Answer screen)
//   about   — "{name}"-templated text for guessing + the Receipts reveal card
//   options — 4 guessable multiple-choice labels
//   topic   — short tag used in reveal copy

export const ALL_QUESTIONS = [
  {
    id: "q1",
    prompt: "In a group chat fight, I become…",
    about: "In a group chat fight, {name} becomes…",
    options: ["The mediator", "The one making it worse", "Dead silent, screenshotting", "Typing three paragraphs"],
    topic: "group chat fights",
  },
  {
    id: "q2",
    prompt: "Stuck in jail for 24 hours, I'd be…",
    about: "Stuck in jail for 24 hours, {name} would be…",
    options: ["Befriending everyone", "Crying in the corner", "Already plotting the lawsuit", "Weirdly thriving"],
    topic: "a night in jail",
  },
  {
    id: "q3",
    prompt: "My most toxic social habit is…",
    about: "{name}'s most toxic social habit is…",
    options: ["Leaving people on read", "Canceling last minute", "Oversharing way too fast", "Never picking the place"],
    topic: "toxic habits",
  },
  {
    id: "q4",
    prompt: "Three drinks in, I become…",
    about: "Three drinks in, {name} becomes…",
    options: ["Everyone's therapist", "Glued to the dance floor", "Dangerously honest", "Trying to leave already"],
    topic: "three drinks in",
  },
  {
    id: "q5",
    prompt: "In most of my drama, I'm secretly…",
    about: "In most of {name}'s drama, {name} is secretly…",
    options: ["The victim", "The villain", "The instigator", "An innocent bystander"],
    topic: "their drama",
  },
  {
    id: "q6",
    prompt: "My red flag I pretend is a green flag is…",
    about: "{name}'s red flag they pretend is a green flag is…",
    options: ["Brutally honest", "Low maintenance", "Always right", "A lot, but worth it"],
    topic: "red flags",
  },
  {
    id: "q7",
    prompt: "The thing people most misunderstand about me is…",
    about: "The thing people most misunderstand about {name} is…",
    options: ["I'm shy, not rude", "I'm joking, not mean", "I need space, not distance", "I care more than I show"],
    topic: "being misunderstood",
  },
  {
    id: "q8",
    prompt: "I feel most cared for when someone…",
    about: "{name} feels most cared for when someone…",
    options: ["Remembers the small stuff", "Checks in first", "Shows up in person", "Defends me when I'm gone"],
    topic: "feeling cared for",
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

// 6 of 8, stable per groupId. Keeps a single game fast while varying packs room to room.
export function selectQuestions(groupId, count = 6) {
  const rng = mulberry32(hashStr(String(groupId || "default")));
  const pool = [...ALL_QUESTIONS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
