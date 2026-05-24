import { useState, useEffect, useMemo } from "react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Button from "../ui/Button";
import { useMutuals } from "../useMutuals";
import { saveMutualsState, withStep, getMutualsState, repairParticipantId } from "../../../utils/mutualsStorage";
import { captureJoin, getBundle } from "../../../lib/mutualsApi";
import { roomStatus } from "../../../lib/insights";
import { selectQuestions } from "../../../data/questions";
import { cx, showToast } from "../../../utils/ui";
import { track } from "../../../utils/analytics";

const PAYOFF = ["Who knows who", "Answer everyone missed", "Power pair"];

export default function JoinWall({ go }) {
  const app = useMutuals();
  const [name, setName] = useState(app.currentUserName || "");
  const [bundle, setBundle] = useState(null);
  const need = useMemo(() => selectQuestions(app.activeGroupId).length, [app.activeGroupId]);

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
  const mode = bundle?.group?.mode || app.groupMode || "duo";
  const isDuo = mode === "duo";
  const status = roomStatus(bundle, need);
  // The earliest real participant is the host — never fake one.
  const host = participants[0]?.displayName;

  const join = () => {
    const n = name.trim();
    if (!n) return;
    saveMutualsState({ currentUserName: n, completedSteps: withStep("Join") });
    captureJoin(n);
    track("joined_room", { mode });
    showToast(`Welcome, ${n}`);
    const s = getMutualsState();
    if (!s.selfAnswers || Object.keys(s.selfAnswers).length === 0) go("Answer");
    else if (!s.revealUnlocked) go("Guess");
    else go("Reveal");
  };

  const badge = isDuo ? "1:1 challenge" : "group room";
  const headline = isDuo ? (host ? `${host} challenged you.` : "You got challenged.") : "The group chat is on the record.";
  const subhead = isDuo
    ? "Answer a quick round. Guess each other. See who actually pays attention."
    : "Answer about yourself, guess your friends, reveal the receipts.";
  const cta = isDuo ? "Accept challenge" : "Join room";
  const emptyCopy = isDuo ? "Waiting for both players." : "Be first in. Bring the chaos.";

  return (
    <Phone mood="cream">
      <div className="relative z-10 px-6 text-center text-[#17112B]" style={{ paddingTop: "clamp(40px, 8svh, 80px)" }}>
        <p className="inline-flex rounded-full bg-[#17112B] px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
          {badge}
        </p>
        <h2 className="mx-auto mt-4 font-black leading-[0.9] tracking-tighter" style={{ fontSize: "clamp(2.8rem, 12vw, 4.6rem)", maxWidth: "340px" }}>
          {headline}
        </h2>
        <p className="mx-auto mt-3 max-w-[300px] text-sm font-bold leading-snug text-black/60">{subhead}</p>
      </div>

      <BottomSheet variant="standard">
        {/* 1 — live room proof */}
        <div className="rounded-[22px] bg-[#F3EFFF] p-4">
          <p className="text-[11px] font-black uppercase tracking-widest text-black/40">
            {status.joined} joined · {status.answered} answered · {status.finished} finished
          </p>
          {participants.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {participants.map((p) => (
                <span key={p.id} className="rounded-full bg-[#6B2CFF] px-3 py-1 text-xs font-black text-white">
                  {p.displayName}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-1.5 text-sm font-black text-black/55">{emptyCopy}</p>
          )}
        </div>

        {/* 2 — payoff preview */}
        <div className="mt-3 flex flex-wrap gap-2">
          {PAYOFF.map((p) => (
            <span key={p} className="rounded-full bg-[#FFF3DF] px-3 py-1.5 text-[11px] font-black text-[#17112B] ring-1 ring-black/5">
              {p}
            </span>
          ))}
        </div>

        {/* 3 — name input */}
        <div className="mt-4">
          <p className="text-[11px] font-black uppercase tracking-widest text-black/40">your display name</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && join()}
            placeholder="Name your friends know"
            maxLength={24}
            className="mt-1.5 min-h-[58px] w-full rounded-2xl border-4 border-black/10 bg-white px-4 text-base font-black text-[#17112B] outline-none placeholder:font-bold placeholder:text-black/30 focus:border-[#6B2CFF]"
          />
        </div>

        {/* 4 — primary CTA */}
        <div className="mt-3">
          <Button
            onClick={join}
            tone={isDuo ? "primary" : "pink"}
            className={cx("min-h-[60px]", name.trim() ? "" : "pointer-events-none opacity-40")}
          >
            {cta}
          </Button>
        </div>
        <p className="mt-2 text-center text-[11px] font-bold text-black/35">No account. No install. Takes about 2 minutes.</p>
      </BottomSheet>
    </Phone>
  );
}
