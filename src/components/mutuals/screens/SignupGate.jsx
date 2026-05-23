import { Lock, Eye } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Button from "../ui/Button";
import { saveMutualsState } from "../../../utils/mutualsStorage";
import { showToast } from "../../../utils/ui";

export default function SignupGate({ next }) {
  return (
    <Phone mood="yellow">
      <div className="relative z-10 px-7 pt-24 text-center">
        <p className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
          mid-reveal cliffhanger
        </p>
        <h2 className="mt-7 text-6xl font-black leading-[0.85] tracking-tighter">7 cards are still locked.</h2>
        <p className="mx-auto mt-4 max-w-[270px] text-sm font-bold text-black/60">
          Sign up to unlock The Stranger, One-Way Street, full matrix, and Today questions.
        </p>
      </div>
      <BottomSheet>
        <div className="rounded-[28px] bg-[#6b2cff] p-4 text-white">
          <p className="text-xs font-black uppercase tracking-widest text-white/55">up next</p>
          <p className="mt-2 text-3xl font-black leading-none">Nobody knows Will.</p>
          <p className="mt-2 text-sm text-white/70">This is the card the group will screenshot.</p>
        </div>
        <div className="mt-5 space-y-3">
          <Button
            onClick={() => {
              saveMutualsState({ signedUp: true });
              showToast("Signed up — 7 cards unlocked");
              next();
            }}
            tone="pink"
            icon={Lock}
          >
            Sign up and continue
          </Button>
          <Button
            onClick={() => {
              saveMutualsState({ signedUp: true, demoSkippedSignup: true });
              next();
            }}
            tone="white"
            icon={Eye}
          >
            Skip for now
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
