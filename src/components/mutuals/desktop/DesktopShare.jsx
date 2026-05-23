import { RefreshCcw, MessageCircle, Users, Flame } from "lucide-react";
import AbstractBg from "../ui/AbstractBg";
import ActionTile from "../ui/ActionTile";

export default function DesktopShare() {
  return (
    <div className="mt-8 grid grid-cols-[1fr_330px] gap-6">
      <div className="relative min-h-[380px] overflow-hidden rounded-[38px] bg-[#ffbd00] p-8">
        <AbstractBg mood="yellow" />
        <div className="relative z-10 max-w-lg">
          <p className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-widest text-white">
            post reveal
          </p>
          <h2 className="mt-10 text-7xl font-black leading-[0.85] tracking-tighter">Reveal is not the end.</h2>
          <p className="mt-5 text-lg font-bold text-black/60">Rematch, challenge, send card, or answer Today.</p>
        </div>
      </div>
      <div className="rounded-[34px] bg-white p-6">
        <div className="grid grid-cols-2 gap-3">
          <ActionTile icon={RefreshCcw} label="Rematch" />
          <ActionTile icon={MessageCircle} label="Send card" />
          <ActionTile icon={Users} label="Challenge" />
          <ActionTile icon={Flame} label="Today" />
        </div>
      </div>
    </div>
  );
}
