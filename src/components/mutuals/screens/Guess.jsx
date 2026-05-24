import { useState, useEffect, useRef, useMemo } from "react";
import { Copy, Share2, ChevronLeft } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Progress from "../ui/Progress";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import PlayerChips from "../ui/PlayerChips";
import { members } from "../../../data/mutualsDemoData";
import { selectQuestions, fillName } from "../../../data/questions";
import { useMutuals } from "../useMutuals";
import {
  saveMutualsState,
  getMutualsState,
  withStep,
  shareUrl,
  repairParticipantId,
  getRound,
  ensureRound,
  addRoundTarget,
} from "../../../utils/mutualsStorage";
import { getBundle, submitGuesses, captureGroup } from "../../../lib/mutualsApi";
import { roomStatus } from "../../../lib/insights";
import { cx, showToast, shareOrCopy } from "../../../utils/ui";
import { track } from "../../../utils/analytics";

const SEED_OPTIONS = ["Slow walkers", "Loud chewing", "Bad texters", "Overexplaining"];

const AV = [
  { bg: "#ff4f9a", fg: "#fff" },
  { bg: "#7cdfff", fg: "#071b27" },
  { bg: "#ffd25e", fg: "#231509" },
  { bg: "#b794ff", fg: "#1c0c38" },
  { bg: "#7be495", fg: "#0b2311" },
  { bg: "#ff8b5e", fg: "#2b0b00" },
];
function toMember(p, i) {
  const c = AV[i % AV.length];
  return {
    name: p.displayName,
    emoji: (p.displayName || "?").trim().charAt(0).toUpperCase() || "?",
    bg: c.bg,
    fg: c.fg,
  };
}

// Initial target pick: people who have already answered come first, capped.
function pickTargets(others, answers, cap) {
  const score = (p) => (Object.keys(answers[p.id] || {}).length > 0 ? 1 : 0);
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, cap);
}

export default function Guess({ next }) {
  const app = useMutuals();
  const questions = useMemo(() => selectQuestions(app.activeGroupId, app.groupMode), [app.activeGroupId, app.groupMode]);
  const need = questions.length;
  const [bundle, setBundle] = useState(null);
  const [checking, setChecking] = useState(false);
  const [pollFails, setPollFails] = useState(0);
  const onPollError = () => setPollFails((f) => f + 1);

  const applyBundle = (b) => {
    setBundle(b);
    setPollFails(0);
    repairParticipantId(app.activeGroupId, b?.participants);
    if (b?.group?.mode) saveMutualsState({ groupMode: b.group.mode });
  };
  const refresh = () => {
    if (app.activeGroupId) getBundle(app.activeGroupId).then(applyBundle).catch(onPollError);
  };
  const checkAgain = () => {
    setChecking(true);
    if (!app.activeGroupId) return setChecking(false);
    getBundle(app.activeGroupId)
      .then(applyBundle)
      .catch(onPollError)
      .finally(() => setTimeout(() => setChecking(false), 400));
  };
  const unlockAsDuo = () => {
    saveMutualsState({ groupMode: "duo" });
    captureGroup();
    showToast("Switched to 1:1");
    setTimeout(refresh, 400);
  };

  // Poll the bundle continuously so late joiners surface while waiting/guessing.
  useEffect(() => {
    if (app.soloDemo) return;
    refresh();
    const id = setInterval(() => {
      if (app.activeGroupId) getBundle(app.activeGroupId).then(applyBundle).catch(onPollError);
    }, 6000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.activeGroupId, app.soloDemo]);

  const realRoom = !app.soloDemo && !!app.activeGroupId;
  const participants = bundle?.participants || [];
  const answers = bundle?.answers || {};
  const myPid = (app.participantIdsByGroup || {})[app.activeGroupId];
  const others = participants.filter((p) => p.id !== myPid);
  const cap = app.groupMode === "duo" ? 1 : 3;

  // Lock this player's target list once we know who they are and someone's here,
  // so the targets don't shuffle mid-flow. `known` powers late-joiner detection.
  useEffect(() => {
    if (!realRoom || !myPid || others.length === 0) return;
    if (getRound(app.activeGroupId)) return;
    ensureRound(
      app.activeGroupId,
      pickTargets(others, answers, cap).map((p) => p.id),
      participants.map((p) => p.id)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realRoom, myPid, others.length, app.activeGroupId, cap]);

  const round = (app.roundsByGroup || {})[app.activeGroupId] || null;
  const status = roomStatus(bundle, need);
  const lateJoiners = round ? participants.filter((p) => p.id !== myPid && !round.known.includes(p.id)) : [];

  // Real room whose data hasn't loaded yet — never show seeded/fake data.
  if (realRoom && bundle === null) {
    return (
      <Phone mood="lavender">
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-[var(--screen-pad-x)] text-center text-[#17112B]">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-black/50">your room</p>
          <h2 className="mt-4 text-5xl font-black leading-none tracking-tighter short:text-4xl">Loading room…</h2>
        </div>
      </Phone>
    );
  }

  // Seeded flow only for solo demo / no real room.
  if (!realRoom) return <SeededGuess next={next} />;

  if (others.length === 0) {
    const required = app.groupMode === "duo" ? 2 : 3;
    const needMore = Math.max(0, required - participants.length);
    return (
      <Phone mood="lavender">
        <div className="relative z-10 px-[var(--screen-pad-x)] pt-[var(--screen-pad-top)] text-center">
          <span className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
            {app.groupMode === "duo" ? "1:1 room" : "Group room"}
          </span>
        </div>
        <BottomSheet tall center>
          <p className="text-xs font-black uppercase tracking-widest text-black/35">
            {status.joined} joined · {status.answered} answered · {status.finished} finished
          </p>
          <h2 className="mt-2 text-4xl font-black leading-[0.95] tracking-tighter text-black short:text-3xl">
            {needMore > 0 ? `Need ${needMore} more ${needMore === 1 ? "person" : "people"}.` : "Ready to play."}
          </h2>
          <p className="mt-2 text-sm font-bold text-black/55">Group rooms unlock at 3. 1:1 rooms unlock at 2.</p>
          {app.groupMode === "group" && (
            <p className="mt-2 text-xs font-bold text-black/45 tiny:hidden">
              You'll guess up to 3 people. Bigger groups make better receipts as more finish.
            </p>
          )}
          <div className="mt-4 rounded-[26px] bg-[#f4f1fa] p-4 short:mt-3 short:p-3">
            <PlayerChips participants={participants} statuses={status.statuses} youId={myPid} />
          </div>
          {app.groupMode === "group" && participants.length === 2 && (
            <div className="mt-4">
              <Button tone="pink" onClick={unlockAsDuo}>
                Unlock as 1:1 now
              </Button>
            </div>
          )}
          <div className="mt-4">
            <Button
              tone="pink"
              icon={Share2}
              onClick={() =>
                shareOrCopy({
                  text: "Join my MUTUALS room — one more player unlocks the reveal.",
                  url: shareUrl(app.activeGroupId),
                })
              }
            >
              Nudge a friend
            </Button>
          </div>
          {pollFails >= 2 && (
            <p className="mt-3 text-center text-xs font-black text-[#FF4F9A]">Connection issue — tap Check again</p>
          )}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Button
              tone="lime"
              icon={Copy}
              onClick={() => {
                navigator.clipboard?.writeText(shareUrl(app.activeGroupId));
                showToast("Link copied");
              }}
            >
              Copy link
            </Button>
            <Button tone="dark" onClick={checkAgain}>
              {checking ? "Checking…" : "Check again"}
            </Button>
          </div>
        </BottomSheet>
      </Phone>
    );
  }

  const targetObjs = round
    ? round.targets.map((id) => participants.find((p) => p.id === id)).filter(Boolean)
    : pickTargets(others, answers, cap);

  return (
    <RealGuess
      next={next}
      targets={targetObjs.length ? targetObjs : pickTargets(others, answers, cap)}
      questions={questions}
      isGroup={app.groupMode === "group"}
      lateJoiners={lateJoiners}
      onAddLate={(id) => {
        addRoundTarget(app.activeGroupId, id);
        showToast("Added to your round");
      }}
    />
  );
}

function RealGuess({ next, targets, questions, isGroup, lateJoiners = [], onAddLate }) {
  const acc = useRef({}); // { [targetId]: { qid:idx } } accumulated locally
  const [ti, setTi] = useState(0);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const target = targets[ti];
  const member = toMember(target, ti);
  const q = questions[qi];
  const lastQ = qi >= questions.length - 1;
  const lastTarget = ti >= targets.length - 1;
  const late = lateJoiners[0];
  const guessNum = ti * questions.length + qi + 1;
  const guessTotal = targets.length * questions.length;
  const canBack = ti > 0 || qi > 0;
  const onBack = () => {
    if (saving || !canBack) return;
    let nti = ti;
    let nqi = qi;
    if (qi > 0) nqi = qi - 1;
    else {
      nti = ti - 1;
      nqi = questions.length - 1;
    }
    setTi(nti);
    setQi(nqi);
    setSelected(acc.current[targets[nti].id]?.[questions[nqi].id] ?? null);
  };

  const onNext = async () => {
    if (selected == null || saving) return;
    acc.current[target.id] = { ...(acc.current[target.id] || {}), [q.id]: selected };
    if (!lastQ) {
      setQi(qi + 1);
      setSelected(acc.current[target.id]?.[questions[qi + 1].id] ?? null);
      return;
    }
    if (!lastTarget) {
      setTi(ti + 1);
      setQi(0);
      setSelected(acc.current[targets[ti + 1].id]?.[questions[0].id] ?? null);
      return;
    }
    // Last question of last target: write everything, await, then complete.
    setSaving(true);
    try {
      await submitGuesses(acc.current);
    } catch {
      showToast("Couldn't save — try again");
      setSaving(false);
      return;
    }
    saveMutualsState({ revealUnlocked: true, completedSteps: withStep("Guess") });
    track("guesses_saved");
    showToast("Guesses saved");
    next();
  };

  return (
    <Phone mood="lavender">
      <div className="relative z-10 px-[var(--screen-pad-x)] pt-[var(--screen-pad-top)] text-center text-[#17112B]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-black/50">guessing {member.name}</p>
        <div className="mt-3 flex justify-center short:mt-2">
          <Avatar member={member} size="lg" />
        </div>
        <div className="mt-4 rounded-[28px] bg-white p-5 shadow-xl short:mt-3 short:rounded-[22px] short:p-4">
          <h2 className="break-words text-2xl font-black leading-tight text-black short:text-xl">{fillName(q.about, member.name)}</h2>
        </div>
      </div>
      <BottomSheet tall>
        {isGroup && (
          <p className="mb-2 text-center text-[11px] font-bold text-black/45 short:hidden">
            You'll guess up to 3 people. Bigger groups make better receipts.
          </p>
        )}
        {late && (
          <div className="mb-3 rounded-2xl bg-[#fff3c4] p-3 short:mb-2 short:p-2.5">
            <p className="text-sm font-black">{late.displayName} joined late.</p>
            <p className="mt-0.5 text-xs font-bold text-black/55 short:hidden">This reveal uses your current round.</p>
            <button
              onClick={() => onAddLate(late.id)}
              className="mt-2 w-full rounded-xl bg-black px-3 py-2 text-xs font-black text-white"
            >
              Add {late.displayName} to your guesses
            </button>
            {lateJoiners.length > 1 && (
              <p className="mt-1 text-center text-[11px] font-bold text-black/40">
                +{lateJoiners.length - 1} more joined late
              </p>
            )}
          </div>
        )}
        <Progress current={guessNum} total={guessTotal} label={`Guess ${guessNum} of ${guessTotal}`} />
        <p className="mt-4 text-center text-sm font-black text-black/50 short:mt-2 tiny:hidden">What did {member.name} actually pick?</p>
        <div className="mt-4 space-y-3 short:mt-3 short:space-y-2">
          {q.options.map((option, i) => (
            <button
              key={option}
              onClick={() => setSelected(i)}
              className={cx(
                "flex w-full items-center gap-3 rounded-3xl p-4 text-left text-sm font-black shadow-sm short:rounded-2xl short:p-3",
                i === selected ? "bg-[#7CDFFF] text-black" : "bg-[#F3EFFF] text-black"
              )}
            >
              <span
                className={cx(
                  "grid h-7 w-7 place-items-center rounded-full text-xs",
                  i === selected ? "bg-black text-white" : "bg-white text-[#6b2cff]"
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          ))}
        </div>
        <div className="mt-5 short:mt-3">
          {canBack ? (
            <div className="grid grid-cols-3 gap-3">
              <Button tone="dark" icon={ChevronLeft} onClick={onBack} className="col-span-1">
                Back
              </Button>
              <Button
                onClick={onNext}
                tone="primary"
                className={cx("col-span-2", selected == null || saving ? "pointer-events-none opacity-40" : "")}
              >
                {saving ? "Saving…" : lastQ && lastTarget ? "See the reveal" : "Next"}
              </Button>
            </div>
          ) : (
            <Button
              onClick={onNext}
              tone="primary"
              className={selected == null || saving ? "pointer-events-none opacity-40" : ""}
            >
              {saving ? "Saving…" : lastQ && lastTarget ? "See the reveal" : "Next"}
            </Button>
          )}
        </div>
      </BottomSheet>
    </Phone>
  );
}

function SeededGuess({ next }) {
  const [selected, setSelected] = useState(1);
  const onContinue = () => {
    const g = { ...(getMutualsState().guesses || {}) };
    g.Karan = { ...(g.Karan || {}), q1: selected };
    members.slice(0, 4).forEach((m, idx) => {
      g[m.name] = g[m.name] || {};
      for (let q = 1; q <= 3; q++) {
        const k = "q" + q;
        if (g[m.name][k] == null) g[m.name][k] = (idx + q) % SEED_OPTIONS.length;
      }
    });
    saveMutualsState({ guesses: g, revealUnlocked: true, completedSteps: withStep("Guess") });
    showToast("Guesses saved");
    next();
  };
  return (
    <Phone mood="lavender">
      <div className="relative z-10 px-6 pt-14 text-center text-[#17112B]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-black/50">guess your friend</p>
        <div className="mt-4 flex justify-center">
          <Avatar member={members[2]} size="lg" />
        </div>
        <h2 className="mt-4 text-4xl font-black leading-none">What did Karan pick?</h2>
      </div>
      <BottomSheet tall>
        <Progress step={5} />
        <p className="mt-4 text-center text-sm font-black text-black/50">
          Guess what your friends actually picked. The closer you are, the better you know them.
        </p>
        <div className="mt-5 space-y-3">
          {SEED_OPTIONS.map((option, i) => (
            <button
              key={option}
              onClick={() => setSelected(i)}
              className={cx(
                "flex w-full items-center gap-3 rounded-3xl p-4 text-left text-sm font-black shadow-sm",
                i === selected ? "bg-[#7CDFFF] text-black" : "bg-[#F3EFFF] text-black"
              )}
            >
              <span
                className={cx(
                  "grid h-7 w-7 place-items-center rounded-full text-xs",
                  i === selected ? "bg-black text-white" : "bg-white text-[#6b2cff]"
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          ))}
        </div>
        <div className="mt-5">
          <Button onClick={onContinue} tone="primary">
            See the reveal
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
