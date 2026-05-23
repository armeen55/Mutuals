import { useState } from "react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Progress from "../ui/Progress";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import { members } from "../../../data/mutualsDemoData";
import { useMutuals } from "../useMutuals";
import { saveMutualsState, getMutualsState, withStep } from "../../../utils/mutualsStorage";
import { captureGuesses, captureComplete } from "../../../lib/mutualsApi";
import { cx, showToast } from "../../../utils/ui";

const GUESS_OPTIONS = ["Slow walkers", "Loud chewing", "Bad texters", "Overexplaining"];

export default function Guess({ next }) {
  const app = useMutuals();
  const target = "Karan";
  const saved = app.guesses?.[target]?.q1;
  const [selected, setSelected] = useState(saved ?? 1);
  const pick = (i) => {
    setSelected(i);
    const g = getMutualsState().guesses || {};
    saveMutualsState({ guesses: { ...g, [target]: { ...(g[target] || {}), q1: i } } });
  };
  const onContinue = () => {
    const g = { ...(getMutualsState().guesses || {}) };
    g[target] = { ...(g[target] || {}), q1: selected };
    // Auto-fill enough demo guesses across friends to power the reveal.
    members.slice(0, 4).forEach((m, idx) => {
      g[m.name] = g[m.name] || {};
      for (let q = 1; q <= 3; q++) {
        const k = "q" + q;
        if (g[m.name][k] == null) g[m.name][k] = (idx + q) % GUESS_OPTIONS.length;
      }
    });
    saveMutualsState({ guesses: g, revealUnlocked: true, completedSteps: withStep("Guess") });
    captureGuesses(g);
    captureComplete();
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
          {GUESS_OPTIONS.map((option, i) => (
            <button
              key={option}
              onClick={() => pick(i)}
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
