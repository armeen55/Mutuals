import { useState, useEffect } from "react";
import { Share2, Link2, ArrowRight } from "lucide-react";
import Phone from "../ui/Phone";
import ShareActionTile from "../ui/ShareActionTile";
import Button from "../ui/Button";
import { useMutuals } from "../useMutuals";
import { getInsights } from "../../../lib/mutualsApi";
import { pairScores } from "../../../lib/insights";
import { shareUrl } from "../../../utils/mutualsStorage";
import { shareOrCopy, showToast } from "../../../utils/ui";
import { createMapShareImage, shareImageBlob } from "../../../utils/shareImage";

const pct = (x) => Math.round(x * 100);
const pairKey = (a, b) => [a, b].sort().join(":");

// Circular node graph: nodes around a ring, top edges as lines (weight = score),
// best mutual pair highlighted in lime.
function Graph({ players, edges, best }) {
  const n = players.length;
  if (!n) return null;
  const ring = n <= 2 ? 30 : 38;
  const nodes = players.map((p, i) => {
    const ang = (-90 + (360 / n) * i) * (Math.PI / 180);
    return { id: p.id, name: p.displayName, x: 50 + ring * Math.cos(ang), y: 50 + ring * Math.sin(ang) };
  });
  const byId = Object.fromEntries(nodes.map((p) => [p.id, p]));
  const bestK = best ? pairKey(best.a, best.b) : null;
  const top = edges.slice(0, 6);
  return (
    <svg viewBox="0 0 100 100" className="mx-auto block w-full max-w-[240px]">
      {top.map((e, i) => {
        const a = byId[e.from];
        const b = byId[e.to];
        if (!a || !b) return null;
        const isBest = bestK && pairKey(e.from, e.to) === bestK;
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={isBest ? "#FFD23F" : "#ffffff"}
            strokeOpacity={isBest ? 0.95 : 0.15 + e.acc * 0.5}
            strokeWidth={isBest ? 1.8 : 0.5 + e.acc * 1.3}
            strokeLinecap="round"
          />
        );
      })}
      {nodes.map((p) => {
        const isBest = best && (p.id === best.a || p.id === best.b);
        return (
          <g key={p.id}>
            <circle cx={p.x} cy={p.y} r="7.5" fill={isBest ? "#FFD23F" : "#6b2cff"} stroke="#fff" strokeWidth="0.9" />
            <text x={p.x} y={p.y + 1.6} textAnchor="middle" fontSize="6" fontWeight="900" fill={isBest ? "#000" : "#fff"}>
              {(p.name || "?").trim().slice(0, 1).toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

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
  const roomUrl = shareUrl(app.activeGroupId);
  const bestK = best ? pairKey(best.a, best.b) : null;

  const shareMap = async () => {
    try {
      const blob = await createMapShareImage(graph || {}, { roomUrl });
      const res = await shareImageBlob({
        blob,
        text: best ? `${best.aName} ↔ ${best.bName} are the realest pair. Our MUTUALS map:` : "Our MUTUALS who-knows-who map:",
        url: roomUrl,
        fileName: "mutuals-map.png",
      });
      showToast(res === "downloaded" ? "Image saved" : res === "copied" ? "Link copied" : "Shared");
    } catch {
      shareOrCopy({ text: "Our MUTUALS who-knows-who map:", url: roomUrl });
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
          paddingTop: "clamp(18px, 5svh, 44px)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + clamp(14px, 3svh, 26px))",
        }}
      >
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-white/60">who knows who map</p>
          <h2 className="mt-2 font-black leading-[0.95] tracking-tighter" style={{ fontSize: "clamp(1.9rem, 8vw, 2.75rem)" }}>
            The receipts, but visual.
          </h2>
        </div>

        <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-1">
          <div className="rounded-[28px] bg-[#1f1736] p-4">
            {players.length ? (
              <>
                <Graph players={players} edges={graph?.edges || []} best={best} />
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {players.map((p) => {
                    const isBest = best && (p.id === best.a || p.id === best.b);
                    return (
                      <span
                        key={p.id}
                        className={
                          isBest
                            ? "rounded-full bg-[#FFD23F] px-3 py-1 text-xs font-black text-black"
                            : "rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white"
                        }
                      >
                        {p.displayName}
                      </span>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="py-6 text-center text-sm font-bold text-white/55">Loading the room…</p>
            )}
          </div>

          {best && (
            <div className="rounded-[24px] bg-[#FFD23F] p-4 text-black">
              <p className="text-[11px] font-black uppercase tracking-widest text-black/40">best mutual pair</p>
              <p className="mt-1 break-words text-2xl font-black leading-tight">
                {best.aName} ↔ {best.bName}
              </p>
              <p className="text-sm font-bold text-black/60">{pct(best.mutual)}% mutual. Suspiciously in sync.</p>
            </div>
          )}

          {top.length > 0 && (
            <div>
              <p className="px-1 text-xs font-black uppercase tracking-widest text-white/55">who reads who</p>
              <div className="mt-2 space-y-2">
                {top.map((e, i) => {
                  const isBest = bestK && pairKey(e.from, e.to) === bestK;
                  return (
                    <div key={i} className="relative overflow-hidden rounded-2xl bg-white/10">
                      <div
                        className={isBest ? "absolute inset-y-0 left-0 bg-[#FFD23F]/25" : "absolute inset-y-0 left-0 bg-[#6b2cff]/45"}
                        style={{ width: `${Math.max(12, pct(e.acc))}%` }}
                      />
                      <div className="relative flex items-center justify-between gap-2 p-3">
                        <p className="break-words text-sm font-black">
                          {e.fromName} <span className="text-white/40">→</span> {e.toName}
                        </p>
                        <span className="shrink-0 rounded-full bg-black px-2.5 py-1 text-xs font-black text-white">{pct(e.acc)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {players.length > 0 && top.length === 0 && (
            <p className="px-1 text-sm font-bold text-white/55">Not enough guesses yet to map the room. Run it back.</p>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <ShareActionTile icon={Share2} label="Share Map" onClick={shareMap} tone="primary" />
          <ShareActionTile icon={Link2} label="Copy Link" onClick={copyLink} />
        </div>
        <div className="mt-3">
          <Button tone="primary" icon={ArrowRight} onClick={next}>
            Continue
          </Button>
        </div>
      </div>
    </Phone>
  );
}
