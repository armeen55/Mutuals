import { useState, useEffect } from "react";
import { Download, Share2, ChevronLeft, Lock, Copy } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import BigRevealCard from "../ui/BigRevealCard";
import Button from "../ui/Button";
import { insightCards } from "../../../data/mutualsDemoData";
import { useMutuals } from "../useMutuals";
import { shareUrl, saveMutualsState, repairParticipantId } from "../../../utils/mutualsStorage";
import { getInsights, captureGroup } from "../../../lib/mutualsApi";
import { cx, showToast, shareOrCopy } from "../../../utils/ui";

// Seeded fallback order (skips index 3 — the "Full Report" gate card).
const SEEDED = [0, 1, 2, 4, 5, 6, 7, 8, 9].map((i) => insightCards[i]);

export default function Reveal({ next, go, goSignup }) {
  const app = useMutuals();
  const [real, setReal] = useState(null); // { readiness, cards, bundle }
  const [loading, setLoading] = useState(!app.soloDemo);
  const [pos, setPos] = useState(0);
  const myPid = (app.participantIdsByGroup || {})[app.activeGroupId];

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
    const need = Math.max(0, r.required - r.completedCount);
    return (
      <Phone mood="purple">
        <div className="relative z-10 px-6 pt-20 text-center">
          <span className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
            {mode === "duo" ? "1:1 room" : "Group room"}
          </span>
        </div>
        <BottomSheet tall>
          <p className="text-xs font-black uppercase tracking-widest text-black/35">
            {r.completedCount}/{r.required} finished · {participants.length} joined
          </p>
          <h2 className="mt-2 text-4xl font-black leading-[0.95] tracking-tighter text-black">
            {need > 0 ? `Need ${need} more to finish.` : "Unlocking…"}
          </h2>
          <p className="mt-2 text-sm font-bold text-black/55">
            Group rooms unlock at 3. 1:1 rooms unlock at 2. Updating live…
          </p>
          <div className="mt-4 rounded-[26px] bg-[#f4f1fa] p-4">
            <div className="flex flex-wrap gap-2">
              {participants.map((p) => (
                <span key={p.id} className="rounded-full bg-[#6b2cff] px-3 py-1 text-xs font-black text-white">
                  {p.displayName}
                </span>
              ))}
            </div>
          </div>
          {mode === "group" && participants.length === 2 && (
            <div className="mt-4">
              <Button tone="pink" onClick={unlockAsDuo}>
                Unlock as 1:1 now
              </Button>
            </div>
          )}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              tone="lime"
              icon={Copy}
              onClick={() => {
                navigator.clipboard?.writeText(shareUrl(app.activeGroupId));
                showToast("Link copied");
              }}
            >
              Copy invite
            </Button>
            <Button
              tone="white"
              icon={Share2}
              onClick={() =>
                shareOrCopy({
                  text: "Our group is about to find out who the mystery friend is.",
                  url: shareUrl(app.activeGroupId),
                })
              }
            >
              Share invite
            </Button>
          </div>
          <div className="mt-3">
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
  // BigRevealCard text is white; cream/yellow moods would wash it out, so use strong bgs.
  const revealMood = card.mood === "cream" ? "purple" : card.mood === "yellow" ? "dark" : card.mood;
  const cardNumber = Math.min(pos + 1, cards.length);
  const atGate = !realReady && !app.signedUp && pos >= 2 && pos < cards.length;
  const atEnd = pos >= cards.length - 1;
  return (
    <Phone mood={revealMood}>
      <BigRevealCard card={card} />
      <BottomSheet>
        <div className="flex gap-1">
          {cards.map((_, i) => (
            <div key={i} className={cx("h-2 flex-1 rounded-full", i <= pos ? "bg-[#ff4f9a]" : "bg-black/10")} />
          ))}
        </div>
        <div className="mt-5 rounded-[26px] bg-[#f4f1fa] p-4">
          <p className="text-xs font-black uppercase tracking-widest text-black/35">
            {realReady ? "live reveal" : "reveal sequence"}
          </p>
          <p className="mt-2 text-sm font-black">
            Card {cardNumber} of {cards.length} ·{" "}
            {realReady ? "from your group's real answers" : "auto-advancing Wrapped-style moment"}
          </p>
          <p className="mt-1 truncate text-xs font-bold text-black/45">{shareUrl(app.activeGroupId)}</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button tone="lime" icon={Download} onClick={() => showToast("Screenshot to save & share")}>
            Save
          </Button>
          <Button
            tone="white"
            icon={Share2}
            onClick={() => shareOrCopy({ text: card.shareText || card.headline, url: shareUrl(app.activeGroupId) })}
          >
            Share
          </Button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Button tone="dark" icon={ChevronLeft} onClick={() => setPos(Math.max(0, pos - 1))}>
            Prev
          </Button>
          {atGate ? (
            <Button onClick={goSignup} tone="pink" icon={Lock}>
              Unlock 7 more
            </Button>
          ) : atEnd ? (
            <Button onClick={() => go("Share")} tone="primary">
              Finish
            </Button>
          ) : (
            <Button onClick={() => setPos(pos + 1)} tone="primary">
              Next card
            </Button>
          )}
        </div>
      </BottomSheet>
    </Phone>
  );
}
