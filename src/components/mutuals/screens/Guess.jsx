import { useState, useEffect } from "react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Progress from "../ui/Progress";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import { members } from "../../../data/mutualsDemoData";
import { useMutuals } from "../useMutuals";
import { saveMutualsState, getMutualsState, withStep, shareUrl } from "../../../utils/mutualsStorage";
import { captureGuesses, captureComplete, getBundle } from "../../../lib/mutualsApi";
import { cx, showToast } from "../../../utils/ui";

// Real guessing uses the SAME question + options the Answer screen uses, so a
// guess is scorable against each target's real self-answer.
const OPTIONS = ["My biggest ick", "My toxic trait", "My ideal trip", "My hidden hot take"];

// Seeded fallback (solo demo / no real data yet).
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

export default function Guess({ next }) {
  const app = useMutuals();
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(!app.soloDemo);

  const refresh = () => {
    if (!app.activeGroupId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getBundle(app.activeGroupId)
      .then((b) => setBundle(b))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    if (app.soloDemo) {
      setLoading(false);
      return;
    }
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.activeGroupId, app.soloDemo]);

  const participants = bundle?.participants || [];
  const targets = participants.filter((p) => p.id !== app.currentParticipantId);
  const hasRealData = !app.soloDemo && participants.length > 0;

  // Seeded fallback only when there is no real group data at all.
  if (!hasRealData) return <SeededGuess next={next} />;

  // Real group but nobody else to guess yet → waiting / invite state.
  if (targets.length === 0) {
    return (
      <Phone mood="purple">
        <div className="relative z-10 px-6 pt-24 text-center text-white">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-white/70">async guess</p>
          <h2 className="mt-4 text-5xl font-black leading-none tracking-tighter">Waiting for friends to join.</h2>
          <p className="mx-auto mt-4 max-w-[265px] text-sm font-bold text-white/75">
            You can guess your friends once at least one more person joins. Send your link.
          </p>
        </div>
        <BottomSheet>
          <div className="rounded-[26px] bg-[#f4f1fa] p-4 text-black">
            <p className="text-xs font-black uppercase tracking-widest text-black/35">in this group</p>
            <p className="mt-2 text-xl font-black">{participants.length} joined</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button
              tone="lime"
              onClick={() => {
                navigator.clipboard?.writeText(shareUrl(app.activeGroupId));
                showToast("Link copied");
              }}
            >
              Copy invite
            </Button>
            <Button tone="primary" onClick={refresh}>
              Check again
            </Button>
          </div>
        </BottomSheet>
      </Phone>
    );
  }

  return <RealGuess next={next} targets={targets} />;
}

function RealGuess({ next, targets }) {
  const [ti, setTi] = useState(0);
  const [selected, setSelected] = useState(null);
  const target = targets[ti];
  const member = toMember(target, ti);
  const isLast = ti >= targets.length - 1;
  const onContinue = () => {
    if (selected == null) return;
    captureGuesses({ [target.id]: { q1: selected } });
    if (isLast) {
      saveMutualsState({ revealUnlocked: true, completedSteps: withStep("Guess") });
      captureComplete();
      showToast("Guesses saved");
      next();
    } else {
      setTi(ti + 1);
      setSelected(null);
    }
  };
  return (
    <Phone mood="purple">
      <div className="relative z-10 px-6 pt-14 text-center text-white">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/70">
          async guess · {ti + 1}/{targets.length}
        </p>
        <div className="mt-4 flex justify-center">
          <Avatar member={member} size="lg" />
        </div>
        <h2 className="mt-4 text-4xl font-black leading-none">What did {member.name} pick?</h2>
      </div>
      <BottomSheet tall>
        <Progress step={5} />
        <p className="mt-4 text-center text-sm font-black text-black/50">
          Guess what {member.name} actually answered. The closer you are, the better you know them.
        </p>
        <div className="mt-5 space-y-3">
          {OPTIONS.map((option, i) => (
            <button
              key={option}
              onClick={() => setSelected(i)}
              className={cx(
                "flex w-full items-center gap-3 rounded-3xl p-4 text-left text-sm font-black shadow-sm",
                i === selected ? "bg-[#7cdfff] text-black" : "bg-[#f4f1fa] text-black"
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
            {isLast ? "Start reveal moment" : "Next friend"}
          </Button>
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
    <Phone mood="purple">
      <div className="relative z-10 px-6 pt-14 text-center text-white">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/70">async guess · 7/30</p>
        <div className="mt-4 flex justify-center">
          <Avatar member={members[2]} size="lg" />
        </div>
        <h2 className="mt-4 text-4xl font-black leading-none">What did Karan pick?</h2>
      </div>
      <BottomSheet tall>
        <Progress step={5} />
        <p className="mt-4 text-center text-sm font-black text-black/50">
          Real flow: enough guesses for 10-card report. Demo compresses the round.
        </p>
        <div className="mt-5 space-y-3">
          {SEED_OPTIONS.map((option, i) => (
            <button
              key={option}
              onClick={() => setSelected(i)}
              className={cx(
                "flex w-full items-center gap-3 rounded-3xl p-4 text-left text-sm font-black shadow-sm",
                i === selected ? "bg-[#7cdfff] text-black" : "bg-[#f4f1fa] text-black"
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
            Start reveal moment
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
