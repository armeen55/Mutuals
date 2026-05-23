import AbstractBg from "../ui/AbstractBg";
import Button from "../ui/Button";
import { getMutualsState, saveMutualsState } from "../../../utils/mutualsStorage";

export default function DesktopJoin({ setStep }) {
  const join = () => {
    if (!getMutualsState().currentUserName) saveMutualsState({ currentUserName: "You" });
    setStep(4);
  };
  return (
    <div className="mt-8 grid grid-cols-[1fr_330px] gap-6">
      <div className="relative min-h-[360px] overflow-hidden rounded-[36px] bg-[#ffbd00] p-8">
        <AbstractBg mood="yellow" />
        <div className="relative z-10 max-w-xl">
          <p className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-widest text-white">
            invited friend view
          </p>
          <h2 className="mt-10 text-7xl font-black leading-[0.85] tracking-tighter">
            Armeen wants to test the group.
          </h2>
          <p className="mt-5 text-lg font-bold text-black/60">Takes 90 seconds. Answers stay private until reveal.</p>
        </div>
      </div>
      <div className="rounded-[34px] bg-white p-6">
        <p className="text-xs font-black uppercase tracking-widest text-black/35">Context before answering</p>
        <p className="mt-4 text-2xl font-black">6 invited · 3 finished · 10 reveal cards</p>
        <div className="mt-5">
          <Button tone="pink" onClick={join}>Join and answer</Button>
        </div>
      </div>
    </div>
  );
}
