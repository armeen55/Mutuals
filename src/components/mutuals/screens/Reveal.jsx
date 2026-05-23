import { useState, useEffect } from "react";
import { Download, Share2, ChevronLeft, Lock, Copy } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import BigRevealCard from "../ui/BigRevealCard";
import Button from "../ui/Button";
import { insightCards, REF_URL } from "../../../data/mutualsDemoData";
import { useMutuals } from "../useMutuals";
import { shareUrl } from "../../../utils/mutualsStorage";
import { getInsights } from "../../../lib/mutualsApi";
import { cx, showToast, shareOrCopy } from "../../../utils/ui";

// Seeded fallback order (skips index 3 — the "Full Report" gate card).
const SEEDED = [0, 1, 2, 4, 5, 6, 7, 8, 9].map((i) => insightCards[i]);

export default function Reveal({ next, go, goSignup }) {
  const app = useMutuals();
  const [real, setReal] = useState(null); // { readiness, cards }
  const [loading, setLoading] = useState(!app.soloDemo);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    if (!app.revealUnlocked && !app.soloDemo) go("Answer");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = () => {
    if (app.soloDemo || !app.activeGroupId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getInsights(app.activeGroupId)
      .then((r) => setReal(r))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.activeGroupId, app.soloDemo]);

  // Real group still computing / loading.
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

  const realReady = !app.soloDemo && real && real.readiness?.unlocked && real.cards?.length > 0;

  // Real group, not enough finished → locked / waiting state.
  if (!app.soloDemo && app.activeGroupId && real && !realReady) {
    const r = real.readiness || { completedCount: 0, required: 3 };
    const participants = real.bundle?.participants || [];
    const need = Math.max(0, r.required - r.completedCount);
    return (
      <Phone mood="purple">
        <div className="relative z-10 px-6 pt-24 text-center text-white">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-white/70">reveal locked</p>
          <h2 className="mt-4 text-5xl font-black leading-none tracking-tighter">
            {need > 0 ? `Need ${need} more to finish.` : "Unlocking…"}
          </h2>
          <p className="mx-auto mt-4 max-w-[265px] text-sm font-bold text-white/75">
            {r.completedCount}/{r.required} done. The reveal drops once everyone answers and guesses.
          </p>
        </div>
        <BottomSheet>
          <div className="rounded-[26px] bg-[#f4f1fa] p-4 text-black">
            <p className="text-xs font-black uppercase tracking-widest text-black/35">joined ({participants.length})</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {participants.map((p) => (
                <span key={p.id} className="rounded-full bg-[#6b2cff] px-3 py-1 text-xs font-black text-white">
                  {p.displayName}
                </span>
              ))}
            </div>
          </div>
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
            <Button tone="dark" onClick={refresh}>
              Check again
            </Button>
          </div>
        </BottomSheet>
      </Phone>
    );
  }

  const cards = realReady ? real.cards : SEEDED;
  const card = cards[Math.min(pos, cards.length - 1)];
  const cardNumber = Math.min(pos + 1, cards.length);
  const atGate = !realReady && !app.signedUp && pos >= 2 && pos < cards.length;
  const atEnd = pos >= cards.length - 1;
  return (
    <Phone mood={card.mood}>
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
          <p className="mt-1 truncate text-xs font-bold text-black/45">{REF_URL}</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button tone="lime" icon={Download} onClick={() => showToast("Screenshot to save & share")}>
            Save
          </Button>
          <Button
            tone="white"
            icon={Share2}
            onClick={() =>
              shareOrCopy({ text: `${card.headline} See who actually knows who:`, url: shareUrl(app.activeGroupId) })
            }
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
