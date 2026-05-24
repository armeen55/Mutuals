// The real question pack (36). Answer + Guess both pull the SAME room-scoped
// subset via selectQuestions(groupId, mode), so guesses are scorable against
// real self-answers.
//
// Each question has:
//   id      — stable identifier (scoring is keyed by this)
//   lean    — "duo" (intimate) | "group" (social) | "both" — orders the pack by mode
//   prompt  — first-person self-answer text (Answer screen)
//   about   — "{name}"-templated text for guessing + the Receipts reveal card
//   options — 4 guessable multiple-choice labels

export const ALL_QUESTIONS = [
  // ---- original 8 (ids unchanged) ----
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

  // ---- duo (intimate) ----
  {
    id: "q9",
    lean: "duo",
    prompt: "When I'm upset, the first thing I do is…",
    about: "When {name} is upset, the first thing they do is…",
    options: ["Go quiet", "Pick a fight", "Pretend I'm fine", "Text one person"],
  },
  {
    id: "q10",
    lean: "duo",
    prompt: "The compliment I'd replay for a week is…",
    about: "The compliment {name} would replay for a week is…",
    options: ["You're actually funny", "You really get me", "I trust you most", "You're the glue"],
  },
  {
    id: "q11",
    lean: "duo",
    prompt: "I act chill about it, but I'm not chill about…",
    about: "{name} acts chill about it, but is not chill about…",
    options: ["Being left out", "Being copied", "Being forgotten", "Being misread"],
  },
  {
    id: "q12",
    lean: "duo",
    prompt: "My most obvious tell is…",
    about: "{name}'s most obvious tell is…",
    options: ["I go silent", "I overexplain", "I joke too much", "I leave early"],
  },
  {
    id: "q13",
    lean: "duo",
    prompt: "What I'm worst at admitting is…",
    about: "What {name} is worst at admitting is…",
    options: ["That I care", "That I'm wrong", "That I'm jealous", "That I need help"],
  },
  {
    id: "q14",
    lean: "duo",
    prompt: "The fastest way to earn my loyalty is…",
    about: "The fastest way to earn {name}'s loyalty is…",
    options: ["Remember the details", "Show up uninvited", "Defend me when I'm gone", "Match my energy"],
  },
  {
    id: "q15",
    lean: "duo",
    prompt: "What I secretly want more of is…",
    about: "What {name} secretly wants more of is…",
    options: ["Reassurance", "Space", "Attention", "Unprompted plans"],
  },
  {
    id: "q16",
    lean: "duo",
    prompt: "The thing I'd never say first is…",
    about: "The thing {name} would never say first is…",
    options: ["I miss you", "I'm sorry", "I was wrong", "I'm not okay"],
  },
  {
    id: "q17",
    lean: "duo",
    prompt: "I feel closest to someone when they…",
    about: "{name} feels closest to someone when they…",
    options: ["Roast me", "Check on me", "Tell me a secret", "Just sit with me"],
  },
  {
    id: "q18",
    lean: "duo",
    prompt: "My love language is secretly…",
    about: "{name}'s love language is secretly…",
    options: ["Being remembered", "Being chosen", "Being left alone", "Being defended"],
  },

  // ---- group (social) ----
  {
    id: "q19",
    lean: "group",
    prompt: "In the group chat, I'm the one who…",
    about: "In the group chat, {name} is the one who…",
    options: ["Starts the plans", "Kills the vibe", "Lurks and screenshots", "Sends the chaos"],
  },
  {
    id: "q20",
    lean: "group",
    prompt: "The role I actually play in the group is…",
    about: "The role {name} actually plays in the group is…",
    options: ["The mom", "The instigator", "The flake", "The glue"],
  },
  {
    id: "q21",
    lean: "group",
    prompt: "I'm most likely to be late because…",
    about: "{name} is most likely to be late because…",
    options: ["Lost track of time", "Never wanted to go", "Was getting ready", "Was waiting on someone"],
  },
  {
    id: "q22",
    lean: "group",
    prompt: "At a party, you'll find me…",
    about: "At a party, you'll find {name}…",
    options: ["Running the room", "In the kitchen", "Leaving early", "Befriending the dog"],
  },
  {
    id: "q23",
    lean: "group",
    prompt: "The group secretly relies on me for…",
    about: "The group secretly relies on {name} for…",
    options: ["The plans", "The vibes", "The honesty", "The drama"],
  },
  {
    id: "q24",
    lean: "group",
    prompt: "My reputation in the group is…",
    about: "{name}'s reputation in the group is…",
    options: ["Always right", "Always late", "Always honest", "Always extra"],
  },
  {
    id: "q25",
    lean: "group",
    prompt: "When the plan falls apart, I'm the one who…",
    about: "When the plan falls apart, {name} is the one who…",
    options: ["Fixes it", "Bails first", "Says I told you so", "Makes a new plan"],
  },
  {
    id: "q26",
    lean: "group",
    prompt: "The group would describe me in one word as…",
    about: "The group would describe {name} in one word as…",
    options: ["Loyal", "Chaotic", "Reliable", "A lot"],
  },
  {
    id: "q27",
    lean: "group",
    prompt: "I'm most likely to start drama by…",
    about: "{name} is most likely to start drama by…",
    options: ["Saying the quiet part", "Going silent", "Taking sides", "Screenshotting"],
  },
  {
    id: "q28",
    lean: "group",
    prompt: "The thing I bring to every hangout is…",
    about: "The thing {name} brings to every hangout is…",
    options: ["The energy", "The snacks", "The opinions", "The late entrance"],
  },
  {
    id: "q29",
    lean: "group",
    prompt: "When someone's getting talked about, I…",
    about: "When someone's getting talked about, {name}…",
    options: ["Join in", "Defend them", "Change the subject", "Report back"],
  },

  // ---- both ----
  {
    id: "q30",
    lean: "both",
    prompt: "What do my friends get wrong about me?",
    about: "What do people get wrong about {name}?",
    options: ["I'm not mad, just quiet", "I'm not flaky, just busy", "I'm not cold, just shy", "I'm not joking, I mean it"],
  },
  {
    id: "q31",
    lean: "both",
    prompt: "What makes me feel picked is…",
    about: "What makes {name} feel picked is…",
    options: ["Being asked first", "Being remembered", "Being defended", "Being missed"],
  },
  {
    id: "q32",
    lean: "both",
    prompt: "My biggest flex I won't admit is…",
    about: "{name}'s biggest flex they won't admit is…",
    options: ["I'm always right", "I'm hard to read", "I'm low maintenance", "I'm the favorite"],
  },
  {
    id: "q33",
    lean: "both",
    prompt: "The thing I track but pretend not to is…",
    about: "The thing {name} tracks but pretends not to is…",
    options: ["Who texts back", "Who shows up", "Who remembers", "Who's fake"],
  },
  {
    id: "q34",
    lean: "both",
    prompt: "I'm at my best when I'm…",
    about: "{name} is at their best when they're…",
    options: ["Needed", "Left alone", "Hyped up", "In charge"],
  },
  {
    id: "q35",
    lean: "both",
    prompt: "My red flag I treat like a green flag is…",
    about: "{name}'s red flag they treat like a green flag is…",
    options: ["Brutally honest", "Always busy", "Never wrong", "Too much, but fun"],
  },
  {
    id: "q36",
    lean: "both",
    prompt: "The compliment I don't believe is…",
    about: "The compliment {name} doesn't believe is…",
    options: ["That I'm easy to talk to", "That I'm strong", "That I'm funny", "That I'm chill"],
  },
];

const BY_ID = Object.fromEntries(ALL_QUESTIONS.map((q) => [q.id, q]));
export function getQuestion(id) {
  return BY_ID[id] || null;
}

export function fillName(template, name) {
  return String(template || "").replace(/\{name\}/g, name || "they");
}

// Counts by lean — handy for debugging the bank balance.
export function questionCountByLean() {
  const counts = { duo: 0, group: 0, both: 0, total: ALL_QUESTIONS.length };
  for (const q of ALL_QUESTIONS) counts[q.lean] = (counts[q.lean] || 0) + 1;
  return counts;
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

// `count` of 36, stable per groupId (the SET never changes — keeps scoring honest
// even if the mode flips via "unlock as 1:1"). A new room id => a different stable
// set, so replay feels fresh. `mode` only re-ORDERS the set (duo leads intimate,
// group leads social); ordering doesn't affect scoring, which is keyed by id.
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

// A stable mode-leaning preview (e.g. for a "what you'll be asked" peek).
export function previewQuestionsForMode(mode, count = 6) {
  return selectQuestions("preview-" + (mode || "duo"), mode, count);
}
