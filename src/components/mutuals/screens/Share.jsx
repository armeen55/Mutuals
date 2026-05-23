import { Share2, Users, Trophy, Flame } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Button from "../ui/Button";
import { useMutuals } from "../useMutuals";
import { shareUrl, saveMutualsState, newRoomId, ensureGroup } from "../../../utils/mutualsStorage";
import { captureGroup } from "../../../lib/mutualsApi";
import { shareOrCopy, showToast } from "../../../utils/ui";
import { EAZO_VOTE_URL } from "../../../config";

// Only treat the vote CTA as live once a real link replaces the placeholder.
const eazoReady = !/^https?:\/\/eazo\.ai\/?$/.test(EAZO_VOTE_URL);

export default function Share({ go }) {
  const app = useMutuals();
  const link = shareUrl(app.activeGroupId);

  // Challenge flows always start a FRESH room (no stale answers/guesses) and route to Create.
  const newRoom = (mode) => {
    const id = newRoomId();
    ensureGroup(id);
    saveMutualsState({
      groupMode: mode,
      selfAnswers: {},
      guesses: {},
      revealUnlocked: false,
      completedSteps: [],
      soloDemo: false,
    });
    captureGroup();
    showToast(mode === "duo" ? "New 1:1 room" : "New group room");
    go("Create");
  };

  return (
    <Phone mood="yellow">
      <div className="relative z-10 px-7 pt-24 text-center">
        <p className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
          the verdict is in
        </p>
        <h2 className="mt-7 text-6xl font-black leading-[0.85] tracking-tighter">Your group has receipts.</h2>
        <p className="mx-auto mt-4 max-w-[250px] text-sm font-bold text-black/60">Send it before they deny it.</p>
      </div>
      <BottomSheet>
        <Button
          tone="pink"
          icon={Share2}
          onClick={() =>
            shareOrCopy({ text: "We just played MUTUALS and found out who actually knows who.", url: link })
          }
        >
          Share the reveal
        </Button>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Button tone="lime" icon={Users} onClick={() => newRoom("duo")}>
            Challenge a friend
          </Button>
          <Button tone="white" icon={Users} onClick={() => newRoom("group")}>
            Challenge a group
          </Button>
        </div>
        <div className="mt-3">
          <Button
            tone="white"
            icon={Trophy}
            className={eazoReady ? "" : "pointer-events-none opacity-40"}
            onClick={eazoReady ? () => window.open(EAZO_VOTE_URL, "_blank", "noopener") : undefined}
          >
            {eazoReady ? "Help MUTUALS win on Eazo" : "Eazo vote link coming"}
          </Button>
        </div>
        <div className="mt-3">
          <Button tone="dark" icon={Flame} onClick={() => go("Today")}>
            Today's question
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
