import { useState, useEffect, useMemo, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Progress from "../ui/Progress";
import Button from "../ui/Button";
import { useMutuals } from "../useMutuals";
import { saveMutualsState, getMutualsState, withStep } from "../../../utils/mutualsStorage";
import { submitAnswers, getBundle } from "../../../lib/mutualsApi";
import { cx, showToast } from "../../../utils/ui";
import { selectQuestions, isNamePick, participantOptionsForQuestion } from "../../../data/questions";
import { track } from "../../../utils/analytics";

export default function Answer({ next, go }) {
  const app = useMutuals();
  const allQuestions = useMemo(
    () => selectQuestions(app.activeGroupId, app.groupMode),
    [app.activeGroupId, app.groupMode]
  );
  const realRoom = !app.soloDemo && !!app.activeGroupId;
  const isGroup = app.groupMode === "group";
  const needsBundle = realRoom && isGroup && allQuestions.some(isNamePick);

  const [bundle, setBundle] = useState(null);
  const [bundleLoaded, setBundleLoaded] = useState(!needsBundle);

  useEffect(() => {
    if (!needsBundle) return;
    getBundle(app.activeGroupId)
      .then((b) => setBundle(b))
      .catch(() => {})
      .finally(() => setBundleLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.activeGroupId, needsBundle]);

  const participants = bundle?.participants || [];
  // Answerable now: self always; name-pick only once enough players are in to
  // show >=3 options. Deferred name-picks come back via the reveal "add votes"
  // nudge once the room fills up.
  const questions = useMemo(
    () =>
      allQuestions.filter(
        (q) => !isNamePick(q) || participantOptionsForQuestion(q, participants, app.activeGroupId).length >= 3
      ),
    [allQuestions, participants, app.activeGroupId]
  );

  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const startedRef = useRef(false);

  // Once the answerable set is known, start at the first UNanswered question so
  // late top-ups jump straight to the new name-picks (and finished players exit).
  useEffect(() => {
    if (startedRef.current || !bundleLoaded) return;
    startedRef.current = true;
    const sa = getMutualsState().selfAnswers || {};
    const first = questions.findIndex((q) => sa[q.id] == null);
    if (first === -1 && questions.length) {
      const s = getMutualsState();
      if (s.revealUnlocked || (s.completedSteps || []).includes("Guess")) go("Reveal");
      else next();
      return;
    }
    const idx = first >= 0 ? first : 0;
    setQi(idx);
    setSelected(sa[questions[idx]?.id] ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundleLoaded, questions]);

  const q = questions[qi];

  useEffect(() => {
    if (q) setSelected(getMutualsState().selfAnswers?.[q.id] ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qi]);

  if (!bundleLoaded || !q) {
    return (
      <Phone mood="cream">
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-[var(--screen-pad-x)] text-center text-[#17112B]">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-black/45">about you</p>
          <h2 className="mt-4 text-4xl font-black leading-none tracking-tighter short:text-3xl">Loading…</h2>
        </div>
      </Phone>
    );
  }

  const namepick = isNamePick(q);
  const options = namepick
    ? participantOptionsForQuestion(q, participants, app.activeGroupId).map((o) => o.name)
    : q.options;

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
      track("answers_saved", { mode: app.groupMode });
      showToast("Answers saved");
      const s = getMutualsState();
      // Late top-up of name-picks after already playing → back to the reveal.
      if (s.revealUnlocked || (s.completedSteps || []).includes("Guess")) go("Reveal");
      else next();
    } catch {
      showToast("Couldn't save — try again");
      setSaving(false);
    }
  };

  const lastQ = qi >= questions.length - 1;
  return (
    <Phone mood="cream">
      <div className="relative z-10 px-[var(--screen-pad-x)] pt-[var(--screen-pad-top)]">
        <p className="text-center text-xs font-black uppercase tracking-[0.25em] text-black/45">
          {namepick ? "group vote" : "about you"}
        </p>
        <div className="mt-4 rounded-[28px] bg-white p-6 text-center shadow-xl short:mt-3 short:rounded-[22px] short:p-4">
          <h2 className="font-black leading-tight text-black text-[clamp(1.45rem,6.5vw,1.875rem)] short:text-[clamp(1.2rem,5.6vw,1.55rem)]">
            {q.prompt}
          </h2>
        </div>
      </div>
      <BottomSheet tall>
        <Progress current={qi + 1} total={questions.length} label={`Question ${qi + 1} of ${questions.length}`} />
        <div className="mt-5 space-y-3 short:mt-3 short:space-y-2">
          {options.map((option, i) => (
            <button
              key={option + i}
              onClick={() => pick(i)}
              className={cx(
                "flex w-full items-center gap-3 rounded-3xl p-4 text-left text-sm font-black shadow-sm short:rounded-2xl short:p-3",
                i === selected
                  ? namepick
                    ? "bg-[#7B3CFF] text-white"
                    : "bg-[#FF4F9A] text-white"
                  : "bg-[#F3EFFF] text-black"
              )}
            >
              <span
                className={cx(
                  "grid h-7 w-7 place-items-center rounded-full text-xs",
                  i === selected ? "bg-white text-[#6b2cff]" : "bg-white text-[#6b2cff]"
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          ))}
        </div>
        <div className={cx("mt-5 rounded-[26px] p-4 short:hidden", namepick ? "bg-[#f3efff]" : "bg-[#e9fff0]")}>
          <p className="text-sm font-black">{namepick ? "Pick the person" : "Answer honestly"}</p>
          <p className="mt-1 text-xs font-bold text-black/50">
            {namepick
              ? "The group will see the receipts. Yes, you can pick yourself."
              : "Your answers stay private until the reveal. Your friends will try to guess them."}
          </p>
        </div>
        <div className="mt-5 short:mt-3">
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
                {saving ? "Saving…" : lastQ ? "Guess friends" : "Next question"}
              </Button>
            </div>
          ) : (
            <Button
              onClick={onNext}
              tone="primary"
              className={selected == null || saving ? "pointer-events-none opacity-40" : ""}
            >
              {saving ? "Saving…" : lastQ ? "Guess friends" : "Next question"}
            </Button>
          )}
        </div>
      </BottomSheet>
    </Phone>
  );
}
