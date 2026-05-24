import { useState, useEffect, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Progress from "../ui/Progress";
import Button from "../ui/Button";
import { useMutuals } from "../useMutuals";
import { saveMutualsState, getMutualsState, withStep } from "../../../utils/mutualsStorage";
import { submitAnswers } from "../../../lib/mutualsApi";
import { cx, showToast } from "../../../utils/ui";
import { selectQuestions } from "../../../data/questions";

export default function Answer({ next }) {
  const app = useMutuals();
  const questions = useMemo(() => selectQuestions(app.activeGroupId), [app.activeGroupId]);
  const [qi, setQi] = useState(0);
  const q = questions[qi];
  const [selected, setSelected] = useState(app.selfAnswers?.[q.id] ?? null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelected(getMutualsState().selfAnswers?.[questions[qi].id] ?? null);
  }, [qi]);

  const pick = (i) => {
    setSelected(i);
    saveMutualsState({ selfAnswers: { ...getMutualsState().selfAnswers, [q.id]: i } });
  };

  const onNext = async () => {
    if (selected == null || saving) return;
    if (qi < questions.length - 1) {
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
      <div className="relative z-10 px-6 pt-16">
        <p className="text-center text-xs font-black uppercase tracking-[0.25em] text-black/45">
          about you · {qi + 1}/{questions.length}
        </p>
        <div className="mt-4 rounded-[28px] bg-white p-6 text-center shadow-xl">
          <h2 className="text-3xl font-black leading-tight text-black">{q.prompt}</h2>
        </div>
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
                i === selected ? "bg-[#FF4F9A] text-white" : "bg-[#F3EFFF] text-black"
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
          {qi > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              <Button tone="dark" icon={ChevronLeft} onClick={() => setQi(qi - 1)} className="col-span-1">
                Back
              </Button>
              <Button
                onClick={onNext}
                tone="primary"
                className={cx("col-span-2", selected == null || saving ? "pointer-events-none opacity-40" : "")}
              >
                {saving ? "Saving…" : qi < questions.length - 1 ? "Next question" : "Guess friends"}
              </Button>
            </div>
          ) : (
            <Button
              onClick={onNext}
              tone="primary"
              className={selected == null || saving ? "pointer-events-none opacity-40" : ""}
            >
              {saving ? "Saving…" : qi < questions.length - 1 ? "Next question" : "Guess friends"}
            </Button>
          )}
        </div>
      </BottomSheet>
    </Phone>
  );
}
