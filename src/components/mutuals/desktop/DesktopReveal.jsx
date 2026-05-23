import { Download, Lock } from "lucide-react";
import AbstractBg from "../ui/AbstractBg";
import Button from "../ui/Button";
import { insightCards } from "../../../data/mutualsDemoData";
import { useMutuals } from "../useMutuals";
import { cx, showToast } from "../../../utils/ui";

export default function DesktopReveal({ cardIndex, setCardIndex, currentCard, CardIcon, setStep }) {
  const app = useMutuals();
  return (
    <div className="mt-8 grid grid-cols-[1fr_330px] gap-6">
      <div
        className="relative min-h-[430px] overflow-hidden rounded-[38px] p-8 text-white"
        style={{
          background:
            currentCard.mood === "yellow" ? "#ffbd00" : currentCard.mood === "dark" ? "#101014" : "#6b2cff",
        }}
      >
        <AbstractBg mood={currentCard.mood} />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-black">
              {currentCard.label}
            </span>
            <span className="text-lg font-black">MUTUALS.APP</span>
          </div>
          <div className="mt-10 grid h-24 w-24 place-items-center rounded-[30px] bg-white text-black">
            <CardIcon className="h-11 w-11" />
          </div>
          <p className="mt-8 text-8xl font-black leading-none" style={{ color: currentCard.accent }}>
            {currentCard.stat}
          </p>
          <h2 className="mt-4 max-w-2xl text-6xl font-black leading-[0.9] tracking-tighter">
            {currentCard.headline}
          </h2>
          <p className="mt-4 max-w-xl text-base font-bold text-white/75">{currentCard.detail}</p>
        </div>
      </div>
      <div className="rounded-[34px] bg-[#f4f1fa] p-5">
        <p className="text-xs font-black uppercase tracking-widest text-black/35">10-card reveal moment</p>
        <div className="mt-4 space-y-2">
          {insightCards.map((c, i) => (
            <button
              key={c.id}
              onClick={() => {
                if (i > 2 && !app.signedUp) return setStep(7);
                setCardIndex(i);
              }}
              className={cx(
                "w-full rounded-2xl p-3 text-left text-xs font-black",
                i === cardIndex ? "bg-[#6b2cff] text-white" : c.locked ? "bg-[#ff4f9a] text-white" : "bg-white text-black"
              )}
            >
              {i + 1}. {c.label}
            </button>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button tone="lime" icon={Download} onClick={() => showToast("PNG export coming next")}>
            Save
          </Button>
          <Button tone="pink" icon={Lock} onClick={() => setStep(7)}>
            Signup
          </Button>
        </div>
      </div>
    </div>
  );
}
