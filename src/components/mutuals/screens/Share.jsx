import { useState, useEffect } from "react";
import { Share2, Link2, MoreHorizontal, Users, RotateCcw, Map as MapIcon, Trophy } from "lucide-react";
import Phone from "../ui/Phone";
import ShareActionTile from "../ui/ShareActionTile";
import Button from "../ui/Button";
import { useMutuals } from "../useMutuals";
import { shareUrl, saveMutualsState, newRoomId, ensureGroup } from "../../../utils/mutualsStorage";
import { getInsights, captureGroup } from "../../../lib/mutualsApi";
import { shareOrCopy, showToast } from "../../../utils/ui";
import { createRevealShareImage, shareImageBlob } from "../../../utils/shareImage";
import { track } from "../../../utils/analytics";
import { EAZO_VOTE_URL } from "../../../config";

export default function Share({ go }) {
  const app = useMutuals();
  const link = shareUrl(app.activeGroupId);
  const [data, setData] = useState(null); // { cards, bundle, readiness }

  useEffect(() => {
    if (app.soloDemo || !app.activeGroupId) return;
    getInsights(app.activeGroupId).then(setData).catch(() => {});
  }, [app.activeGroupId, app.soloDemo]);

  const cards = data?.cards || [];
  const participants = data?.bundle?.participants || [];
  // Auto-pick the spiciest card for the share hero (not always the winner).
  const hero =
    ["receipts", "power", "mystery", "winner"].map((id) => cards.find((c) => c.id === id)).find(Boolean) ||
    cards[0] ||
    null;
  const roomMode = data?.bundle?.group?.mode || app.groupMode || "duo";
  const HERO_LABELS = { receipts: "receipt of the round", power: "strongest mutual", mystery: "mystery friend", winner: "top knower" };
  const heroLabel = (hero && HERO_LABELS[hero.id]) || "result";
  const myPid = (app.participantIdsByGroup || {})[app.activeGroupId];
  const round = (app.roundsByGroup || {})[app.activeGroupId] || null;
  const lateJoiners = round ? participants.filter((p) => p.id !== myPid && !round.known.includes(p.id)) : [];
  const late = lateJoiners[0];

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
      roundsByGroup: {},
    });
    captureGroup();
    track("rematch_clicked", { mode, from: "share" });
    showToast(mode === "duo" ? "New 1:1 room ready" : "New group room ready");
    go("Create");
  };

  const shareImage = async () => {
    track("share_image_clicked", { from: "share" });
    try {
      if (!hero) throw new Error("no card");
      const blob = await createRevealShareImage(hero, { index: 0 });
      const res = await shareImageBlob({
        blob,
        text: hero.shareText || "We just found out who actually knows who.",
        url: link,
        fileName: "mutuals-result.png",
      });
      showToast(res === "downloaded" ? "Image saved" : res === "copied" ? "Link copied" : "Shared");
    } catch {
      shareOrCopy({ text: hero ? hero.headline : "We just played MUTUALS.", url: link });
    }
  };
  const copyLink = () => {
    navigator.clipboard?.writeText(link);
    showToast("Link copied");
  };
  const voteEazo = () => {
    track("eazo_vote_clicked");
    window.open(EAZO_VOTE_URL, "_blank", "noopener");
  };

  return (
    <Phone mood="dark">
      <div
        className="relative z-10 flex h-[100dvh] flex-col px-[var(--screen-pad-x)] text-white"
        style={{
          paddingTop: "clamp(18px, 5svh, 44px)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + clamp(14px, 3svh, 26px))",
        }}
      >
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-white/60">that was fun</p>
          <h2 className="mt-2 font-black leading-[0.95] tracking-tighter text-[clamp(2rem,8.5vw,3rem)] short:text-[clamp(1.7rem,7.5vw,2.3rem)]">
            {roomMode === "duo" ? "The verdict is in." : "The receipts are in."}
          </h2>
          <p className="mx-auto mt-2 max-w-[280px] text-sm font-bold text-white/60 tiny:hidden">Share this before they deny it.</p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-center py-3">
          <div className="rounded-[26px] bg-[#7B3CFF] p-5 shadow-xl">
            <div className="flex items-center gap-2 text-white/70">
              <Trophy className="h-4 w-4" />
              <p className="text-[11px] font-black uppercase tracking-widest">{heroLabel}</p>
            </div>
            <p className="mt-2 break-words text-2xl font-black leading-tight">
              {hero ? hero.headline : "Who actually knows who."}
            </p>
            <p className="mt-2 text-xs font-bold text-white/55">
              {participants.length > 0 ? `${participants.length} players in this round.` : "Your round is in."}
              {late ? ` ${late.displayName} joined late — run it back with them?` : ""}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <ShareActionTile icon={Share2} label="Share the receipts" onClick={shareImage} tone="primary" />
          <ShareActionTile icon={Link2} label="Copy link" onClick={copyLink} />
          <ShareActionTile
            icon={MoreHorizontal}
            label="More"
            onClick={() => shareOrCopy({ text: hero ? hero.headline : "We just played MUTUALS.", url: link })}
          />
        </div>

        <div className="mt-3 short:mt-2">
          <Button tone="yellow" icon={Trophy} onClick={voteEazo}>
            Vote for MUTUALS
          </Button>
          <p className="mt-1.5 text-center text-[11px] font-bold text-white/55 short:mt-1">Search MUTUALS on Eazo. Use all your votes.</p>
        </div>

        <div className="mt-3 short:mt-2">
          <Button tone="primary" icon={RotateCcw} onClick={() => newRoom(app.groupMode || "group")}>
            {late ? `Run it back with ${late.displayName}` : "Run it back · new questions"}
          </Button>
          <p className="mt-1.5 text-center text-[11px] font-bold text-white/45 short:hidden">Same chaos, new receipts.</p>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => newRoom("duo")}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-white/15 bg-white/5 py-3 text-xs font-black text-white active:scale-95"
          >
            <Users className="h-4 w-4" /> Challenge 1 Friend
          </button>
          <button
            onClick={() => newRoom("group")}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-white/15 bg-white/5 py-3 text-xs font-black text-white active:scale-95"
          >
            <Users className="h-4 w-4" /> Challenge a Group
          </button>
        </div>

        <div className="mt-2 flex items-center justify-center gap-5">
          <button onClick={() => go("Matrix")} className="flex items-center gap-1.5 text-xs font-black text-white/55">
            <MapIcon className="h-4 w-4" /> {roomMode === "duo" ? "View breakdown" : "View map"}
          </button>
          <button onClick={() => go("Home")} className="text-xs font-black text-white/45">
            Back to start
          </button>
        </div>
      </div>
    </Phone>
  );
}
