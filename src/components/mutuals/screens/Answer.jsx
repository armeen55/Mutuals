import { useState, useEffect } from "react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Progress from "../ui/Progress";
import Button from "../ui/Button";
import { useMutuals } from "../useMutuals";
import { saveMutualsState, getMutualsState, withStep } from "../../../utils/mutualsStorage";
import { submitAnswers } from "../../../lib/mutualsApi";
import { cx, showToast } from "../../../utils/ui";
import { realQuestions } from "../../../data/questions";

export default function Answer({ next }) {
  const app = useMutuals();
  const [qi, setQi] = useState(0);
  const q = realQuestions[qi];
  const [selected, setSelected] = useState(app.selfAnswers?.[q.id] ?? null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelected(getMutualsState().selfAnswers?.[realQuestions[qi].id] ?? null);
  }, [qi]);

  const pick = (i) => {
    setSelected(i);
    saveMutualsState({ selfAnswers: { ...getMutualsState().selfAnswers, [q.id]: i } });
  };

  const onNext = async () => {
    if (selected == null || saving) return;
    if (qi < realQuestions.length - 1) {
      setQi(qi + 1);
      return;
    }
    setSaving(true);
    try {
      await submitAnswers(getMutualsState().selfAnswers);
      saveMutualsState({ completedSteps: withStep("Answer") });
      showToast("Answers saved");
      next();
    } catch {
      showToast("Couldn't save — try again");
      setSaving(false);
    }
  };

  return (
    <Phone mood="cream">
      <div className="relative z-10 px-6 pt-16 text-center">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-black/50">
          your answers · {qi + 1}/{realQuestions.length}
        </p>
        <h2 className="mt-3 text-4xl font-black leading-none">{q.prompt}</h2>
      </div>
      <BottomSheet tall>
        <Progress step={4} />
        <div className="mt-5 space-y-3">
          {q.options.map((option, i) => (
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
          <Button
            onClick={onNext}
            tone="primary"
            className={selected == null || saving ? "pointer-events-none opacity-40" : ""}
          >
            {saving ? "Saving…" : qi < realQuestions.length - 1 ? "Next question" : "Guess friends"}
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
