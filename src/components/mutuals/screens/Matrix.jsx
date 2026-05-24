import { useState, useEffect } from "react";
import { Share2, RotateCcw, ArrowRight } from "lucide-react";
import Phone from "../ui/Phone";
import Button from "../ui/Button";
import { useMutuals } from "../useMutuals";
import { getInsights, captureGroup } from "../../../lib/mutualsApi";
import { pairScores } from "../../../lib/insights";
import { shareUrl, saveMutualsState, newRoomId, ensureGroup } from "../../../utils/mutualsStorage";
import { shareOrCopy, showToast } from "../../../utils/ui";
import { track } from "../../../utils/analytics";
import { createMapShareImage, createRevealShareImage, shareImageBlob } from "../../../utils/shareImage";

const pct = (x) => Math.round(x * 100);
const pairKey = (a, b) => [a, b].sort().join(":");

// Friendly node graph on a light card: ink/violet nodes, score-weighted lines,
// best mutual pair highlighted.
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
    <svg viewBox="0 0 100 100" className="mx-auto block w-full max-w-[230px]">
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
            stroke={isBest ? "#FF4F9A" : "#6B2CFF"}
            strokeOpacity={isBest ? 0.95 : 0.2 + e.acc * 0.5}
            strokeWidth={isBest ? 1.8 : 0.5 + e.acc * 1.3}
            strokeLinecap="round"
          />
        );
      })}
      {nodes.map((p) => {
        const isBest = best && (p.id === best.a || p.id === best.b);
        return (
          <g key={p.id}>
            <circle cx={p.x} cy={p.y} r="7.5" fill={isBest ? "#FFD23F" : "#6B2CFF"} stroke="#fff" strokeWidth="0.9" />
            <text x={p.x} y={p.y + 1.6} textAnchor="middle" fontSize="6" fontWeight="900" fill={isBest ? "#17112B" : "#fff"}>
              {(p.name || "?").trim().slice(0, 1).toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Row({ label, headline, stat, accent = "#FFD23F" }) {
  if (!headline) return null;
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-black/40">{label}</p>
        <p className="mt-0.5 break-words text-base font-black leading-tight text-[#17112B]">{headline}</p>
      </div>
      {stat && (
        <span className="shrink-0 rounded-full px-3 py-1 text-sm font-black text-[#17112B]" style={{ background: accent }}>
          {stat}
        </span>
      )}
    </div>
  );
}

export default function Matrix({ next, go }) {
  const app = useMutuals();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (app.soloDemo || !app.activeGroupId) return;
    getInsights(app.activeGroupId).then(setData).catch(() => {});
  }, [app.activeGroupId, app.soloDemo]);

  const mode = data?.bundle?.group?.mode || app.groupMode || "duo";
  const isDuo = mode === "duo";
  const cards = data?.cards || [];
  const byId = (id) => cards.find((c) => c.id === id);
  const heroCard = byId("receipts") || byId("winner") || byId("final") || cards[0] || null;

  const graph = data ? pairScores(data.bundle) : null;
  const players = graph?.players || [];
  const topReads = (graph?.edges || []).slice(0, 5);
  const best = graph?.best || null;
  const roomUrl = shareUrl(app.activeGroupId);

  const runItBack = () => {
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
    track("rematch_clicked", { mode, from: "matrix" });
    showToast(isDuo ? "New 1:1 room ready" : "New group room ready");
    go ? go("Create") : next();
  };

  const shareVerdict = async () => {
    track("share_image_clicked", { from: "matrix", mode });
    try {
      if (!heroCard) throw new Error("no card");
      const blob = await createRevealShareImage(heroCard, { index: 0 });
      const res = await shareImageBlob({
        blob,
        text: heroCard.shareText || heroCard.headline,
        url: roomUrl,
        fileName: "mutuals-verdict.png",
      });
      showToast(res === "downloaded" ? "Image saved" : res === "copied" ? "Link copied" : "Shared");
    } catch {
      shareOrCopy({ text: heroCard ? heroCard.headline : "Our MUTUALS verdict:", url: roomUrl });
    }
  };

  const shareMap = async () => {
    track("share_image_clicked", { from: "matrix", mode });
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

  return (
    <Phone mood={isDuo ? "lavender" : "cream"}>
      <div
        className="relative z-10 flex h-[100dvh] flex-col px-[var(--screen-pad-x)] text-[#17112B]"
        style={{
          paddingTop: "clamp(18px, 5svh, 44px)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + clamp(14px, 3svh, 26px))",
        }}
      >
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-black/45">
            {isDuo ? "the 1:1 verdict" : "the group-chat map"}
          </p>
          <h2 className="mt-2 font-black leading-[0.95] tracking-tighter text-[clamp(1.9rem,8vw,2.75rem)] short:text-[clamp(1.6rem,7vw,2.1rem)]">
            {isDuo ? "The verdict is in." : "Who knows who?"}
          </h2>
        </div>

        <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-1">
          {isDuo ? (
            cards.length ? (
              <>
                <Row label="Winner" headline={byId("winner")?.headline} stat={byId("winner")?.stat} accent="#FFD23F" />
                <Row label="Mutual score" headline={byId("mutual")?.headline} stat={byId("mutual")?.stat} accent="#7CDFFF" />
                <Row label="Biggest miss" headline={byId("receipts")?.headline} accent="#FF4F9A" />
                <Row label="Best read" headline={byId("bestread")?.headline} stat={byId("bestread")?.stat} accent="#35C58A" />
                {byId("final") && (
                  <div className="rounded-2xl bg-[#7B3CFF] p-4 text-white shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Final verdict</p>
                    <p className="mt-0.5 break-words text-lg font-black leading-tight">{byId("final").headline}</p>
                  </div>
                )}
                {!byId("winner") && !byId("mutual") && (
                  <p className="px-1 text-sm font-bold text-black/50">Not enough guesses yet. Run it back.</p>
                )}
              </>
            ) : (
              <p className="py-6 text-center text-sm font-bold text-black/50">Tallying the verdict…</p>
            )
          ) : (
            <>
              <p className="text-center text-sm font-bold text-black/55">The group-chat map.</p>
              {players.length ? (
                <div className="rounded-[28px] bg-white p-4 shadow-sm">
                  <Graph players={players} edges={graph?.edges || []} best={best} />
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {players.map((p) => {
                      const isBest = best && (p.id === best.a || p.id === best.b);
                      return (
                        <span
                          key={p.id}
                          className={
                            isBest
                              ? "rounded-full bg-[#FFD23F] px-3 py-1 text-xs font-black text-[#17112B]"
                              : "rounded-full bg-[#F3EFFF] px-3 py-1 text-xs font-black text-[#17112B]"
                          }
                        >
                          {p.displayName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="py-6 text-center text-sm font-bold text-black/50">Loading the room…</p>
              )}

              {best && (
                <div className="rounded-[24px] bg-[#FFD23F] p-4 text-[#17112B] shadow-sm">
                  <p className="text-[11px] font-black uppercase tracking-widest text-black/40">strongest mutual pair</p>
                  <p className="mt-1 break-words text-2xl font-black leading-tight">
                    {best.aName} ↔ {best.bName}
                  </p>
                  <p className="text-sm font-bold text-black/60">{pct(best.mutual)}% mutual. Suspiciously in sync.</p>
                </div>
              )}

              {topReads.length > 0 && (
                <div>
                  <p className="px-1 text-xs font-black uppercase tracking-widest text-black/45">who reads who</p>
                  <div className="mt-2 space-y-2">
                    {topReads.map((e, i) => {
                      const isBest = best && pairKey(e.from, e.to) === pairKey(best.a, best.b);
                      return (
                        <div key={i} className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
                          <div
                            className={isBest ? "absolute inset-y-0 left-0 bg-[#FFD23F]/40" : "absolute inset-y-0 left-0 bg-[#6B2CFF]/15"}
                            style={{ width: `${Math.max(12, pct(e.acc))}%` }}
                          />
                          <div className="relative flex items-center justify-between gap-2 p-3">
                            <p className="break-words text-sm font-black text-[#17112B]">
                              {e.fromName} <span className="text-black/40">→</span> {e.toName}
                            </p>
                            <span className="shrink-0 rounded-full bg-[#17112B] px-2.5 py-1 text-xs font-black text-white">{pct(e.acc)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {players.length > 0 && topReads.length === 0 && (
                <p className="px-1 text-sm font-bold text-black/55">
                  Not enough guesses to draw the map yet. Run it back with more people.
                </p>
              )}
            </>
          )}
        </div>

        <div className="mt-3">
          <Button tone="pink" icon={Share2} onClick={isDuo ? shareVerdict : shareMap}>
            {isDuo ? "Share the verdict" : "Share the map"}
          </Button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button tone="lime" icon={RotateCcw} onClick={runItBack}>
            Run it back
          </Button>
          <Button tone="primary" icon={ArrowRight} onClick={next}>
            Continue
          </Button>
        </div>
      </div>
    </Phone>
  );
}
