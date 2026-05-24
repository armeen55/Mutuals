import { Copy, Share2 } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Button from "../ui/Button";
import { shareUrl, saveMutualsState } from "../../../utils/mutualsStorage";
import { useMutuals } from "../useMutuals";
import { captureGroup } from "../../../lib/mutualsApi";
import { cx, showToast, shareOrCopy } from "../../../utils/ui";

// The mode defines the screen: 1:1 is a tight showdown, Group is social chaos.
const COPY = {
  duo: {
    mood: "dark",
    eyebrow: "1:1 showdown",
    header: "Prove who knows who better.",
    body: "Send this to one person. You'll both answer, guess each other, then get the receipts.",
    cta: "Send challenge",
    shareText: "Bet I know you better than you know me. Prove me wrong:",
  },
  group: {
    mood: "purple",
    eyebrow: "group chaos",
    header: "Put the group chat on the record.",
    body: "Drop this link. Everyone answers about themselves. MUTUALS reveals who actually pays attention.",
    cta: "Send to group chat",
    shareText: "Answer this before I start judging the group:",
  },
};

export default function Create({ next }) {
  const app = useMutuals();
  const mode = app.groupMode || "duo";
  const c = COPY[mode] || COPY.duo;
  const link = shareUrl(app.activeGroupId);
  const chooseMode = (m) => {
    saveMutualsState({ groupMode: m });
    captureGroup();
  };
  const sendAndNext = () => {
    shareOrCopy({ text: c.shareText, url: link });
    next();
  };

  return (
    <Phone mood={c.mood}>
      <div className="relative z-10 px-6 pt-16 text-center text-white">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/60">{c.eyebrow}</p>
        <h2 className="mt-3 text-5xl font-black leading-[0.9] tracking-tighter">{c.header}</h2>
      </div>
      <BottomSheet tall>
        <div className="flex rounded-2xl bg-black/5 p-1">
          {[
            ["duo", "1:1"],
            ["group", "Group"],
          ].map(([m, label]) => (
            <button
              key={m}
              onClick={() => chooseMode(m)}
              className={cx(
                "flex-1 rounded-xl py-2 text-xs font-black transition",
                mode === m ? "bg-[#6b2cff] text-white" : "text-black/50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm font-bold text-black/60">{c.body}</p>
        {mode === "group" && (
          <p className="mt-2 text-[11px] font-black text-[#6b2cff]">
            Group unlocks at 3 finished. Bigger groups make better receipts.
          </p>
        )}
        <div className="mt-4 rounded-[26px] bg-[#f4f1fa] p-4">
          <p className="text-xs font-black uppercase tracking-widest text-black/35">your link</p>
          <p className="mt-1 break-all text-sm font-black">{link}</p>
        </div>
        <div className="mt-4">
          <Button
            tone="lime"
            icon={Copy}
            onClick={() => {
              navigator.clipboard?.writeText(link);
              showToast("Link copied");
            }}
          >
            Copy link
          </Button>
        </div>
        <div className="mt-3">
          <Button tone="primary" icon={Share2} onClick={sendAndNext}>
            {c.cta}
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
