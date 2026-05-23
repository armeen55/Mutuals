import { RefreshCcw, MessageCircle, Users, Flame, Trophy } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import ActionTile from "../ui/ActionTile";
import Button from "../ui/Button";
import { useMutuals } from "../useMutuals";
import { shareUrl, saveMutualsState } from "../../../utils/mutualsStorage";
import { shareOrCopy, showToast } from "../../../utils/ui";
import { EAZO_VOTE_URL } from "../../../config";

export default function Share({ next, go }) {
  const app = useMutuals();
  const link = shareUrl(app.activeGroupId);
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
        <p className="mx-auto mt-4 max-w-[250px] text-sm font-bold text-black/60">A reveal is better shared.</p>
      </div>
      <BottomSheet>
        <div className="grid grid-cols-2 gap-3">
          <ActionTile icon={RefreshCcw} label="Rematch" onClick={rematch} />
          <ActionTile
            icon={MessageCircle}
            label="Send the reveal"
            onClick={() =>
              shareOrCopy({ text: "Our group is about to find out who the mystery friend is.", url: link })
            }
          />
          <ActionTile
            icon={Users}
            label="Challenge a group"
            onClick={() => shareOrCopy({ text: "Take this with me: who knows who better?", url: link })}
          />
          <ActionTile icon={Flame} label="Today" onClick={() => go("Today")} />
        </div>
        <div className="mt-5 rounded-[26px] bg-black p-4 text-white">
          <p className="text-xs font-black uppercase tracking-widest text-white/45">caption</p>
          <p className="mt-2 text-xl font-black">Find out who actually knows who in our group.</p>
        </div>
        <div className="mt-5 space-y-3">
          <Button tone="pink" icon={Trophy} onClick={() => window.open(EAZO_VOTE_URL, "_blank", "noopener")}>
            Help MUTUALS win on Eazo
          </Button>
          <Button onClick={next} tone="white" icon={Flame}>
            Open Today
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
