import { MessageCircle } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Progress from "../ui/Progress";
import PlayerProgressRow from "../ui/PlayerProgressRow";
import Button from "../ui/Button";
import { members } from "../../../data/mutualsDemoData";
import { showToast } from "../../../utils/ui";

export default function ProgressScreen({ next }) {
  return (
    <Phone mood="purple">
      <div className="relative z-10 px-6 pt-16 text-center text-white">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/70">async progress</p>
        <h2 className="mt-3 text-5xl font-black leading-none">3 done. 2 pending.</h2>
        <p className="mt-2 text-sm font-bold text-white/75">Reveal unlocks at 4 finished players</p>
      </div>
      <BottomSheet tall>
        <Progress step={3} />
        <div className="mt-5 space-y-2">
          {members.slice(0, 5).map((m) => (
            <PlayerProgressRow key={m.name} member={m} />
          ))}
        </div>
        <div className="mt-4 rounded-[26px] bg-[#fff3c4] p-4">
          <p className="text-lg font-black">Maya is holding up the full reveal.</p>
          <p className="mt-1 text-sm font-bold text-black/50">
            One-tap nudge or unlock a partial report after the timer.
          </p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button tone="lime" icon={MessageCircle} onClick={() => showToast("Nudge ready")}>
            Nudge Maya
          </Button>
          <Button onClick={next} tone="primary">
            Continue
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
