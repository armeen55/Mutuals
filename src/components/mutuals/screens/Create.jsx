import { Copy, Share2, Link2 } from "lucide-react";
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
    mood: "lavender",
    eyebrow: "1:1 showdown",
    header: "Prove who knows who better.",
    body: "Send this to one person. You both answer, guess each other, then reveal the receipts.",
    cta: "Send challenge",
    shareText: "Bet I know you better than you know me. Prove me wrong:",
  },
  group: {
    mood: "cream",
    eyebrow: "group chaos",
    header: "Put the group chat on the record.",
    body: "Drop the link. Everyone answers about themselves. MUTUALS reveals who actually pays attention.",
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
  const copyLink = () => {
    navigator.clipboard?.writeText(link);
    showToast("Link copied");
  };
  const sendInvite = () => shareOrCopy({ text: c.shareText, url: link });

  return (
    <Phone mood={c.mood}>
      <div className="relative z-10 px-6 text-center text-[#17112B]" style={{ paddingTop: "clamp(24px, 6svh, 56px)" }}>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-black/45">{c.eyebrow}</p>
        <h2 className="mt-2 font-black leading-[0.95] tracking-tighter" style={{ fontSize: "clamp(2rem, 8.5vw, 3.25rem)" }}>
          {c.header}
        </h2>
      </div>
      <BottomSheet>
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

        <div className="mt-4 flex items-center gap-3 rounded-[22px] bg-[#f4f1fa] p-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#6b2cff] text-white">
            <Link2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black uppercase tracking-widest text-black/40">invite link ready</p>
            <p className="truncate text-sm font-black text-black">{link}</p>
          </div>
          <button
            onClick={copyLink}
            aria-label="Copy link"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-black/5 transition active:scale-95"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <Button tone="primary" icon={Share2} onClick={sendInvite}>
            {c.cta}
          </Button>
        </div>
        <div className="mt-3">
          <Button tone="white" onClick={next}>
            I shared it · answer now
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
