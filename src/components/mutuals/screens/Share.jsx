import { RefreshCcw, MessageCircle, Users, Flame } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import ActionTile from "../ui/ActionTile";
import Button from "../ui/Button";
import { useMutuals } from "../useMutuals";
import { shareUrl, saveMutualsState } from "../../../utils/mutualsStorage";
import { showToast } from "../../../utils/ui";

export default function Share({ next, go }) {
  const app = useMutuals();
  const link = shareUrl(app.activeGroupId);
  const copyMsg = (msg, toast) => {
    navigator.clipboard?.writeText(msg);
    showToast(toast);
  };
  const rematch = () => {
    saveMutualsState({ selfAnswers: {}, guesses: {}, revealUnlocked: false, completedSteps: [] });
    showToast("Rematch ready");
    go("Answer");
  };
  return (
    <Phone mood="yellow">
      <div className="relative z-10 px-7 pt-24 text-center">
        <p className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
          what now?
        </p>
        <h2 className="mt-7 text-6xl font-black leading-[0.85] tracking-tighter">Keep the group alive.</h2>
        <p className="mx-auto mt-4 max-w-[250px] text-sm font-bold text-black/60">Reveal should never be a dead end.</p>
      </div>
      <BottomSheet>
        <div className="grid grid-cols-2 gap-3">
          <ActionTile icon={RefreshCcw} label="Rematch" onClick={rematch} />
          <ActionTile
            icon={MessageCircle}
            label="Send Will card"
            onClick={() => copyMsg(`Nobody knows Will. Take the MUTUALS test with us: ${link}`, "Message copied")}
          />
          <ActionTile
            icon={Users}
            label="Challenge group"
            onClick={() => copyMsg(`Our group scored 64%. Beat us: ${link}`, "Challenge copied")}
          />
          <ActionTile icon={Flame} label="Today question" onClick={() => go("Today")} />
        </div>
        <div className="mt-5 rounded-[26px] bg-black p-4 text-white">
          <p className="text-xs font-black uppercase tracking-widest text-white/45">caption</p>
          <p className="mt-2 text-xl font-black">Our group scored 64%. Send this to yours.</p>
        </div>
        <div className="mt-5">
          <Button onClick={next} tone="pink" icon={Flame}>
            Open Today
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
