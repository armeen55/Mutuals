import { useState } from "react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Progress from "../ui/Progress";
import Button from "../ui/Button";
import { useMutuals } from "../useMutuals";
import { saveMutualsState, getMutualsState, withStep } from "../../../utils/mutualsStorage";
import { captureAnswers } from "../../../lib/mutualsApi";
import { cx, showToast } from "../../../utils/ui";

const ANSWER_OPTIONS = ["My biggest ick", "My toxic trait", "My ideal trip", "My hidden hot take"];

export default function Answer({ next }) {
  const app = useMutuals();
  const saved = app.selfAnswers?.q1;
  const [selected, setSelected] = useState(saved ?? 0);
  const answeredCount = Math.min(8, Object.keys(app.selfAnswers || {}).length);
  const pick = (i) => {
    setSelected(i);
    saveMutualsState({ selfAnswers: { ...getMutualsState().selfAnswers, q1: i } });
  };
  const onContinue = () => {
    const cur = { ...getMutualsState().selfAnswers, q1: selected };
    for (let q = 2; q <= 8; q++) {
      const k = "q" + q;
      if (cur[k] == null) cur[k] = q % ANSWER_OPTIONS.length;
    }
    saveMutualsState({ selfAnswers: cur, completedSteps: withStep("Answer") });
    captureAnswers(cur);
    showToast("Answers saved");
    next();
  };
  return (
    <Phone mood="cream">
      <div className="relative z-10 px-6 pt-16 text-center">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-black/50">your answers · {answeredCount}/8</p>
        <h2 className="mt-3 text-4xl font-black leading-none">What would the group be most wrong about?</h2>
      </div>
      <BottomSheet tall>
        <Progress step={4} />
        <div className="mt-5 space-y-3">
          {ANSWER_OPTIONS.map((option, i) => (
            <button
              key={option}
              onClick={() => pick(i)}
              className={cx(
                "flex w-full items-center gap-3 rounded-3xl p-4 text-left text-sm font-black shadow-sm",
                i === selected ? "bg-[#ff4f9a] text-white" : "bg-[#f4f1fa] text-black"
              )}
            >
              <span
                className={cx(
                  "grid h-7 w-7 place-items-center rounded-full text-xs",
                  i === selected ? "bg-white text-[#ff4f9a]" : "bg-white text-[#6b2cff]"
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-[26px] bg-[#e9fff0] p-4">
          <p className="text-sm font-black">Answer honestly</p>
          <p className="mt-1 text-xs font-bold text-black/50">
            Your answers stay private until the reveal. Your friends will try to guess them.
          </p>
        </div>
        <div className="mt-5">
          <Button onClick={onContinue} tone="primary">
            Save and guess friends
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
