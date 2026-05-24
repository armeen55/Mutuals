import { Copy, Share2, Link2 } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Button from "../ui/Button";
import { shareUrl, saveMutualsState } from "../../../utils/mutualsStorage";
import { useMutuals } from "../useMutuals";
import { captureGroup } from "../../../lib/mutualsApi";
import { cx, showToast, shareOrCopy } from "../../../utils/ui";
import { track } from "../../../utils/analytics";

// The mode defines the screen: 1:1 is a tight showdown, Group is social chaos.
const COPY = {
  duo: {
    mood: "lavender",
    eyebrow: "1:1 showdown",
    header: "Prove who knows who better.",
    sub: "Send this to one person. You both answer 6 questions, then guess each other.",
    cta: "Send challenge",
    note: "You can answer first. They join whenever.",
    shareText: "Bet I know you better than you know me. Prove me wrong:",
  },
  group: {
    mood: "cream",
    eyebrow: "group chaos",
    header: "Put the group chat on the record.",
    sub: "Everyone answers about themselves. MUTUALS reveals who actually pays attention.",
    cta: "Send to group chat",
    note: "You answer now. Friends can join later.",
    shareText: "Answer this before I start judging the group:",
  },
};
const GROUP_CHIPS = ["Who knows who", "Power pair", "Biggest miss"];

export default function Create({ next }) {
  const app = useMutuals();
  const mode = app.groupMode || "duo";
  const isDuo = mode === "duo";
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
  const sendInvite = () => {
    shareOrCopy({ text: c.shareText, url: link });
    track("invite_shared", { mode });
  };

  return (
    <Phone mood={c.mood} quiet>
      <div
        className={cx("relative z-10 px-6 text-center text-[#17112B]", isDuo && "flex flex-1 flex-col justify-end")}
        style={
          isDuo
            ? { paddingTop: "clamp(40px, 6svh, 64px)", paddingBottom: "clamp(16px, 3svh, 28px)" }
            : { paddingTop: "clamp(42px, 8svh, 86px)" }
        }
      >
        <p className="text-xs font-black uppercase tracking-[0.25em] text-black/45">{c.eyebrow}</p>
        <h2
          className="mx-auto mt-2 font-black leading-[0.92] tracking-tighter"
          style={{ fontSize: "clamp(2.4rem, 10vw, 4.25rem)", maxWidth: "340px" }}
        >
          {c.header}
        </h2>
        <p className="mx-auto mt-3 max-w-[320px] text-sm font-bold leading-snug text-black/55">{c.sub}</p>
      </div>

      <BottomSheet variant={isDuo ? "compact" : "standard"}>
        <div className="flex h-12 rounded-2xl bg-black/5 p-1">
          {[
            ["duo", "1:1"],
            ["group", "Group"],
          ].map(([m, label]) => (
            <button
              key={m}
              onClick={() => chooseMode(m)}
              className={cx(
                "flex-1 rounded-xl text-xs font-black outline-none transition focus-visible:ring-2 focus-visible:ring-[#6B2CFF]",
                mode === m ? "bg-[#6B2CFF] text-white" : "text-black/50"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {!isDuo && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {GROUP_CHIPS.map((chip) => (
                <span key={chip} className="rounded-full bg-[#F3EFFF] px-3 py-1.5 text-[11px] font-black text-[#17112B]">
                  {chip}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] font-black text-[#6B2CFF]">
              Unlocks at 3 finished. Bigger groups make better receipts.
            </p>
          </div>
        )}

        <div className="mt-3 flex items-center gap-3 rounded-[22px] bg-[#F3EFFF] p-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#6B2CFF] text-white">
            <Link2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black uppercase tracking-widest text-black/40">invite link ready</p>
            <p className="truncate text-sm font-black text-[#17112B]">{link}</p>
          </div>
          <button
            onClick={copyLink}
            aria-label="Copy link"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-black/5 transition active:scale-95"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <Button tone="primary" icon={Share2} onClick={sendInvite} className="min-h-[60px]">
            {c.cta}
          </Button>
        </div>
        <div className="mt-2.5">
          <Button tone="white" onClick={next} className="min-h-[58px]">
            I shared it · answer now
          </Button>
        </div>
        <p className="mt-2 text-center text-[11px] font-bold text-black/35">{c.note}</p>
      </BottomSheet>
    </Phone>
  );
}
