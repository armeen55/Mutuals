import { useState } from "react";
import { ChevronLeft, MessageCircle, MonitorPlay, QrCode } from "lucide-react";
import AbstractBg from "../ui/AbstractBg";
import Button from "../ui/Button";
import Progress from "../ui/Progress";
import PlayerProgressRow from "../ui/PlayerProgressRow";
import CheckDot from "../ui/CheckDot";
import DesktopMain from "./DesktopMain";
import { members, steps, insightCards, REF_URL, ROOM_CODE } from "../../../data/mutualsDemoData";
import { cx, showToast } from "../../../utils/ui";

export default function DesktopApp({ step, setStep }) {
  const [cardIndex, setCardIndex] = useState(0);
  const currentCard = insightCards[Math.min(cardIndex, insightCards.length - 1)];
  const CardIcon = currentCard.icon;
  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const stageTitle = {
    Home: "Find out who knows who.",
    Create: "Your async group is live.",
    Join: "Armeen invited you to the group test.",
    Progress: "3 done. 2 pending.",
    Answer: "What would the group be most wrong about?",
    Guess: "What did Karan pick?",
    Reveal: currentCard.headline,
    Signup: "7 cards are still locked.",
    Matrix: "Who knows who.",
    Share: "Keep the group alive.",
    Today: "Today's group question is in.",
  }[steps[step]];
  return (
    <div className="hidden w-full lg:block">
      <div className="relative overflow-hidden rounded-[48px] bg-[#17112b] p-6 shadow-2xl shadow-black/30">
        <AbstractBg mood={step === 9 ? "yellow" : step === 4 || step === 8 || step === 10 ? "cream" : "purple"} />
        <div className="relative z-10 grid min-h-[760px] grid-cols-[300px_1fr_300px] gap-5">
          <aside className="rounded-[34px] bg-white/95 p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#6b2cff]">MUTUALS</p>
                <h2 className="mt-2 text-3xl font-black leading-none">Group</h2>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-black text-white">
                <QrCode className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-6 rounded-[28px] bg-[#f3efff] p-4">
              <p className="text-xs font-black uppercase tracking-widest text-black/35">Async link first</p>
              <p className="mt-2 truncate text-sm font-black">{REF_URL}</p>
              <p className="mt-3 text-xs font-black uppercase tracking-widest text-black/35">Live code optional</p>
              <p className="mt-1 text-4xl font-black text-[#6b2cff]">{ROOM_CODE}</p>
            </div>
            <div className="mt-5">
              <p className="text-xs font-black uppercase tracking-widest text-black/35">Host progress</p>
              <div className="mt-3 space-y-2">
                {members.map((m) => (
                  <PlayerProgressRow key={m.name} member={m} />
                ))}
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <Button tone="lime" icon={MessageCircle} onClick={() => showToast("Nudge ready")}>
                Nudge Maya
              </Button>
              <Button tone="dark" icon={MonitorPlay}>
                Optional live
              </Button>
            </div>
          </aside>

          <main className="rounded-[38px] bg-white/95 p-6 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-black/35">
                  {step + 1}/{steps.length} · {steps[step]}
                </p>
                <h1 className="mt-3 max-w-3xl text-6xl font-black leading-[0.9] tracking-tighter text-black">
                  {stageTitle}
                </h1>
              </div>
              <div className="hidden rounded-[28px] bg-black px-5 py-4 text-white xl:block">
                <p className="text-xs font-black uppercase tracking-widest text-white/45">mode</p>
                <p className="mt-1 text-2xl font-black">Async</p>
              </div>
            </div>
            <div className="mt-6">
              <Progress step={step} />
            </div>
            <DesktopMain
              step={step}
              cardIndex={cardIndex}
              setCardIndex={setCardIndex}
              currentCard={currentCard}
              CardIcon={CardIcon}
              setStep={setStep}
            />
          </main>

          <aside className="rounded-[34px] bg-white/95 p-5 shadow-2xl backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-black/35">Flow toggle</p>
            <div className="mt-5 rounded-[28px] bg-[#f3efff] p-5">
              <p className="text-5xl font-black text-[#6b2cff]">
                {step + 1}/{steps.length}
              </p>
              <p className="mt-1 text-sm font-bold text-black/50">{steps[step]}</p>
            </div>
            <div className="mt-5 max-h-[445px] space-y-2 overflow-y-auto pr-1">
              {steps.map((s, i) => (
                <button
                  key={s}
                  onClick={() => setStep(i)}
                  className={cx(
                    "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-black",
                    i === step ? "bg-[#6b2cff] text-white" : "bg-[#f7f3ff] text-black/60"
                  )}
                >
                  <span>{s}</span>
                  {i <= step && <CheckDot />}
                </button>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              <Button onClick={back} tone="dark" icon={ChevronLeft}>
                Back
              </Button>
              <Button onClick={next} tone="pink">
                Next
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
