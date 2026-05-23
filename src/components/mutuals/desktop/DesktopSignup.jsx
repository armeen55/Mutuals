import { Lock } from "lucide-react";
import AbstractBg from "../ui/AbstractBg";
import Button from "../ui/Button";
import { saveMutualsState } from "../../../utils/mutualsStorage";
import { showToast } from "../../../utils/ui";

export default function DesktopSignup({ setStep }) {
  return (
    <div className="mt-8 grid grid-cols-[1fr_330px] gap-6">
      <div className="relative min-h-[380px] overflow-hidden rounded-[38px] bg-[#ffbd00] p-8">
        <AbstractBg mood="yellow" />
        <div className="relative z-10 max-w-xl">
          <p className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-widest text-white">
            signup cliffhanger
          </p>
          <h2 className="mt-10 text-7xl font-black leading-[0.85] tracking-tighter">7 cards are still locked.</h2>
          <p className="mt-5 text-lg font-bold text-black/60">Sign up after the payoff. Not before play.</p>
        </div>
      </div>
      <div className="rounded-[34px] bg-white p-6">
        <p className="text-3xl font-black">Unlock The Stranger + full matrix.</p>
        <p className="mt-3 text-sm font-bold text-black/55">This is the hackathon vote engine.</p>
        <div className="mt-5">
          <Button
            tone="pink"
            icon={Lock}
            onClick={() => {
              saveMutualsState({ signedUp: true });
              showToast("Signed up — 7 cards unlocked");
              setStep(8);
            }}
          >
            Sign up and continue
          </Button>
        </div>
      </div>
    </div>
  );
}
