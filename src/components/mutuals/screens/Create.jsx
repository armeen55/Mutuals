import { Copy, QrCode, Share2 } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Progress from "../ui/Progress";
import Button from "../ui/Button";
import { ROOM_CODE, REF_URL } from "../../../data/mutualsDemoData";
import { ensureGroup, shareUrl, saveMutualsState } from "../../../utils/mutualsStorage";
import { useMutuals } from "../useMutuals";
import { captureGroup } from "../../../lib/mutualsApi";
import { cx, showToast, shareOrCopy } from "../../../utils/ui";

export default function Create({ next }) {
  const app = useMutuals();
  const mode = app.groupMode || "group";
  const chooseMode = (m) => {
    saveMutualsState({ groupMode: m });
    captureGroup();
  };
  return (
    <Phone mood="purple">
      <div className="relative z-10 px-6 pt-20 text-center text-white">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/70">async group created</p>
        <h2 className="mt-3 text-5xl font-black leading-none">Send it. They can play later.</h2>
      </div>
      <BottomSheet tall>
        <Progress step={1} />
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[26px] bg-[#f3efff] p-4">
            <p className="text-xs font-black uppercase tracking-widest text-black/35">Live code</p>
            <p className="mt-3 text-4xl font-black text-[#6b2cff]">{ROOM_CODE}</p>
          </div>
          <div className="grid place-items-center rounded-[26px] bg-black p-4 text-white">
            <QrCode className="h-14 w-14" />
            <p className="mt-2 text-xs font-black">optional live</p>
          </div>
        </div>
        <div className="mt-4 rounded-[26px] bg-[#fff3c4] p-4">
          <p className="text-xs font-black uppercase tracking-widest text-black/35">tracked link</p>
          <p className="mt-2 break-all text-sm font-black">{REF_URL}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            { m: "duo", t: "1:1", d: "Who knows who better?" },
            { m: "group", t: "Group", d: "Who actually knows the group?" },
          ].map((opt) => (
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
        <div className="mt-4 grid grid-cols-3 gap-2">
          {["Mild", "Medium", "Unhinged"].map((tier, i) => (
            <div
              key={tier}
              className={cx(
                "rounded-2xl p-3 text-center text-xs font-black",
                i === 1 ? "bg-[#ff4f9a] text-white" : "bg-[#f3efff] text-black/50"
              )}
            >
              {tier}
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-[26px] bg-[#e9fff0] p-4">
          <p className="text-sm font-black">Pack: College Friends</p>
          <p className="mt-1 text-xs font-bold text-black/50">
            Inside joke: “Tahoe trip.” Questions and cards can reference it.
          </p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button
            tone="lime"
            icon={Copy}
            onClick={() => {
              const g = ensureGroup();
              navigator.clipboard?.writeText(shareUrl(g));
              showToast("Link copied");
            }}
          >
            Copy link
          </Button>
          <Button
            tone="white"
            icon={Share2}
            onClick={() => {
              const g = ensureGroup();
              shareOrCopy({
                text: "I made a MUTUALS room. Answer this before I start judging you.",
                url: shareUrl(g),
              });
            }}
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
