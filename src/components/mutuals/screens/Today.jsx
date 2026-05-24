import { Flame, Share2 } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Button from "../ui/Button";
import { useMutuals } from "../useMutuals";
import { shareUrl } from "../../../utils/mutualsStorage";
import { shareOrCopy, showToast } from "../../../utils/ui";

export default function Today({ go }) {
  const app = useMutuals();
  const played = app.revealUnlocked || (app.completedSteps || []).includes("Guess");
  return (
    <Phone mood="cream">
      <div className="relative z-10 px-[var(--screen-pad-x)] pt-[var(--screen-pad-top)] text-center">
        <p className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
          returning home
        </p>
        <h2 className="mt-7 text-6xl font-black leading-[0.85] tracking-tighter short:mt-4 short:text-4xl">
          {played ? "Today's group question is in." : "Finish your first reveal to unlock Today."}
        </h2>
        <p className="mx-auto mt-4 max-w-[260px] text-sm font-bold text-black/60 short:mt-3">
          {played
            ? "A new group question drops here every day. Keep your streak alive."
            : "Play one reveal, then a fresh group question lands here every day."}
        </p>
      </div>
      <BottomSheet>
        <div className="rounded-[28px] bg-[#ff4f9a] p-5 text-white">
          <p className="text-xs font-black uppercase tracking-widest text-white/60">callback question</p>
          <p className="mt-3 text-3xl font-black leading-none">
            {played ? "Will was the mystery friend. Guess his answer today?" : "Your group hasn't played yet."}
          </p>
          <p className="mt-2 text-sm text-white/70">3/6 answered · streak unlocks weekly recap</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button
            tone="lime"
            icon={Flame}
            onClick={() => (played ? showToast("Answer saved for today") : go("Answer"))}
          >
            {played ? "Answer today" : "Start playing"}
          </Button>
          <Button
            onClick={() =>
              shareOrCopy({ text: "Find out who actually knows who in our group.", url: shareUrl(app.activeGroupId) })
            }
            tone="white"
            icon={Share2}
          >
            Share group
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
