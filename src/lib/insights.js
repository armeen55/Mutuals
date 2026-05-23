import { Trophy, HeartCrack, Eye, Heart, MessageCircle, Zap, Flame, Sparkles, Users } from "lucide-react";

// bundle = { group:{id,mode}, participants:[{id,displayName}], answers:{[pid]:{qid:idx}},
//            guesses:{[guesserId]:{[targetId]:{qid:idx}}}, completed:{[pid]:bool} }

const pct = (x) => Math.round(x * 100);

// Short, roastable topic per question (used in copy).
const TOPICS = {
  q1: "hot takes",
  q2: "real priorities",
  q3: "pressure mode",
  q4: "group-chat trigger",
};

function card(id, label, stat, headline, detail, accent, icon, mood, shareText) {
  return { id, label, stat, headline, detail, accent, icon, mood, shareText: shareText || headline };
}

function nameOf(ps, id) {
  const p = ps.find((x) => x.id === id);
  return p ? p.displayName : String(id);
}

// Accuracy of `guesser` predicting `target` over overlapping questions (null if none).
function pairAccuracy(answers, guesses, gId, tId) {
  const truth = answers[tId] || {};
  const guess = (guesses[gId] || {})[tId] || {};
  let total = 0;
  let correct = 0;
  for (const qid of Object.keys(guess)) {
    if (truth[qid] == null) continue;
    total += 1;
    if (guess[qid] === truth[qid]) correct += 1;
  }
  return total ? { acc: correct / total, total, correct } : null;
}

function buildMatrix(participants, answers, guesses) {
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
  return acc;
}

function outgoingIncoming(participants, acc) {
  const outgoing = {};
  const incoming = {};
  for (const p of participants) {
    const out = [];
    const inc = [];
    for (const o of participants) {
      if (o.id === p.id) continue;
      if (acc[p.id]?.[o.id]) out.push(acc[p.id][o.id].acc);
      if (acc[o.id]?.[p.id]) inc.push(acc[o.id][p.id].acc);
    }
    if (out.length) outgoing[p.id] = out.reduce((a, b) => a + b, 0) / out.length;
    if (inc.length) incoming[p.id] = inc.reduce((a, b) => a + b, 0) / inc.length;
  }
  return { outgoing, incoming };
}

export function computeReadiness(bundle) {
  const { group, participants = [], completed = {} } = bundle || {};
  const required = group?.mode === "duo" ? 2 : 3;
  const completedCount = participants.filter((p) => completed[p.id]).length;
  return { required, completedCount, unlocked: completedCount >= required };
}

export function computeInsights(bundle) {
  const { participants = [], answers = {}, guesses = {}, group } = bundle || {};
  if (participants.length < 2) return [];
  const acc = buildMatrix(participants, answers, guesses);
  const mode = group?.mode || (participants.length <= 2 ? "duo" : "group");
  return mode === "duo"
    ? duoDeck(participants, answers, guesses, acc)
    : groupDeck(participants, answers, guesses, acc);
}

// -------------------------------- DUO ---------------------------------------
function biggestMiss(participants, answers, guesses) {
  for (const g of participants) {
    for (const t of participants) {
      if (g.id === t.id) continue;
      const truth = answers[t.id] || {};
      const guess = (guesses[g.id] || {})[t.id] || {};
      for (const qid of ["q3", "q1", "q2", "q4"]) {
        if (truth[qid] != null && guess[qid] != null && guess[qid] !== truth[qid]) {
          return { guesser: nameOf(participants, g.id), target: nameOf(participants, t.id), qid };
        }
      }
    }
  }
  return null;
}

function duoDeck(participants, answers, guesses, acc) {
  const [A, B] = participants;
  const ab = acc[A.id]?.[B.id]; // A guessing B
  const ba = acc[B.id]?.[A.id]; // B guessing A
  const cards = [];

  // Winner
  if (ab && ba) {
    if (ab.acc !== ba.acc) {
      const aWins = ab.acc > ba.acc;
      const w = aWins ? A : B;
      const l = aWins ? B : A;
      const d = aWins ? ab : ba;
      cards.push(
        card(
          "winner",
          "Winner",
          `${pct(d.acc)}%`,
          `${w.displayName} knows ${l.displayName} better.`,
          `${w.displayName} got ${d.correct}/${d.total} right. Screenshot it before they get humble.`,
          "#d7ff2f",
          Trophy,
          "dark",
          `${w.displayName} knows ${l.displayName} better. Think you know your person better? Take MUTUALS.`
        )
      );
    } else {
      cards.push(
        card(
          "winner",
          "Dead Heat",
          `${pct(ab.acc)}%`,
          `${A.displayName} and ${B.displayName} are dead even.`,
          "Nobody wins. Nobody loses. Deeply annoying for everyone.",
          "#7cdfff",
          Trophy,
          "purple"
        )
      );
    }
  } else if (ab || ba) {
    const w = ab ? A : B;
    const l = ab ? B : A;
    const d = ab || ba;
    cards.push(
      card("winner", "Early Read", `${pct(d.acc)}%`, `${w.displayName} read ${l.displayName}.`, `${l.displayName} hasn't guessed back yet — get them in.`, "#d7ff2f", Trophy, "dark")
    );
  }

  // Mutual
  if (ab && ba) {
    const mutual = (ab.acc + ba.acc) / 2;
    cards.push(
      card(
        "mutual",
        "Mutual Score",
        `${pct(mutual)}%`,
        `You two are ${pct(mutual)}% mutual.`,
        mutual >= 0.75
          ? "Borderline telepathic. Or you just text way too much."
          : mutual >= 0.4
          ? "Enough to be friends. Not enough to be smug."
          : "You might be two strangers who share a group chat.",
        "#b794ff",
        Heart,
        "purple",
        `We're ${pct(mutual)}% mutual on MUTUALS. Bet you and your person can't beat it.`
      )
    );

    // One-way read
    const gap = Math.abs(ab.acc - ba.acc);
    if (gap >= 0.2) {
      const aWins = ab.acc > ba.acc;
      const reader = aWins ? A : B;
      const other = aWins ? B : A;
      cards.push(
        card(
          "oneway",
          "One-Way Read",
          `+${pct(gap)}`,
          `${reader.displayName} read ${other.displayName}. ${other.displayName} guessed vibes.`,
          "A brutal little asymmetry. The chat will absolutely hear about this.",
          "#ff4f9a",
          HeartCrack,
          "yellow"
        )
      );
    }
  }

  // Biggest miss
  const miss = biggestMiss(participants, answers, guesses);
  if (miss) {
    cards.push(
      card(
        "miss",
        "Biggest Miss",
        "whiff",
        `${miss.guesser} completely misread ${miss.target}'s ${TOPICS[miss.qid] || "answer"}.`,
        "Confidently. Loudly. Wrong.",
        "#ff765e",
        MessageCircle,
        "cream"
      )
    );
  }

  // Best read (cleanest single direction)
  const best = ab && ba ? (ab.acc >= ba.acc ? { r: A, t: B, d: ab } : { r: B, t: A, d: ba }) : ab ? { r: A, t: B, d: ab } : ba ? { r: B, t: A, d: ba } : null;
  if (best && best.d.correct >= 1) {
    cards.push(
      card(
        "bestread",
        "Best Read",
        `${best.d.correct}/${best.d.total}`,
        `${best.r.displayName} had ${best.t.displayName} figured out.`,
        "At some point this stops being friendship and starts being surveillance.",
        "#7be495",
        Sparkles,
        "purple"
      )
    );
  }

  // Final verdict
  if (ab && ba) {
    const mutual = (ab.acc + ba.acc) / 2;
    const [h, dt] =
      mutual >= 0.75
        ? ["Close enough to be dangerous.", "Lock the group chat. You two are a problem."]
        : mutual >= 0.4
        ? ["Friends. Provisionally.", "Run it back and settle it for real."]
        : ["Two strangers, one history.", "Awkward. Iconic. Send it to them anyway."];
    cards.push(card("final", "Final Verdict", "THE END", h, dt, "#d7ff2f", Flame, "dark", `${h} Find out who actually knows who — MUTUALS.`));
  }

  return cards;
}

// ------------------------------- GROUP --------------------------------------
function bestPair(participants, acc) {
  let best = null;
  for (let i = 0; i < participants.length; i++) {
    for (let j = i + 1; j < participants.length; j++) {
      const a = participants[i].id;
      const b = participants[j].id;
      const ab = acc[a]?.[b];
      const ba = acc[b]?.[a];
      if (ab && ba) {
        const m = (ab.acc + ba.acc) / 2;
        if (!best || m > best.mutual) best = { a, b, mutual: m };
      }
    }
  }
  return best;
}
function oneWayPair(participants, acc) {
  let ow = null;
  for (const g of participants) {
    for (const t of participants) {
      if (g.id === t.id) continue;
      const gt = acc[g.id]?.[t.id];
      const tg = acc[t.id]?.[g.id];
      if (gt && tg) {
        const gap = gt.acc - tg.acc;
        if (gap > 0 && (!ow || gap > ow.gap)) ow = { g: g.id, t: t.id, gap };
      }
    }
  }
  return ow;
}
function biggestBlindSpot(participants, answers, guesses) {
  const miss = {};
  for (const g of participants) {
    for (const t of participants) {
      if (g.id === t.id) continue;
      const truth = answers[t.id] || {};
      const guess = (guesses[g.id] || {})[t.id] || {};
      for (const qid of Object.keys(guess)) {
        if (truth[qid] != null && guess[qid] !== truth[qid]) miss[t.id] = (miss[t.id] || 0) + 1;
      }
    }
  }
  const keys = Object.keys(miss);
  if (!keys.length) return null;
  const worst = keys.reduce((hi, k) => (miss[k] > miss[hi] ? k : hi), keys[0]);
  return { target: nameOf(participants, worst), count: miss[worst] };
}

function groupDeck(participants, answers, guesses, acc) {
  const { outgoing, incoming } = outgoingIncoming(participants, acc);
  const outIds = Object.keys(outgoing);
  const inIds = Object.keys(incoming);
  const cards = [];

  if (outIds.length) {
    const w = outIds.reduce((hi, id) => (outgoing[id] > outgoing[hi] ? id : hi), outIds[0]);
    cards.push(
      card("winner", "Group Winner", `${pct(outgoing[w])}%`, `${nameOf(participants, w)} knows the group best.`, "Suspiciously well, honestly. We're watching.", "#d7ff2f", Trophy, "dark", `${nameOf(participants, w)} knows our group best. Bet your group has nobody this locked in — MUTUALS.`)
    );
  }
  if (inIds.length) {
    const m = inIds.reduce((lo, id) => (incoming[id] < incoming[lo] ? id : lo), inIds[0]);
    cards.push(
      card("mystery", "Most Misunderstood", `${pct(incoming[m])}%`, `Nobody actually gets ${nameOf(participants, m)}.`, `That's the group's average score guessing ${nameOf(participants, m)}. You okay?`, "#7cdfff", Eye, "purple", `Nobody in our group gets ${nameOf(participants, m)}. Find your group's mystery friend — MUTUALS.`)
    );
  }
  if (inIds.length >= 2) {
    const e = inIds.reduce((hi, id) => (incoming[id] > incoming[hi] ? id : hi), inIds[0]);
    cards.push(card("open", "Open Book", `${pct(incoming[e])}%`, `${nameOf(participants, e)} is an open book.`, "Predictable in the most loving way possible.", "#7be495", Heart, "cream"));
  }
  const pair = bestPair(participants, acc);
  if (pair) {
    cards.push(
      card("power", "Power Pair", `${pct(pair.mutual)}%`, `${nameOf(participants, pair.a)} + ${nameOf(participants, pair.b)} are locked in.`, "Highest mutual score in the group. Suspiciously accurate.", "#b794ff", Heart, "purple", `${nameOf(participants, pair.a)} + ${nameOf(participants, pair.b)} are the realest pair in our group — MUTUALS.`)
    );
  }
  const ow = oneWayPair(participants, acc);
  if (ow) {
    cards.push(
      card("oneway", "One-Way Friendship", `+${pct(ow.gap)}`, `${nameOf(participants, ow.g)} knows ${nameOf(participants, ow.t)}. ${nameOf(participants, ow.t)}? Not really.`, "A brutal asymmetry. The chat will discuss.", "#ff4f9a", HeartCrack, "yellow")
    );
  }
  if (outIds.length >= 2) {
    const w = outIds.reduce((hi, id) => (outgoing[id] > outgoing[hi] ? id : hi), outIds[0]);
    const c = outIds.reduce((lo, id) => (outgoing[id] < outgoing[lo] ? id : lo), outIds[0]);
    if (c !== w) {
      cards.push(card("delusional", "Confidently Wrong", `${pct(outgoing[c])}%`, `${nameOf(participants, c)} thought they knew everyone.`, "Confidence: high. Accuracy: not invited.", "#ffbd00", Zap, "yellow"));
    }
  }
  const blind = biggestBlindSpot(participants, answers, guesses);
  if (blind) {
    cards.push(card("blind", "Biggest Blind Spot", `${blind.count} wrong`, `The group totally misread ${blind.target}.`, "Loud, confident, pointing the wrong way.", "#ff765e", MessageCircle, "cream"));
  }
  if (outIds.length >= 2) {
    const sorted = [...outIds].sort((a, b) => outgoing[b] - outgoing[a]);
    const ranked = sorted.map((id, i) => `${i + 1}. ${nameOf(participants, id)} ${pct(outgoing[id])}%`);
    cards.push(
      card("scoreboard", "Scoreboard", `${pct(outgoing[sorted[0]])}%`, "Who knows the group, ranked.", ranked.join("   ·   "), "#7cdfff", Users, "purple", `Our group's who-knows-who scoreboard is in — MUTUALS.`)
    );
  }
  if (outIds.length) {
    const w = outIds.reduce((hi, id) => (outgoing[id] > outgoing[hi] ? id : hi), outIds[0]);
    cards.push(card("final", "Final Roast", "THE END", `${nameOf(participants, w)} carried. The rest of you — we'll talk.`, "Send this to the group. Then run it back tomorrow.", "#d7ff2f", Flame, "dark", `Find out who actually knows who in your group — MUTUALS.`));
  }
  return cards;
}
