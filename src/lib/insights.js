import { Trophy, HeartCrack, Eye, Heart, MessageCircle, Sparkles, Flame, Users } from "lucide-react";
import { getQuestion, fillName, fillWinner, spiceScore, isNamePick, participantOptionsForQuestion } from "../data/questions";

// bundle = { group:{id,mode}, participants:[{id,displayName}], answers:{[pid]:{qid:idx}},
//            guesses:{[guesserId]:{[targetId]:{qid:idx}}}, completed:{[pid]:bool} }

const pct = (x) => Math.round(x * 100);

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

// Per-player status derived from existing tables (no schema change):
//   participant exists           -> "joined"
//   has some answers (< need)    -> "answering"
//   has all `need` answers       -> "guessing"
//   completed[pid] === true      -> "finished"
export function roomStatus(bundle, need = 6) {
  const { participants = [], answers = {}, completed = {} } = bundle || {};
  const statuses = {};
  let answered = 0;
  let finished = 0;
  for (const p of participants) {
    const aCount = Object.keys(answers[p.id] || {}).length;
    if (completed[p.id]) {
      finished += 1;
      answered += 1;
      statuses[p.id] = "finished";
    } else if (aCount >= need) {
      answered += 1;
      statuses[p.id] = "guessing";
    } else if (aCount > 0) {
      statuses[p.id] = "answering";
    } else {
      statuses[p.id] = "joined";
    }
  }
  return { joined: participants.length, answered, finished, statuses };
}

export function computeInsights(bundle) {
  const { participants = [], answers = {}, guesses = {}, group } = bundle || {};
  if (participants.length < 2) return [];
  const acc = buildMatrix(participants, answers, guesses);
  const mode = group?.mode || (participants.length <= 2 ? "duo" : "group");
  return mode === "duo"
    ? duoDeck(participants, answers, guesses, acc)
    : groupDeck(participants, answers, guesses, acc, bundle);
}

// --------------------------- NAME-PICK (group votes) ------------------------
// Tally each name-pick question: map every answer's option_index back to the
// participant it points at (via the same frozen earliest-≤4 option list every
// player saw), then count votes. No schema change — pure read of answers.
export function namePickTallies(bundle) {
  const { participants = [], answers = {}, group } = bundle || {};
  const gid = group?.id;
  const qids = new Set();
  for (const pid of Object.keys(answers)) for (const qid of Object.keys(answers[pid] || {})) qids.add(qid);
  const out = [];
  for (const qid of qids) {
    const q = getQuestion(qid);
    if (!q || !isNamePick(q)) continue;
    const opts = participantOptionsForQuestion(q, participants, gid); // [{id,name}]
    if (opts.length < 3) continue;
    const votes = {}; // optionIndex -> count
    const voters = {}; // optionIndex -> [voterName]
    const selfVoters = []; // names who picked themselves
    let total = 0;
    for (const voter of participants) {
      const idx = answers[voter.id]?.[qid];
      if (idx == null || idx < 0 || idx >= opts.length) continue;
      total += 1;
      votes[idx] = (votes[idx] || 0) + 1;
      (voters[idx] = voters[idx] || []).push(voter.displayName);
      if (opts[idx].id === voter.id) selfVoters.push(voter.displayName);
    }
    if (!total) continue;
    const idxs = Object.keys(votes).map(Number).sort((a, b) => votes[b] - votes[a]);
    const winnerIdx = idxs[0];
    const winnerVotes = votes[winnerIdx];
    const tie = idxs.filter((i) => votes[i] === winnerVotes);
    out.push({ qid, q, opts, total, votes, voters, selfVoters, winnerIdx, winnerVotes,
      winnerName: opts[winnerIdx].name, winnerId: opts[winnerIdx].id, tie });
  }
  return out;
}

const NP_ACCENTS = ["#FF4F9A", "#FFD23F", "#35C58A", "#7B3CFF", "#7CDFFF"];

// Screenshot cards that name a person as the group's verdict. Sorted spiciest-first.
export function namePickCards(bundle) {
  const tallies = namePickTallies(bundle);
  const cards = [];
  tallies.forEach((t, i) => {
    const q = t.q;
    const winnerVoters = (t.voters[t.winnerIdx] || []).slice(0, 4);
    const receipt = {
      prompt: q.prompt,
      winnerName: t.winnerName,
      voteCount: t.winnerVotes,
      totalVotes: t.total,
      voters: winnerVoters,
      optionLabel: "GROUP VOTE",
    };
    const selfCrown = t.selfVoters.includes(t.winnerName);
    const unanimous = t.winnerVotes === t.total && t.total >= 3;
    const split = t.tie.length >= 2 && t.winnerVotes >= 2;
    let type, label, stat, headline, detail, accent, icon, mood;
    if (split) {
      const a = t.winnerName;
      const b = t.opts[t.tie[1]].name;
      type = "split"; label = "Split Decision";
      stat = `${t.winnerVotes}–${t.winnerVotes}`;
      headline = `The room split between ${a} and ${b}.`;
      detail = "No consensus. Maximum argument potential.";
      accent = "#7CDFFF"; icon = Users; mood = "purple";
      receipt.winnerName = `${a} & ${b}`;
    } else if (selfCrown) {
      type = "self"; label = "Self-Incrimination";
      stat = "SELF VOTE";
      headline = `${t.winnerName} picked themselves.`;
      detail = "Historic. At least they know.";
      accent = "#FFD23F"; icon = Flame; mood = "yellow";
    } else if (unanimous) {
      type = "all"; label = "Everybody Knew";
      stat = `${t.winnerVotes}/${t.total}`;
      headline = fillWinner(q.revealTitle, t.winnerName);
      detail = "Not a vote. A diagnosis.";
      accent = "#35C58A"; icon = Eye; mood = "dark";
    } else {
      type = "crown"; label = "Group Vote";
      stat = `${t.winnerVotes} ${t.winnerVotes === 1 ? "vote" : "votes"}`;
      headline = fillWinner(q.revealTitle, t.winnerName);
      detail = (q.detailTemplates && q.detailTemplates[0]) || "The group has spoken.";
      accent = NP_ACCENTS[i % NP_ACCENTS.length]; icon = Trophy; mood = "dark";
    }
    const priority =
      (unanimous ? 100 : 0) + (selfCrown ? 60 : 0) + (split ? 40 : 0) +
      t.winnerVotes * 10 + (q.heat || 0) + (t.total >= 3 ? 20 : 0);
    cards.push({
      id: "np-" + t.qid + "-" + type,
      label, stat, headline, detail, accent, icon, mood,
      shareText: fillWinner(q.shareText, receipt.winnerName),
      namePickReceipt: receipt,
      priority,
    });
  });
  return cards.sort((a, b) => b.priority - a.priority);
}

// The single best name-pick card (leads the group reveal). Null if no votes.
export function bestNamePickReceipt(bundle) {
  return namePickCards(bundle)[0] || null;
}

// "Armeen knew Mason would pick Ava." — a correct guess of a name-pick vote.
function guessReceiptCard(bundle) {
  const { participants = [], answers = {}, guesses = {}, group } = bundle || {};
  const gid = group?.id;
  for (const g of participants) {
    for (const t of participants) {
      if (g.id === t.id) continue;
      const gq = (guesses[g.id] || {})[t.id] || {};
      const tq = answers[t.id] || {};
      for (const qid of Object.keys(gq)) {
        const q = getQuestion(qid);
        if (!q || !isNamePick(q) || tq[qid] == null || gq[qid] !== tq[qid]) continue;
        const opts = participantOptionsForQuestion(q, participants, gid);
        const picked = opts[tq[qid]]?.name;
        if (!picked) continue;
        return card(
          "npguess", "Guess Receipt", "RIGHT",
          `${nameOf(participants, g.id)} knew ${nameOf(participants, t.id)} would pick ${picked}.`,
          "That's a dangerous amount of attention.",
          "#35C58A", Sparkles, "purple",
          `${nameOf(participants, g.id)} knew exactly who ${nameOf(participants, t.id)} would pick — MUTUALS.`
        );
      }
    }
  }
  return null;
}

// ------------------------------ RECEIPTS ------------------------------------
// The screenshot card: real question text + real option labels for a miss.
function makeReceipts(r, everyone) {
  const q = getQuestion(r.qid);
  if (!q || isNamePick(q) || !Array.isArray(q.options)) return null;
  const question = fillName(q.about, r.target);
  const guessed = q.options[r.guessIdx];
  const real = q.options[r.realIdx];
  if (guessed == null || real == null) return null;
  const c = card(
    "receipts",
    "Receipts",
    everyone ? `${r.wrongCount}/${r.total} wrong` : "WRONG",
    everyone ? "The answer everyone got wrong." : `${r.guesser} did not know ${r.target}.`,
    "Loud, confident, and wrong. This is why the group chat needs evidence.",
    "#ff4f9a",
    MessageCircle,
    "dark",
    `${question} The group said "${guessed}." Real answer: "${real}." Send this before they deny it — MUTUALS.`
  );
  return {
    ...c,
    receipts: { question, guessedLabel: everyone ? "The group guessed" : `${r.guesser} guessed`, guessed, real },
  };
}

// Single spiciest miss (used by 1:1).
function duoReceipt(participants, answers, guesses) {
  for (const g of participants) {
    for (const t of participants) {
      if (g.id === t.id) continue;
      const truth = answers[t.id] || {};
      const guess = (guesses[g.id] || {})[t.id] || {};
      const misses = Object.keys(guess)
        .filter((qid) => truth[qid] != null && guess[qid] !== truth[qid] && getQuestion(qid) && !isNamePick(getQuestion(qid)))
        .sort((a, b) => spiceScore(getQuestion(b)) - spiceScore(getQuestion(a)));
      if (misses.length) {
        const qid = misses[0];
        return { guesser: nameOf(participants, g.id), target: nameOf(participants, t.id), qid, guessIdx: guess[qid], realIdx: truth[qid] };
      }
    }
  }
  return null;
}

// The question+person the whole group most collectively whiffed (used by group).
function groupReceipt(participants, answers, guesses) {
  let best = null; // { targetId, qid, wrongCount, total, guessIdx, realIdx, rank }
  for (const t of participants) {
    const truth = answers[t.id] || {};
    for (const qid of Object.keys(truth)) {
      const gq0 = getQuestion(qid);
      if (!gq0 || isNamePick(gq0)) continue;
      const realIdx = truth[qid];
      let wrong = 0;
      let total = 0;
      const tally = {};
      for (const g of participants) {
        if (g.id === t.id) continue;
        const gq = (guesses[g.id] || {})[t.id] || {};
        if (gq[qid] == null) continue;
        total += 1;
        if (gq[qid] !== realIdx) {
          wrong += 1;
          tally[gq[qid]] = (tally[gq[qid]] || 0) + 1;
        }
      }
      if (total >= 2 && wrong > 0) {
        const sp = spiceScore(getQuestion(qid));
        const better = !best || wrong > best.wrongCount || (wrong === best.wrongCount && sp > best.sp);
        if (better) {
          const wrongIdxs = Object.keys(tally);
          const guessIdx = Number(wrongIdxs.reduce((hi, k) => (tally[k] > tally[hi] ? k : hi), wrongIdxs[0]));
          best = { targetId: t.id, qid, wrongCount: wrong, total, guessIdx, realIdx, sp };
        }
      }
    }
  }
  return best
    ? { target: nameOf(participants, best.targetId), qid: best.qid, guessIdx: best.guessIdx, realIdx: best.realIdx, wrongCount: best.wrongCount, total: best.total }
    : null;
}

// Directed pair scores + best mutual pair, for the "who knows who" map.
// Pure: derived from the existing bundle (no schema change).
export function pairScores(bundle) {
  const { participants = [], answers = {}, guesses = {} } = bundle || {};
  if (participants.length < 2) return { players: participants, edges: [], best: null };
  const acc = buildMatrix(participants, answers, guesses);
  const edges = [];
  for (const g of participants) {
    for (const t of participants) {
      if (g.id === t.id) continue;
      const r = acc[g.id]?.[t.id];
      if (r) {
        edges.push({
          from: g.id,
          fromName: nameOf(participants, g.id),
          to: t.id,
          toName: nameOf(participants, t.id),
          acc: r.acc,
          correct: r.correct,
          total: r.total,
        });
      }
    }
  }
  edges.sort((a, b) => b.acc - a.acc);
  const bp = bestPair(participants, acc);
  const best = bp
    ? { a: bp.a, b: bp.b, aName: nameOf(participants, bp.a), bName: nameOf(participants, bp.b), mutual: bp.mutual }
    : null;
  return { players: participants, edges, best };
}

// -------------------------------- DUO ---------------------------------------
// Best-friend / couple showdown.
function duoDeck(participants, answers, guesses, acc) {
  const [A, B] = participants;
  const ab = acc[A.id]?.[B.id]; // A guessing B
  const ba = acc[B.id]?.[A.id]; // B guessing A
  const cards = [];

  // Card 1 — Receipts (the miss). The first screenshot.
  const rec = duoReceipt(participants, answers, guesses);
  if (rec) {
    const c = makeReceipts(rec, false);
    if (c) cards.push(c);
  }

  // Card 2 — Winner (who knows who better).
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
          `${w.displayName} got ${d.correct}/${d.total} right. Send this before they deny it.`,
          "#d7ff2f",
          Trophy,
          "dark",
          `${w.displayName} knows ${l.displayName} better. Think you know your person better? MUTUALS.`
        )
      );
    } else {
      cards.push(
        card("winner", "Dead Heat", `${pct(ab.acc)}%`, `${A.displayName} and ${B.displayName} are dead even.`, "Nobody wins. Nobody loses. Deeply annoying for everyone.", "#7cdfff", Trophy, "purple")
      );
    }
  } else if (ab || ba) {
    const w = ab ? A : B;
    const l = ab ? B : A;
    const d = ab || ba;
    cards.push(card("winner", "Early Read", `${pct(d.acc)}%`, `${w.displayName} read ${l.displayName}.`, `${l.displayName} hasn't guessed back yet — get them in.`, "#d7ff2f", Trophy, "dark"));
  }

  // Card 3 — Mutual Score.
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

    // Card 4 — Biggest One-Way Read.
    const gap = Math.abs(ab.acc - ba.acc);
    if (gap >= 0.2) {
      const aWins = ab.acc > ba.acc;
      const reader = aWins ? A : B;
      const other = aWins ? B : A;
      cards.push(
        card("oneway", "One-Way Read", `+${pct(gap)}`, `${reader.displayName} read ${other.displayName}. ${other.displayName} was guessing blind.`, "One of you was reading. One of you was projecting.", "#ff4f9a", HeartCrack, "yellow")
      );
    }
  }

  // Card 5 — Best Read.
  const best = ab && ba ? (ab.acc >= ba.acc ? { r: A, t: B, d: ab } : { r: B, t: A, d: ba }) : ab ? { r: A, t: B, d: ab } : ba ? { r: B, t: A, d: ba } : null;
  if (best && best.d.correct >= 1) {
    cards.push(
      card("bestread", "Best Read", `${best.d.correct}/${best.d.total}`, `${best.r.displayName} had ${best.t.displayName} figured out.`, "At some point this stops being friendship and starts being surveillance.", "#7be495", Sparkles, "purple")
    );
  }

  // Final — Verdict (share climax).
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
// Group-chat drama.
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

function groupDeck(participants, answers, guesses, acc, bundle) {
  const b = bundle || { participants, answers, guesses };
  const { outgoing, incoming } = outgoingIncoming(participants, acc);
  const outIds = Object.keys(outgoing);
  const inIds = Object.keys(incoming);

  // Name-pick verdicts (the new headliners) + the cross-cutting guess receipt.
  const np = namePickCards(b);
  const gr = guessReceiptCard(b);

  // Know-who social cards, built as named vars so we can order the deck.
  let winnerCard = null;
  if (outIds.length) {
    const w = outIds.reduce((hi, id) => (outgoing[id] > outgoing[hi] ? id : hi), outIds[0]);
    winnerCard = card("winner", "Group Winner", `${pct(outgoing[w])}%`, `${nameOf(participants, w)} knows the group best.`, "Suspiciously locked in. We're watching.", "#d7ff2f", Trophy, "dark", `${nameOf(participants, w)} knows our group best. Bet your group has nobody this locked in — MUTUALS.`);
  }
  const pair = bestPair(participants, acc);
  const powerCard = pair
    ? card("power", "Power Pair", `${pct(pair.mutual)}%`, `${nameOf(participants, pair.a)} + ${nameOf(participants, pair.b)} are locked in.`, "Highest mutual score in the group. Send this before they deny it.", "#b794ff", Heart, "purple", `${nameOf(participants, pair.a)} + ${nameOf(participants, pair.b)} are the realest pair in our group — MUTUALS.`)
    : null;
  const ow = oneWayPair(participants, acc);
  const onewayCard = ow
    ? card("oneway", "One-Way Friendship", `+${pct(ow.gap)}`, `${nameOf(participants, ow.g)} knows ${nameOf(participants, ow.t)}. ${nameOf(participants, ow.t)}? Not a clue.`, "One was reading. The other was projecting.", "#ff4f9a", HeartCrack, "yellow")
    : null;
  let mysteryCard = null;
  if (inIds.length) {
    const m = inIds.reduce((lo, id) => (incoming[id] < incoming[lo] ? id : lo), inIds[0]);
    mysteryCard = card("mystery", "Most Misunderstood", `${pct(incoming[m])}%`, `Nobody actually gets ${nameOf(participants, m)}.`, `That's the group's average guessing ${nameOf(participants, m)}. You okay?`, "#7cdfff", Eye, "purple", `Nobody in our group gets ${nameOf(participants, m)}. Find your group's mystery friend — MUTUALS.`);
  }
  let scoreboardCard = null;
  if (outIds.length >= 2) {
    const sorted = [...outIds].sort((a, b2) => outgoing[b2] - outgoing[a]);
    const ranked = sorted.map((id, i) => `${i + 1}. ${nameOf(participants, id)} ${pct(outgoing[id])}%`);
    scoreboardCard = card("scoreboard", "Scoreboard", `${pct(outgoing[sorted[0]])}%`, "Who knows the group, ranked.", ranked.join("   ·   "), "#7cdfff", Users, "purple", `Our group's who-knows-who scoreboard is in — MUTUALS.`);
  }
  const recv = groupReceipt(participants, answers, guesses);
  const receiptCard = recv ? makeReceipts(recv, true) : null;
  let finalCard = null;
  if (outIds.length) {
    const w = outIds.reduce((hi, id) => (outgoing[id] > outgoing[hi] ? id : hi), outIds[0]);
    finalCard = card("final", "Final Roast", "THE END", `${nameOf(participants, w)} carried. The rest of you — we'll talk.`, "Send this to the group before they deny it. Then run it back.", "#d7ff2f", Flame, "dark", `Find out who actually knows who in your group — MUTUALS.`);
  } else if (np[0]) {
    finalCard = card("final", "Final Roast", "THE END", np[0].headline, "The group has spoken. Send the receipts, then run it back.", "#d7ff2f", Flame, "dark", np[0].shareText);
  }

  // Order: name-pick verdict leads, then who-knows-who, weaving more verdicts in.
  const order = [np[0], winnerCard, np[1], powerCard, onewayCard, np[2] || gr, receiptCard, mysteryCard, scoreboardCard, finalCard];
  const extras = [...np.slice(3), gr];
  const seen = new Set();
  const deck = [];
  for (const c of [...order, ...extras]) {
    if (!c || seen.has(c.id)) continue;
    seen.add(c.id);
    deck.push(c);
  }
  return deck;
}
