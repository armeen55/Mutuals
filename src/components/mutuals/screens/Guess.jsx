import { useState, useEffect } from "react";
import { Copy, Share2 } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Progress from "../ui/Progress";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import { members } from "../../../data/mutualsDemoData";
import { realQuestions } from "../../../data/questions";
import { useMutuals } from "../useMutuals";
import { saveMutualsState, getMutualsState, withStep, shareUrl } from "../../../utils/mutualsStorage";
import { captureGuesses, captureComplete, getBundle } from "../../../lib/mutualsApi";
import { cx, showToast, shareOrCopy } from "../../../utils/ui";

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

  const refresh = () => {
    if (app.activeGroupId) getBundle(app.activeGroupId).then(setBundle).catch(() => {});
  };
  useEffect(() => {
    if (!app.soloDemo) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.activeGroupId, app.soloDemo]);

  const participants = bundle?.participants || [];
  const others = participants.filter((p) => p.id !== app.currentParticipantId);
  const hasRealData = !app.soloDemo && participants.length > 0;

  if (!hasRealData) return <SeededGuess next={next} />;

  if (others.length === 0) {
    const required = app.groupMode === "duo" ? 2 : 3;
    const need = Math.max(0, required - participants.length);
    return (
      <Phone mood="purple">
        <div className="relative z-10 px-6 pt-24 text-center text-white">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-white/70">your room</p>
          <h2 className="mt-4 text-5xl font-black leading-none tracking-tighter">
            {need > 0 ? `Need ${need} more to start.` : "Almost there."}
          </h2>
          <p className="mx-auto mt-4 max-w-[265px] text-sm font-bold text-white/75">
            Drop your link in the group chat. The reveal needs everyone in.
          </p>
        </div>
        <BottomSheet>
          <div className="rounded-[26px] bg-[#f4f1fa] p-4 text-black">
            <p className="text-xs font-black uppercase tracking-widest text-black/35">joined ({participants.length})</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {participants.map((p) => (
                <span key={p.id} className="rounded-full bg-[#6b2cff] px-3 py-1 text-xs font-black text-white">
                  {p.displayName}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              tone="lime"
              icon={Copy}
              onClick={() => {
                navigator.clipboard?.writeText(shareUrl(app.activeGroupId));
                showToast("Link copied");
              }}
            >
              Copy invite
            </Button>
            <Button
              tone="white"
              icon={Share2}
              onClick={() =>
                shareOrCopy({ text: "Find out who actually knows who in our group.", url: shareUrl(app.activeGroupId) })
              }
            >
              Share invite
            </Button>
          </div>
          <div className="mt-3">
            <Button tone="dark" onClick={refresh}>
              Check again
            </Button>
          </div>
        </BottomSheet>
      </Phone>
    );
  }

  const targets = others.slice(0, app.groupMode === "duo" ? 1 : 3);
  return <RealGuess next={next} targets={targets} />;
}

function RealGuess({ next, targets }) {
  const [ti, setTi] = useState(0);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState(null);
  const target = targets[ti];
  const member = toMember(target, ti);
  const q = realQuestions[qi];
  const lastQ = qi >= realQuestions.length - 1;
  const lastTarget = ti >= targets.length - 1;

  const onNext = () => {
    if (selected == null) return;
    captureGuesses({ [target.id]: { [q.id]: selected } });
    if (!lastQ) {
      setQi(qi + 1);
      setSelected(null);
      return;
    }
    if (!lastTarget) {
      setTi(ti + 1);
      setQi(0);
      setSelected(null);
      return;
    }
    saveMutualsState({ revealUnlocked: true, completedSteps: withStep("Guess") });
    captureComplete();
    showToast("Guesses saved");
    next();
  };

  return (
    <Phone mood="purple">
      <div className="relative z-10 px-6 pt-12 text-center text-white">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/70">
          guessing {member.name} · {ti + 1}/{targets.length}
        </p>
        <div className="mt-3 flex justify-center">
          <Avatar member={member} size="lg" />
        </div>
        <h2 className="mt-3 text-3xl font-black leading-[0.95]">{q.prompt}</h2>
      </div>
      <BottomSheet tall>
        <Progress step={5} />
        <p className="mt-4 text-center text-sm font-black text-black/50">
          What would {member.name} pick? · {qi + 1}/{realQuestions.length}
        </p>
        <div className="mt-4 space-y-3">
          {q.options.map((option, i) => (
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
          <Button onClick={onNext} tone="primary" className={selected == null ? "pointer-events-none opacity-40" : ""}>
            {lastQ && lastTarget ? "See the reveal" : "Next"}
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
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/70">guess your friend</p>
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
            See the reveal
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
