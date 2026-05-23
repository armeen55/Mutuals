import { Trophy, HeartCrack, Eye, Heart, MessageCircle, Zap } from "lucide-react";

// --- inputs ---
// bundle = {
//   group: { id, mode },
//   participants: [{ id, displayName }],
//   answers:  { [participantId]: { [qid]: optionIndex } },   // their true self-answers
//   guesses:  { [guesserId]: { [targetId]: { [qid]: optionIndex } } },
//   completed:{ [participantId]: boolean },
// }

const pct = (x) => Math.round(x * 100);

// Accuracy of `guesser` predicting `target`: matches / overlapping questions (null if none).
function pairAccuracy(answers, guesses, guesserId, targetId) {
  const truth = answers[targetId] || {};
  const guess = (guesses[guesserId] || {})[targetId] || {};
  let total = 0;
  let correct = 0;
  for (const qid of Object.keys(guess)) {
    if (truth[qid] == null) continue;
    total += 1;
    if (guess[qid] === truth[qid]) correct += 1;
  }
  return total > 0 ? { acc: correct / total, total, correct } : null;
}

function nameOf(participants, id) {
  const p = participants.find((x) => x.id === id);
  return p ? p.displayName : String(id);
}

export function computeReadiness(bundle) {
  const { group, participants = [], completed = {} } = bundle || {};
  const required = group?.mode === "duo" ? 2 : 3;
  const completedCount = participants.filter((p) => completed[p.id]).length;
  return { required, completedCount, unlocked: completedCount >= required };
}

// Returns an array of reveal-card objects in the same shape as insightCards
// (label, stat, headline, detail, accent, icon, mood). Only includes cards it
// can actually compute from real data; sparse data yields fewer cards.
export function computeInsights(bundle) {
  const { participants = [], answers = {}, guesses = {} } = bundle || {};
  if (participants.length < 2) return [];

  // accuracy matrix over ordered pairs
  const acc = {}; // acc[g][t] = { acc, total, correct }
  for (const g of participants) {
    for (const t of participants) {
      if (g.id === t.id) continue;
      const r = pairAccuracy(answers, guesses, g.id, t.id);
      if (r) {
        acc[g.id] = acc[g.id] || {};
        acc[g.id][t.id] = r;
      }
    }
  }

  const cards = [];

  // Best Mutual Pair — highest two-way average.
  let bestPair = null;
  for (let i = 0; i < participants.length; i++) {
    for (let j = i + 1; j < participants.length; j++) {
      const a = participants[i].id;
      const b = participants[j].id;
      const ab = acc[a]?.[b];
      const ba = acc[b]?.[a];
      if (ab && ba) {
        const mutual = (ab.acc + ba.acc) / 2;
        if (!bestPair || mutual > bestPair.mutual) bestPair = { a, b, mutual };
      }
    }
  }
  if (bestPair) {
    cards.push({
      id: "power",
      label: "Power Pair",
      stat: `${pct(bestPair.mutual)}%`,
      headline: `${nameOf(participants, bestPair.a)} + ${nameOf(participants, bestPair.b)} know each other best.`,
      detail: "Highest mutual score in the group. Suspiciously accurate.",
      accent: "#d7ff2f",
      icon: Trophy,
      mood: "dark",
    });
  }

  // One-Way Street — biggest directional gap.
  let oneWay = null;
  for (const g of participants) {
    for (const t of participants) {
      if (g.id === t.id) continue;
      const gt = acc[g.id]?.[t.id];
      const tg = acc[t.id]?.[g.id];
      if (gt && tg) {
        const gap = gt.acc - tg.acc;
        if (gap > 0 && (!oneWay || gap > oneWay.gap)) oneWay = { g: g.id, t: t.id, gap };
      }
    }
  }
  if (oneWay) {
    cards.push({
      id: "oneway",
      label: "One-Way Street",
      stat: `+${pct(oneWay.gap)}`,
      headline: `${nameOf(participants, oneWay.g)} knows ${nameOf(participants, oneWay.t)}. ${nameOf(
        participants,
        oneWay.t
      )} does not know ${nameOf(participants, oneWay.g)}.`,
      detail: "A brutal asymmetry. The chat will discuss this.",
      accent: "#ff4f9a",
      icon: HeartCrack,
      mood: "yellow",
    });
  }

  // Per-participant incoming (how well others guess them) and outgoing (how well they guess others).
  const incoming = {};
  const outgoing = {};
  for (const p of participants) {
    const inVals = [];
    const outVals = [];
    for (const o of participants) {
      if (o.id === p.id) continue;
      if (acc[o.id]?.[p.id]) inVals.push(acc[o.id][p.id].acc);
      if (acc[p.id]?.[o.id]) outVals.push(acc[p.id][o.id].acc);
    }
    if (inVals.length) incoming[p.id] = inVals.reduce((s, v) => s + v, 0) / inVals.length;
    if (outVals.length) outgoing[p.id] = outVals.reduce((s, v) => s + v, 0) / outVals.length;
  }

  // Mystery Friend — lowest incoming (nobody knows them).
  const inIds = Object.keys(incoming);
  if (inIds.length) {
    const mysteryId = inIds.reduce((lo, id) => (incoming[id] < incoming[lo] ? id : lo), inIds[0]);
    cards.push({
      id: "stranger",
      label: "The Stranger",
      stat: `${pct(incoming[mysteryId])}%`,
      headline: `Nobody knows ${nameOf(participants, mysteryId)}.`,
      detail: `Average score guessing ${nameOf(participants, mysteryId)}'s answers.`,
      accent: "#7cdfff",
      icon: Eye,
      mood: "purple",
    });
  }

  // Group Glue — highest outgoing (understands the most people).
  const outIds = Object.keys(outgoing);
  if (outIds.length) {
    const glueId = outIds.reduce((hi, id) => (outgoing[id] > outgoing[hi] ? id : hi), outIds[0]);
    cards.push({
      id: "glue",
      label: "Group Glue",
      stat: `${pct(outgoing[glueId])}%`,
      headline: `${nameOf(participants, glueId)} understands the most people here.`,
      detail: "Quietly carrying the friendship economy.",
      accent: "#7be495",
      icon: Heart,
      mood: "cream",
    });

    // Confidently Wrong — lowest outgoing (thought they knew everyone).
    const wrongId = outIds.reduce((lo, id) => (outgoing[id] < outgoing[lo] ? id : lo), outIds[0]);
    if (wrongId !== glueId) {
      cards.push({
        id: "delusional",
        label: "Confidently Wrong",
        stat: `${pct(outgoing[wrongId])}%`,
        headline: `${nameOf(participants, wrongId)} thought they knew everyone.`,
        detail: "Confidence was high. Accuracy was not invited.",
        accent: "#ffbd00",
        icon: Zap,
        mood: "yellow",
      });
    }
  }

  // Blind Spot — the single (target, question) the group missed most.
  const missByTargetQ = {}; // key `${targetId}::${qid}` -> wrong count
  for (const g of participants) {
    for (const t of participants) {
      if (g.id === t.id) continue;
      const truth = answers[t.id] || {};
      const guess = (guesses[g.id] || {})[t.id] || {};
      for (const qid of Object.keys(guess)) {
        if (truth[qid] == null) continue;
        if (guess[qid] !== truth[qid]) {
          const k = `${t.id}::${qid}`;
          missByTargetQ[k] = (missByTargetQ[k] || 0) + 1;
        }
      }
    }
  }
  const blindKeys = Object.keys(missByTargetQ);
  if (blindKeys.length) {
    const worst = blindKeys.reduce((hi, k) => (missByTargetQ[k] > missByTargetQ[hi] ? k : hi), blindKeys[0]);
    const targetId = worst.split("::")[0];
    cards.push({
      id: "mismatch",
      label: "Blind Spot",
      stat: `${missByTargetQ[worst]} wrong`,
      headline: `The group misread ${nameOf(participants, targetId)}.`,
      detail: "Everyone was loud, confident, and pointing the wrong way.",
      accent: "#ff765e",
      icon: MessageCircle,
      mood: "cream",
    });
  }

  return cards;
}
