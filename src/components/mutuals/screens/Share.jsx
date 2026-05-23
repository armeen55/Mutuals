import { RefreshCcw, MessageCircle, Users, Flame, Trophy, Share2 } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import ActionTile from "../ui/ActionTile";
import Button from "../ui/Button";
import { useMutuals } from "../useMutuals";
import { shareUrl, saveMutualsState, newRoomId, ensureGroup } from "../../../utils/mutualsStorage";
import { captureGroup } from "../../../lib/mutualsApi";
import { shareOrCopy, showToast } from "../../../utils/ui";
import { EAZO_VOTE_URL } from "../../../config";

// Until a real vote link is set in src/config.js, don't imply voting is live.
const eazoReady = !/^https?:\/\/eazo\.ai\/?$/.test(EAZO_VOTE_URL);

export default function Share({ next, go }) {
  const app = useMutuals();
  const link = shareUrl(app.activeGroupId);

  // Rematch must NOT reuse stale answers/guesses. Real rooms get a brand-new room id.
  const rematch = () => {
    if (app.soloDemo) {
      saveMutualsState({ selfAnswers: {}, guesses: {}, revealUnlocked: false, completedSteps: [] });
      showToast("Rematch ready");
      go("Answer");
      return;
    }
    const id = newRoomId();
    ensureGroup(id);
    saveMutualsState({ revealUnlocked: false, selfAnswers: {}, guesses: {}, completedSteps: [] });
    captureGroup();
    showToast("New room created");
    go("Create");
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
            onClick={() => shareOrCopy({ text: "Our group just found out who the mystery friend is.", url: link })}
          />
          <ActionTile
            icon={Users}
            label="Challenge a group"
            onClick={() => shareOrCopy({ text: "Take this with me: who knows who better?", url: link })}
          />
          <ActionTile icon={Flame} label="Today" onClick={() => go("Today")} />
        </div>
        <div className="mt-5 space-y-3">
          <Button
            tone="pink"
            icon={Share2}
            onClick={() =>
              shareOrCopy({ text: "We just found out who actually knows who. Take it with your group:", url: link })
            }
          >
            Share this result
          </Button>
          <Button tone="white" icon={Trophy} onClick={() => window.open(EAZO_VOTE_URL, "_blank", "noopener")}>
            {eazoReady ? "Help MUTUALS win on Eazo" : "Vote for MUTUALS on Eazo (soon)"}
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
