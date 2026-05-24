import { useState } from "react";
import { Users, UserPlus, X } from "lucide-react";
import Phone from "../ui/Phone";
import { ensureGroup, saveMutualsState, newRoomId } from "../../../utils/mutualsStorage";
import { captureGroup } from "../../../lib/mutualsApi";

export default function Home({ next, go }) {
  const [how, setHow] = useState(false);

  const startRoom = (mode) => {
    ensureGroup(newRoomId());
    saveMutualsState({
      groupMode: mode,
      selfAnswers: {},
      guesses: {},
      revealUnlocked: false,
      completedSteps: [],
      soloDemo: false,
    });
    captureGroup();
    next();
  };

  return (
    <Phone mood="dark">
      <div className="relative z-10 flex flex-1 flex-col px-6 pb-8 pt-20 text-white">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-7xl font-black leading-none tracking-tighter">
            MUT<span className="text-[#d7ff2f]">U</span>ALS
          </h1>
          <p className="mt-4 text-lg font-bold text-white/70">Find out who knows who.</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => startRoom("duo")}
            className="flex w-full items-center justify-between rounded-[28px] bg-[#6b2cff] p-5 text-left shadow-xl transition active:scale-[0.98]"
          >
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-white/60">1:1 showdown</p>
              <p className="mt-0.5 text-2xl font-black">Challenge 1 Friend</p>
              <p className="text-sm font-bold text-white/70">Prove who knows who better.</p>
            </div>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15">
              <Users className="h-6 w-6" />
            </div>
          </button>

          <button
            onClick={() => startRoom("group")}
            className="flex w-full items-center justify-between rounded-[28px] bg-[#ff4f9a] p-5 text-left shadow-xl transition active:scale-[0.98]"
          >
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-white/70">group chaos</p>
              <p className="mt-0.5 text-2xl font-black">Start Group Room</p>
              <p className="text-sm font-bold text-white/80">Who actually pays attention?</p>
            </div>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20">
              <Users className="h-6 w-6" />
            </div>
          </button>

          <button
            onClick={() => go("Join")}
            className="flex w-full items-center justify-center gap-2 rounded-[24px] border-2 border-white/15 bg-white/5 p-4 text-sm font-black text-white transition active:scale-[0.98]"
          >
            <UserPlus className="h-5 w-5" /> Join a Room
          </button>

          <p className="pt-1 text-center text-xs font-bold text-white/45">
            Answer about yourself. Guess your friends. Reveal the receipts.
          </p>
          <button
            onClick={() => setHow(true)}
            className="mx-auto block text-center text-xs font-black uppercase tracking-widest text-white/50 underline-offset-4 hover:underline"
          >
            How it works
          </button>
        </div>
      </div>

      {how && <HowItWorks onClose={() => setHow(false)} />}
    </Phone>
  );
}

function HowItWorks({ onClose }) {
  const steps = [
    { n: "1", t: "Answer about yourself", d: "A few spicy questions. Be honest — your answers stay hidden." },
    { n: "2", t: "Guess your friends", d: "Predict what they actually picked about themselves." },
    { n: "3", t: "Reveal the receipts", d: "See who knows who — and who was guessing vibes." },
  ];
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/60" onClick={onClose}>
      <div className="rounded-t-[34px] bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p className="text-xl font-black">How it works</p>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-black/5">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {steps.map((s) => (
            <div key={s.n} className="flex gap-3 rounded-2xl bg-[#f3efff] p-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#6b2cff] text-sm font-black text-white">
                {s.n}
              </div>
              <div>
                <p className="text-sm font-black">{s.t}</p>
                <p className="text-xs font-bold text-black/55">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
