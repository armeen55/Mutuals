import { useState, useEffect } from "react";
import { Share2, Users, Trophy, RotateCcw } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Button from "../ui/Button";
import { useMutuals } from "../useMutuals";
import { shareUrl, saveMutualsState, newRoomId, ensureGroup } from "../../../utils/mutualsStorage";
import { getInsights, captureGroup } from "../../../lib/mutualsApi";
import { shareOrCopy, showToast } from "../../../utils/ui";
import { EAZO_VOTE_URL } from "../../../config";

// Only treat the vote CTA as live once a real link replaces the placeholder.
const eazoReady = !/^https?:\/\/eazo\.ai\/?$/.test(EAZO_VOTE_URL);

export default function Share({ go }) {
  const app = useMutuals();
  const link = shareUrl(app.activeGroupId);
  const [data, setData] = useState(null); // { cards, bundle, readiness }

  // Pull the finished reveal so the aftermath can name a winner + count players.
  useEffect(() => {
    if (app.soloDemo || !app.activeGroupId) return;
    getInsights(app.activeGroupId).then(setData).catch(() => {});
  }, [app.activeGroupId, app.soloDemo]);

  const participants = data?.bundle?.participants || [];
  const winner = (data?.cards || []).find((c) => c.id === "winner");
  const myPid = (app.participantIdsByGroup || {})[app.activeGroupId];
  const round = (app.roundsByGroup || {})[app.activeGroupId] || null;
  const lateJoiners = round ? participants.filter((p) => p.id !== myPid && !round.known.includes(p.id)) : [];
  const late = lateJoiners[0];

  // Challenge / rematch always start a FRESH room (no stale answers) and route to Create.
  const newRoom = (mode) => {
    const id = newRoomId();
    ensureGroup(id);
    saveMutualsState({
      groupMode: mode,
      selfAnswers: {},
      guesses: {},
      revealUnlocked: false,
      completedSteps: [],
      soloDemo: false,
    });
    captureGroup();
    showToast(mode === "duo" ? "New 1:1 room" : "New group room");
    go("Create");
  };

  const shareReceipts = () =>
    shareOrCopy({
      text: winner
        ? `${winner.headline} We just found out who actually knows who.`
        : "We just played MUTUALS and found out who actually knows who.",
      url: link,
    });

  return (
    <Phone mood="yellow">
      <div className="relative z-10 px-7 pt-20 text-center">
        <p className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
          the verdict is in
        </p>
        <h2 className="mt-6 text-6xl font-black leading-[0.85] tracking-tighter">Your group has receipts.</h2>
        <p className="mx-auto mt-4 max-w-[260px] text-sm font-bold text-black/60">Send it before they deny it.</p>
      </div>
      <BottomSheet>
        <div className="rounded-[26px] bg-black p-4 text-white">
          <p className="text-[11px] font-black uppercase tracking-widest text-white/50">this reveal</p>
          <p className="mt-1 break-words text-lg font-black leading-tight">
            {winner ? winner.headline : "Who actually knows who."}
          </p>
          <p className="mt-1 text-xs font-bold text-white/60">
            {participants.length > 0 ? `${participants.length} players in this round.` : "Your round is in."}
            {late ? ` ${late.displayName} joined late — run it back with them?` : ""}
          </p>
        </div>

        <div className="mt-3">
          <Button tone="pink" icon={Share2} onClick={shareReceipts}>
            Share the receipts
          </Button>
        </div>
        <div className="mt-3">
          <Button tone="lime" icon={RotateCcw} onClick={() => newRoom(app.groupMode || "group")}>
            {late ? `Run it back with ${late.displayName}` : "Run it back with this room"}
          </Button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Button tone="white" icon={Users} onClick={() => newRoom("duo")}>
            Challenge a friend
          </Button>
          <Button tone="white" icon={Users} onClick={() => newRoom("group")}>
            Challenge a group
          </Button>
        </div>
        <div className="mt-3">
          <Button
            tone="dark"
            icon={Trophy}
            className={eazoReady ? "" : "pointer-events-none opacity-40"}
            onClick={eazoReady ? () => window.open(EAZO_VOTE_URL, "_blank", "noopener") : undefined}
          >
            {eazoReady ? "Help MUTUALS win on Eazo" : "Eazo vote link coming"}
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
