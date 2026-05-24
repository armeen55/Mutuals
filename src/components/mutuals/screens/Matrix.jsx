import { useState, useEffect } from "react";
import { Share2, ArrowRight } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Button from "../ui/Button";
import { useMutuals } from "../useMutuals";
import { getInsights } from "../../../lib/mutualsApi";
import { pairScores } from "../../../lib/insights";
import { shareUrl } from "../../../utils/mutualsStorage";
import { shareOrCopy } from "../../../utils/ui";

const pct = (x) => Math.round(x * 100);

// The "who knows who" map — the receipts, but visual. Derived from existing
// bundle data via pairScores (no schema change).
export default function Matrix({ next }) {
  const app = useMutuals();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (app.soloDemo || !app.activeGroupId) return;
    getInsights(app.activeGroupId).then(setData).catch(() => {});
  }, [app.activeGroupId, app.soloDemo]);

  const graph = data ? pairScores(data.bundle) : null;
  const players = graph?.players || [];
  const top = (graph?.edges || []).slice(0, 5);
  const best = graph?.best || null;

  return (
    <Phone mood="dark">
      <div className="relative z-10 px-6 pt-16 text-center text-white">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-white/60">who knows who map</p>
        <h2 className="mt-3 text-5xl font-black leading-[0.9] tracking-tighter">The receipts, but visual.</h2>
      </div>
      <BottomSheet tall>
        <p className="text-xs font-black uppercase tracking-widest text-black/35">in this room</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {players.length ? (
            players.map((p) => (
              <span key={p.id} className="rounded-full bg-[#6b2cff] px-3 py-1 text-xs font-black text-white">
                {p.displayName}
              </span>
            ))
          ) : (
            <p className="text-sm font-bold text-black/45">Loading the room…</p>
          )}
        </div>

        {best && (
          <div className="mt-4 rounded-[26px] bg-[#d7ff2f] p-4 text-black">
            <p className="text-[11px] font-black uppercase tracking-widest text-black/40">best mutual pair</p>
            <p className="mt-1 break-words text-2xl font-black leading-tight">
              {best.aName} ↔ {best.bName}
            </p>
            <p className="text-sm font-bold text-black/60">{pct(best.mutual)}% mutual. Suspiciously in sync.</p>
          </div>
        )}

        <p className="mt-4 text-xs font-black uppercase tracking-widest text-black/35">who reads who</p>
        <div className="mt-2 space-y-2">
          {top.length ? (
            top.map((e, i) => (
              <div key={i} className="flex items-center justify-between gap-2 rounded-2xl bg-[#f4f1fa] p-3">
                <p className="break-words text-sm font-black">
                  {e.fromName} <span className="text-black/40">→</span> {e.toName}
                </p>
                <span className="shrink-0 rounded-full bg-black px-2.5 py-1 text-xs font-black text-white">
                  {pct(e.acc)}%
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm font-bold text-black/45">Not enough guesses yet to map the room. Run it back.</p>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button
            tone="lime"
            icon={Share2}
            onClick={() =>
              shareOrCopy({
                text: best
                  ? `${best.aName} ↔ ${best.bName} are the realest pair. Our MUTUALS map is in.`
                  : "Our MUTUALS who-knows-who map is in.",
                url: shareUrl(app.activeGroupId),
              })
            }
          >
            Share the map
          </Button>
          <Button tone="primary" icon={ArrowRight} onClick={next}>
            Continue
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
