import { MessageCircle } from "lucide-react";
import PlayerProgressRow from "../ui/PlayerProgressRow";
import Button from "../ui/Button";
import { members } from "../../../data/mutualsDemoData";
import { showToast } from "../../../utils/ui";

export default function DesktopProgress() {
  return (
    <div className="mt-8 grid grid-cols-[1fr_330px] gap-6">
      <div className="rounded-[34px] bg-[#f4f1fa] p-6">
        <p className="text-xs font-black uppercase tracking-widest text-black/35">Bottleneck detail</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {members.map((m) => (
            <PlayerProgressRow key={m.name} member={m} />
          ))}
        </div>
      </div>
      <div className="rounded-[34px] bg-[#fff3c4] p-6">
        <p className="text-3xl font-black">Maya is holding up the full reveal.</p>
        <p className="mt-3 text-sm font-bold text-black/55">
          Host can nudge one person instead of spamming the whole chat.
        </p>
        <div className="mt-5">
          <Button tone="lime" icon={MessageCircle} onClick={() => showToast("Nudge ready")}>
            Nudge Maya
          </Button>
        </div>
      </div>
    </div>
  );
}
