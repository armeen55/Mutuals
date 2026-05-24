import { useState, useEffect, useMemo, useRef } from "react";
import { Share2, ChevronLeft, Lock, Copy, Image as ImageIcon, Link2, MoreHorizontal } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import BigRevealCard from "../ui/BigRevealCard";
import PlayerChips from "../ui/PlayerChips";
import ShareActionTile from "../ui/ShareActionTile";
import Button from "../ui/Button";
import { insightCards } from "../../../data/mutualsDemoData";
import { selectQuestions } from "../../../data/questions";
import { useMutuals } from "../useMutuals";
import { shareUrl, saveMutualsState, repairParticipantId } from "../../../utils/mutualsStorage";
import { getInsights, captureGroup } from "../../../lib/mutualsApi";
import { roomStatus } from "../../../lib/insights";
import { cx, showToast, shareOrCopy } from "../../../utils/ui";
import { createRevealShareImage, shareImageBlob } from "../../../utils/shareImage";
import { track } from "../../../utils/analytics";

// Seeded fallback order (skips index 3 — the "Full Report" gate card).
const SEEDED = [0, 1, 2, 4, 5, 6, 7, 8, 9].map((i) => insightCards[i]);

export default function Reveal({ next, go, goSignup }) {
  const app = useMutuals();
  const [real, setReal] = useState(null); // { readiness, cards, bundle }
  const [loading, setLoading] = useState(!app.soloDemo);
  const [pos, setPos] = useState(0);
  const viewedRef = useRef(false);
  const myPid = (app.participantIdsByGroup || {})[app.activeGroupId];
  const need = useMemo(() => selectQuestions(app.activeGroupId).length, [app.activeGroupId]);

  const [checking, setChecking] = useState(false);
  const applyReal = (r) => {
    setReal(r);
    repairParticipantId(app.activeGroupId, r?.bundle?.participants);
  };
  const refresh = () => {
    if (app.soloDemo || !app.activeGroupId) {
      setLoading(false);
      return;
    }
    getInsights(app.activeGroupId)
      .then(applyReal)
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  const checkAgain = () => {
    setChecking(true);
    if (app.soloDemo || !app.activeGroupId) return setChecking(false);
    getInsights(app.activeGroupId)
      .then(applyReal)
      .catch(() => {})
      .finally(() => setTimeout(() => setChecking(false), 400));
  };
  const unlockAsDuo = () => {
    saveMutualsState({ groupMode: "duo" });
    captureGroup();
    showToast("Switched to 1:1");
    setTimeout(refresh, 400);
  };

  // Initial fetch + lightweight auto-refresh until the reveal is ready.
  useEffect(() => {
    if (app.soloDemo || !app.activeGroupId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    refresh();
    const id = setInterval(() => {
      getInsights(app.activeGroupId)
        .then((r) => {
          applyReal(r);
          if (r?.readiness?.unlocked && r.cards?.length > 0) clearInterval(id);
        })
        .catch(() => {});
    }, 6000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.activeGroupId, app.soloDemo]);

  // Backend-aware redirect: only bounce to Answer if the user truly hasn't played
  // (not completed on the backend AND no local unlock) AND the room isn't ready.
  useEffect(() => {
    if (app.soloDemo || !real) return;
    const iCompleted = myPid && real.bundle?.completed?.[myPid];
    const played = app.revealUnlocked || iCompleted;
    if (!played && !real.readiness?.unlocked) go("Answer");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [real]);

  const unlocked = !app.soloDemo && real && real.readiness?.unlocked;
  const realReady = unlocked && real.cards?.length > 0;
  useEffect(() => {
    if (realReady && !viewedRef.current) {
      viewedRef.current = true;
      track("reveal_viewed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realReady]);

  // Real room still loading.
  if (!app.soloDemo && app.activeGroupId && loading && !real) {
    return (
      <Phone mood="purple">
        <div className="relative z-10 px-6 pt-32 text-center text-white">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-white/70">reveal</p>
          <h2 className="mt-4 text-5xl font-black leading-none tracking-tighter">Tallying the group…</h2>
        </div>
      </Phone>
    );
  }

  // Real room, not enough finished yet → waiting state (auto-refreshing).
  if (!app.soloDemo && app.activeGroupId && real && !unlocked) {
    const r = real.readiness || { completedCount: 0, required: 3 };
    const participants = real.bundle?.participants || [];
    const mode = real.bundle?.group?.mode || app.groupMode || "duo";
    const needFinish = Math.max(0, r.required - r.completedCount);
    const status = roomStatus(real.bundle, need);
    const unfinishedNames = participants
      .filter((p) => !real.bundle?.completed?.[p.id])
      .map((p) => p.displayName)
      .slice(0, 2)
      .join(", ");
    return (
      <Phone mood="purple">
        <div className="relative z-10 px-6 pt-20 text-center">
          <span className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
            {mode === "duo" ? "1:1 room" : "Group room"}
          </span>
        </div>
        <BottomSheet tall>
          <p className="text-xs font-black uppercase tracking-widest text-black/35">
            {status.joined} joined · {status.answered} answered · {status.finished} finished
          </p>
          <h2 className="mt-2 text-4xl font-black leading-[0.95] tracking-tighter text-black">
            {needFinish > 0 ? `${needFinish} more to finish.` : "Unlocking…"}
          </h2>
          <p className="mt-2 text-sm font-bold text-black/55">
            Group unlocks at 3 finished. 1:1 at 2. Partial reveals still work — updating live…
          </p>
          <div className="mt-4 rounded-[26px] bg-[#f4f1fa] p-4">
            <PlayerChips participants={participants} statuses={status.statuses} youId={myPid} />
          </div>
          {mode === "group" && participants.length === 2 && (
            <div className="mt-4">
              <Button tone="pink" onClick={unlockAsDuo}>
                Unlock as 1:1 now
              </Button>
            </div>
          )}
          <div className="mt-4">
            <Button
              tone="pink"
              icon={Share2}
              onClick={() =>
                shareOrCopy({
                  text: unfinishedNames
                    ? `${unfinishedNames} — finish your MUTUALS answers. The receipts are waiting.`
                    : "Finish your MUTUALS answers. The receipts are waiting.",
                  url: shareUrl(app.activeGroupId),
                })
              }
            >
              {unfinishedNames ? `Nudge ${unfinishedNames.split(",")[0]}` : "Nudge the group"}
            </Button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Button
              tone="lime"
              icon={Copy}
              onClick={() => {
                navigator.clipboard?.writeText(shareUrl(app.activeGroupId));
                showToast("Link copied");
              }}
            >
              Copy link
            </Button>
            <Button tone="dark" onClick={checkAgain}>
              {checking ? "Checking…" : "Check again"}
            </Button>
          </div>
        </BottomSheet>
      </Phone>
    );
  }

  // Everyone finished but there weren't enough overlapping guesses to build cards.
  if (!app.soloDemo && app.activeGroupId && unlocked && !realReady) {
    return (
      <Phone mood="purple">
        <div className="relative z-10 px-6 pt-24 text-center text-white">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-white/70">reveal</p>
          <h2 className="mt-4 text-5xl font-black leading-none tracking-tighter">Everyone's in.</h2>
          <p className="mx-auto mt-4 max-w-[270px] text-sm font-bold text-white/75">
            Not enough overlapping guesses yet to build your cards. Get more friends to guess each other, or run it back.
          </p>
        </div>
        <BottomSheet>
          <Button
            tone="pink"
            icon={Share2}
            onClick={() =>
              shareOrCopy({ text: "Find out who actually knows who in our group.", url: shareUrl(app.activeGroupId) })
            }
          >
            Share the room
          </Button>
          <div className="mt-3">
            <Button tone="white" onClick={() => go("Share")}>
              Continue
            </Button>
          </div>
        </BottomSheet>
      </Phone>
    );
  }

  const cards = realReady ? real.cards : SEEDED;
  const card = cards[Math.min(pos, cards.length - 1)];
  const atGate = !realReady && !app.signedUp && pos >= 2 && pos < cards.length;
  const atEnd = pos >= cards.length - 1;
  const status = realReady ? roomStatus(real.bundle, need) : null;
  const notFinished = status ? Math.max(0, status.joined - status.finished) : 0;
  const round = (app.roundsByGroup || {})[app.activeGroupId] || null;
  const lateJoiners =
    realReady && round
      ? (real.bundle?.participants || []).filter((p) => p.id !== myPid && !round.known.includes(p.id))
      : [];
  const roomUrl = shareUrl(app.activeGroupId);
  const mode = real?.bundle?.group?.mode || app.groupMode || "duo";
  const advance = () => (atEnd ? (realReady ? go("Matrix") : go("Share")) : setPos(pos + 1));
  const shareImage = async () => {
    track("share_image_clicked");
    try {
      const blob = await createRevealShareImage(card, { index: pos });
      const res = await shareImageBlob({ blob, text: card.shareText || card.headline, url: roomUrl, fileName: "mutuals-reveal.png" });
      showToast(res === "downloaded" ? "Image saved" : res === "copied" ? "Link copied" : "Shared");
    } catch {
      shareOrCopy({ text: card.shareText || card.headline, url: roomUrl });
    }
  };
  const copyLink = () => {
    navigator.clipboard?.writeText(roomUrl);
    showToast("Link copied");
  };
  return (
    <Phone mood="dark">
      <div
        className="relative z-10 flex h-[100dvh] flex-col px-5 text-white"
        style={{
          paddingTop: "clamp(16px, 4svh, 34px)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + clamp(14px, 3svh, 26px))",
        }}
      >
        <p className="text-center text-sm font-black text-white/70">Here's what we learned…</p>

        <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-y-auto py-2">
          <div className="my-auto w-full">
            <BigRevealCard card={card} index={pos} />
          </div>
        </div>

        <div className="mt-2 flex justify-center gap-1.5">
          {cards.map((_, i) => (
            <div
              key={i}
              className={cx(
                "h-2 rounded-full transition-all",
                i === pos ? "w-6 bg-[#ff4f9a]" : i < pos ? "w-2 bg-white/60" : "w-2 bg-white/20"
              )}
            />
          ))}
        </div>

        {realReady && (notFinished > 0 || lateJoiners.length > 0) && (
          <p className="mt-2 text-center text-[11px] font-bold text-white/55">
            {status.finished} finished{notFinished > 0 ? ` · ${notFinished} more can make it better` : ""}
            {lateJoiners.length > 0 ? ` · ${lateJoiners[0].displayName} joined late` : ""}
          </p>
        )}

        <div className="mt-3 flex gap-2">
          <ShareActionTile icon={ImageIcon} label="Share Image" onClick={shareImage} tone="primary" />
          <ShareActionTile icon={Link2} label="Copy Link" onClick={copyLink} />
          <ShareActionTile
            icon={MoreHorizontal}
            label="More"
            onClick={() => shareOrCopy({ text: card.shareText || card.headline, url: roomUrl })}
          />
        </div>

        <div className="mt-3 flex items-center gap-2">
          {pos > 0 && (
            <button
              onClick={() => setPos(Math.max(0, pos - 1))}
              aria-label="Previous"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-white transition active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {atGate ? (
            <Button onClick={goSignup} tone="pink" icon={Lock}>
              Unlock 7 more
            </Button>
          ) : (
            <Button onClick={advance} tone="primary">
              {atEnd ? (realReady ? (mode === "duo" ? "See the breakdown" : "See the map") : "Finish") : "Next result"}
            </Button>
          )}
        </div>
      </div>
    </Phone>
  );
}
