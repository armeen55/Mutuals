import { Flame } from "lucide-react";
import AbstractBg from "../ui/AbstractBg";
import Button from "../ui/Button";

export default function DesktopToday() {
  return (
    <div className="mt-8 grid grid-cols-[1fr_330px] gap-6">
      <div className="relative min-h-[380px] overflow-hidden rounded-[38px] bg-[#fff2df] p-8">
        <AbstractBg mood="cream" />
        <div className="relative z-10 max-w-lg">
          <p className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-widest text-white">
            returning user home
          </p>
          <h2 className="mt-10 text-7xl font-black leading-[0.85] tracking-tighter">Today's question is in.</h2>
          <p className="mt-5 text-lg font-bold text-black/60">Will was the mystery friend. Guess his answer today?</p>
        </div>
      </div>
      <div className="rounded-[34px] bg-[#ff4f9a] p-6 text-white">
        <p className="text-3xl font-black">3/6 answered</p>
        <p className="mt-3 text-sm font-bold text-white/70">Weekly recap unlocks after 7 dailies.</p>
        <div className="mt-5">
          <Button tone="lime" icon={Flame}>
            Answer today
          </Button>
        </div>
      </div>
    </div>
  );
}
