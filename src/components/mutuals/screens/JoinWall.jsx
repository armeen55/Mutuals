import { useState, useEffect } from "react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Button from "../ui/Button";
import { useMutuals } from "../useMutuals";
import { saveMutualsState, withStep, getMutualsState, repairParticipantId } from "../../../utils/mutualsStorage";
import { captureJoin, getBundle } from "../../../lib/mutualsApi";
import { showToast } from "../../../utils/ui";

export default function JoinWall({ go }) {
  const app = useMutuals();
  const [name, setName] = useState(app.currentUserName || "");
  const [bundle, setBundle] = useState(null);

  useEffect(() => {
    if (app.activeGroupId)
      getBundle(app.activeGroupId)
        .then((b) => {
          setBundle(b);
          repairParticipantId(app.activeGroupId, b?.participants);
          if (b?.group?.mode) saveMutualsState({ groupMode: b.group.mode });
        })
        .catch(() => {});
  }, [app.activeGroupId]);

  const participants = bundle?.participants || [];

  const join = () => {
    const n = name.trim();
    if (!n) return;
    saveMutualsState({ currentUserName: n, completedSteps: withStep("Join") });
    captureJoin(n);
    showToast(`Welcome, ${n}`);
    const s = getMutualsState();
    if (!s.selfAnswers || Object.keys(s.selfAnswers).length === 0) go("Answer");
    else if (!s.revealUnlocked) go("Guess");
    else go("Reveal");
  };

  return (
    <Phone mood="yellow">
      <div className="relative z-10 px-7 pt-20 text-center">
        <p className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
          add your name
        </p>
        <h2 className="mt-6 text-6xl font-black leading-[0.85] tracking-tighter">What should we call you?</h2>
        <p className="mx-auto mt-4 max-w-[270px] text-sm font-bold text-black/60">
          This is the name your friends will guess. Use one they'll recognize.
        </p>
      </div>
      <BottomSheet>
        <div className="rounded-[26px] bg-[#f3efff] p-4">
          <p className="text-xs font-black uppercase tracking-widest text-black/35">joined ({participants.length})</p>
          {participants.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {participants.map((p) => (
                <span key={p.id} className="rounded-full bg-[#6b2cff] px-3 py-1 text-xs font-black text-white">
                  {p.displayName}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm font-bold text-black/45">No one has joined yet.</p>
          )}
        </div>
        <div className="mt-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={24}
            className="w-full rounded-3xl border-4 border-black/10 bg-white px-5 py-4 text-base font-black text-black outline-none placeholder:font-bold placeholder:text-black/30 focus:border-[#6b2cff]"
          />
        </div>
        <div className="mt-3">
          <Button onClick={join} tone="pink" className={name.trim() ? "" : "pointer-events-none opacity-40"}>
            Continue
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
