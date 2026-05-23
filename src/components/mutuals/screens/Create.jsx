import { Copy, Share2 } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Progress from "../ui/Progress";
import Button from "../ui/Button";
import { shareUrl, saveMutualsState } from "../../../utils/mutualsStorage";
import { useMutuals } from "../useMutuals";
import { captureGroup } from "../../../lib/mutualsApi";
import { cx, showToast, shareOrCopy } from "../../../utils/ui";

const MODES = [
  { m: "duo", t: "1:1", d: "Who knows who better?" },
  { m: "group", t: "Group", d: "Who actually knows the group?" },
];

export default function Create({ next }) {
  const app = useMutuals();
  const mode = app.groupMode || "group";
  const link = shareUrl(app.activeGroupId);
  const chooseMode = (m) => {
    saveMutualsState({ groupMode: m });
    captureGroup();
  };
  return (
    <Phone mood="purple">
      <div className="relative z-10 px-6 pt-20 text-center text-white">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/70">your room is ready</p>
        <h2 className="mt-3 text-5xl font-black leading-none">Share this with your group chat.</h2>
      </div>
      <BottomSheet tall>
        <Progress step={1} />
        <div className="mt-5">
          <p className="text-xs font-black uppercase tracking-widest text-black/35">1 · pick your room type</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {MODES.map((opt) => (
              <button
                key={opt.m}
                onClick={() => chooseMode(opt.m)}
                className={cx(
                  "rounded-2xl p-3 text-left",
                  mode === opt.m ? "bg-[#6b2cff] text-white" : "bg-[#f3efff] text-black/60"
                )}
              >
                <p className="text-sm font-black">{opt.t}</p>
                <p className="mt-0.5 text-[11px] font-bold opacity-70">{opt.d}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-[26px] bg-[#fff3c4] p-4">
          <p className="text-xs font-black uppercase tracking-widest text-black/35">2 · share your link</p>
          <p className="mt-2 break-all text-sm font-black">{link}</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
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
          <Button
            tone="white"
            icon={Share2}
            onClick={() =>
              shareOrCopy({ text: "I made a MUTUALS room. Answer this before I start judging you.", url: link })
            }
          >
            Share invite
          </Button>
        </div>
        <div className="mt-3">
          <Button onClick={next} tone="primary">
            Continue
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
