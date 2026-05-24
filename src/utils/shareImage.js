// Dependency-free share-card image generation via <canvas>. Produces 1080x1920
// PNGs from reveal-card / map data. All callers wrap usage in try/catch and fall
// back to native text share, so a canvas failure never breaks the flow.

const W = 1080;
const H = 1920;
const NAVY = "#17112b";
const CARD_PALETTE = ["#FF4F9A", "#35C58A", "#7B3CFF", "#6B2CFF"];
const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

function origin() {
  try {
    return window.location.host || "mutuals-dun.vercel.app";
  } catch {
    return "mutuals-dun.vercel.app";
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapLines(ctx, text, maxWidth) {
  const words = String(text == null ? "" : text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Draw wrapped text, return the y after the last line.
function drawWrapped(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const lines = wrapLines(ctx, text, maxWidth);
  const shown = maxLines ? lines.slice(0, maxLines) : lines;
  shown.forEach((ln, i) => ctx.fillText(ln, x, y + i * lineHeight));
  return y + shown.length * lineHeight;
}

function confetti(ctx) {
  const blobs = [
    { x: 980, y: 150, r: 170, c: "#ffd23f", a: 0.95 },
    { x: 90, y: 110, r: 120, c: "#7c2cff", a: 0.5 },
    { x: 40, y: 1150, r: 150, c: "#ff4f9a", a: 0.85 },
    { x: 1030, y: 1780, r: 170, c: "#35c58a", a: 0.9 },
    { x: 80, y: 1880, r: 130, c: "#7c2cff", a: 0.45 },
  ];
  blobs.forEach((b) => {
    ctx.globalAlpha = b.a;
    ctx.fillStyle = b.c;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#ffffff";
  const dots = [
    [150, 250],
    [180, 290],
    [210, 250],
    [900, 1500],
    [940, 1540],
    [980, 1500],
  ];
  dots.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function header(ctx) {
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = `900 60px ${FONT}`;
  ctx.fillText("MUTUALS", W / 2, 150);
}

function footer(ctx) {
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.textAlign = "center";
  ctx.font = `800 34px ${FONT}`;
  ctx.fillText(`Find out who knows who · ${origin()}`, W / 2, H - 90);
}

function toBlob(canvas) {
  return new Promise((resolve) => {
    if (canvas.toBlob) canvas.toBlob((b) => resolve(b), "image/png");
    else resolve(null);
  });
}

function baseCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, W, H);
  confetti(ctx);
  header(ctx);
  return { canvas, ctx };
}

// ---- Reveal card image ----
export async function createRevealShareImage(card, { index = 0 } = {}) {
  const { canvas, ctx } = baseCanvas();
  const bg = CARD_PALETTE[index % CARD_PALETTE.length];
  const cx = 90;
  const cy = 300;
  const cw = W - 180;
  const ch = 1360;
  const pad = 70;
  const innerW = cw - pad * 2;

  ctx.fillStyle = bg;
  roundRect(ctx, cx, cy, cw, ch, 56);
  ctx.fill();

  // label badge
  ctx.textAlign = "left";
  ctx.font = `900 30px ${FONT}`;
  const label = String(card.label || "RESULT").toUpperCase();
  const lw = ctx.measureText(label).width + 56;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, cx + pad, cy + pad, lw, 60, 30);
  ctx.fill();
  ctx.fillStyle = bg;
  ctx.fillText(label, cx + pad + 28, cy + pad + 40);

  // MUTUALS mark on card
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.textAlign = "right";
  ctx.font = `900 32px ${FONT}`;
  ctx.fillText("MUTUALS", cx + cw - pad, cy + pad + 40);

  ctx.textAlign = "left";
  let y = cy + pad + 180;

  if (card.receipts) {
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 72px ${FONT}`;
    y = drawWrapped(ctx, card.headline, cx + pad, y, innerW, 78, 2) + 30;
    const block = (lbl, val, highlight) => {
      const lines = wrapLines(ctx, val, innerW - 60);
      const bh = 70 + Math.min(lines.length, 3) * 54 + 30;
      ctx.fillStyle = highlight ? "#FFD23F" : "rgba(255,255,255,0.16)";
      roundRect(ctx, cx + pad, y, innerW, bh, 28);
      ctx.fill();
      ctx.fillStyle = highlight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.6)";
      ctx.font = `900 26px ${FONT}`;
      ctx.fillText(String(lbl).toUpperCase(), cx + pad + 36, y + 50);
      ctx.fillStyle = highlight ? "#000000" : "#ffffff";
      ctx.font = `900 44px ${FONT}`;
      drawWrapped(ctx, val, cx + pad + 36, y + 104, innerW - 72, 54, 3);
      y += bh + 24;
    };
    block("Question", card.receipts.question);
    block(card.receipts.guessedLabel, card.receipts.guessed);
    block("Real answer", card.receipts.real, true);
  } else {
    ctx.fillStyle = "#ffffff";
    const stat = String(card.stat || "");
    let statSize = 240;
    ctx.font = `900 ${statSize}px ${FONT}`;
    while (ctx.measureText(stat).width > innerW && statSize > 84) {
      statSize -= 12;
      ctx.font = `900 ${statSize}px ${FONT}`;
    }
    ctx.fillText(stat, cx + pad, y + statSize * 0.5);
    y += statSize * 0.8 + 34;
    ctx.font = `900 84px ${FONT}`;
    y = drawWrapped(ctx, card.headline, cx + pad, y, innerW, 90, 3) + 30;
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.font = `700 46px ${FONT}`;
    drawWrapped(ctx, card.detail, cx + pad, y, innerW, 58, 4);
  }

  // card watermark
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = `900 28px ${FONT}`;
  ctx.fillText("FIND OUT WHO KNOWS WHO", cx + pad, cy + ch - 50);

  footer(ctx);
  return toBlob(canvas);
}

// ---- Map image (friendly cream, matches Home/Create) ----
export async function createMapShareImage(graph, _opts = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFF3DF";
  ctx.fillRect(0, 0, W, H);
  confetti(ctx);

  ctx.fillStyle = "#17112B";
  ctx.textAlign = "center";
  ctx.font = `900 60px ${FONT}`;
  ctx.fillText("MUTUALS", W / 2, 150);

  const cx = 80;
  const cy = 280;
  const cw = W - 160;
  const ch = 1390;
  const pad = 60;
  const innerW = cw - pad * 2;

  // white content card on cream
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, cx, cy, cw, ch, 56);
  ctx.fill();

  ctx.textAlign = "left";
  ctx.fillStyle = "#7B3CFF";
  ctx.font = `900 30px ${FONT}`;
  ctx.fillText("THE GROUP-CHAT MAP", cx + pad, cy + pad + 30);
  ctx.fillStyle = "#17112B";
  ctx.font = `900 90px ${FONT}`;
  ctx.fillText("Who knows", cx + pad, cy + pad + 150);
  ctx.fillText("who?", cx + pad, cy + pad + 240);

  let y = cy + pad + 350;
  const best = graph && graph.best;
  if (best) {
    ctx.fillStyle = "#FFD23F";
    roundRect(ctx, cx + pad, y, innerW, 180, 28);
    ctx.fill();
    ctx.fillStyle = "rgba(23,17,43,0.5)";
    ctx.font = `900 26px ${FONT}`;
    ctx.fillText("STRONGEST MUTUAL PAIR", cx + pad + 36, y + 50);
    ctx.fillStyle = "#17112B";
    ctx.font = `900 56px ${FONT}`;
    ctx.fillText(`${best.aName} ↔ ${best.bName}`, cx + pad + 36, y + 118);
    ctx.font = `800 36px ${FONT}`;
    ctx.fillText(`${Math.round(best.mutual * 100)}% mutual`, cx + pad + 36, y + 162);
    y += 222;
  }

  ctx.fillStyle = "rgba(23,17,43,0.45)";
  ctx.font = `900 28px ${FONT}`;
  ctx.fillText("WHO READS WHO", cx + pad, y + 20);
  y += 60;

  const edges = (graph && graph.edges ? graph.edges : []).slice(0, 5);
  edges.forEach((e) => {
    ctx.fillStyle = "#F3EFFF";
    roundRect(ctx, cx + pad, y, innerW, 96, 22);
    ctx.fill();
    const barW = innerW * Math.max(0.08, e.acc);
    ctx.fillStyle = "rgba(107,44,255,0.2)";
    roundRect(ctx, cx + pad, y, Math.max(70, barW), 96, 22);
    ctx.fill();
    ctx.fillStyle = "#17112B";
    ctx.font = `900 42px ${FONT}`;
    ctx.fillText(`${e.fromName}  →  ${e.toName}`, cx + pad + 32, y + 60);
    ctx.textAlign = "right";
    ctx.fillText(`${Math.round(e.acc * 100)}%`, cx + cw - pad - 32, y + 60);
    ctx.textAlign = "left";
    y += 116;
  });

  if (!edges.length) {
    ctx.fillStyle = "rgba(23,17,43,0.55)";
    ctx.font = `800 40px ${FONT}`;
    ctx.fillText("Not enough guesses yet.", cx + pad, y + 40);
    ctx.fillText("Run it back with more people.", cx + pad, y + 95);
  }

  ctx.fillStyle = "rgba(23,17,43,0.55)";
  ctx.textAlign = "center";
  ctx.font = `800 34px ${FONT}`;
  ctx.fillText(`Who knows who? · ${origin()}`, W / 2, H - 80);

  return toBlob(canvas);
}

// ---- Share / fallback ----
export async function shareImageBlob({ blob, text = "", url = "", fileName = "mutuals.png" }) {
  if (blob && typeof File !== "undefined") {
    const file = new File([blob], fileName, { type: "image/png" });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text, url: url || undefined });
        return "shared";
      }
    } catch (e) {
      if (e && e.name === "AbortError") return "shared";
    }
    try {
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 5000);
      return "downloaded";
    } catch {
      // fall through to link copy
    }
  }
  try {
    await navigator.clipboard?.writeText([text, url].filter(Boolean).join(" "));
  } catch {
    // ignore
  }
  return "copied";
}
