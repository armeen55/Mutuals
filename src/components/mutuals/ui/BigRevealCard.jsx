// A self-contained, screenshot-worthy result card: a vivid rounded card on the
// dark reveal background (mirrors the canvas share image). Cycles color by index.
const PALETTE = ["#FF4F9A", "#35C58A", "#7B3CFF", "#6B2CFF"];

function Block({ label, value, highlight }) {
  return (
    <div className={highlight ? "rounded-2xl bg-[#FFD23F] p-3.5 short:p-3 text-black" : "rounded-2xl bg-white/15 p-3.5 short:p-3"}>
      <p className={highlight ? "text-[10px] font-black uppercase tracking-widest text-black/50" : "text-[10px] font-black uppercase tracking-widest text-white/55"}>
        {label}
      </p>
      <p className="mt-1 break-words text-base font-black leading-tight">{value}</p>
    </div>
  );
}

export default function BigRevealCard({ card, index = 0 }) {
  const bg = PALETTE[index % PALETTE.length];
  const r = card.receipts;
  const npr = card.namePickReceipt;
  return (
    <div
      className="relative mx-auto w-full max-w-[400px] overflow-hidden rounded-[32px] text-white shadow-2xl"
      style={{ background: bg, padding: "clamp(20px, 5vw, 30px)" }}
    >
      {/* in-card confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-90">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-[42%] bg-white/15" />
        <div className="absolute -bottom-10 -left-8 h-28 w-28 rounded-[46%] bg-black/10" />
        <div className="absolute right-6 top-1/2 h-3 w-3 rounded-full bg-white/40" />
        <div className="absolute left-8 top-10 h-2.5 w-2.5 rounded-full bg-white/40" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest" style={{ color: bg }}>
            {card.label}
          </span>
          <span className="shrink-0 text-sm font-black">MUTUALS</span>
        </div>

        {npr ? (
          <div className="mt-5 short:mt-3">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55">{npr.optionLabel || "GROUP VOTE"}</p>
            <h2 className="mt-2 break-words text-4xl font-black leading-[0.95] tracking-tight short:text-3xl">{card.headline}</h2>
            <p className="mt-3 break-words font-black leading-none tracking-tighter text-[clamp(2.8rem,15vw,4.6rem)] short:text-[clamp(2.2rem,12vw,3.4rem)]">
              {card.stat}
            </p>
            <p className="mt-3 break-words text-sm font-bold leading-snug text-white/85">{npr.prompt}</p>
            {npr.voters && npr.voters.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {npr.voters.map((v, i) => (
                  <span key={v + ":" + i} className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-black">
                    {v}
                  </span>
                ))}
              </div>
            ) : null}
            {card.detail ? <p className="mt-3 break-words text-sm font-bold leading-5 text-white/80 short:hidden">{card.detail}</p> : null}
          </div>
        ) : r ? (
          <div className="mt-5 short:mt-3">
            <h2 className="break-words text-3xl font-black leading-[0.95] tracking-tight short:text-2xl">{card.headline}</h2>
            <div className="mt-4 space-y-2.5 short:mt-3 short:space-y-2">
              <Block label="Question" value={r.question} />
              <Block label={r.guessedLabel} value={r.guessed} />
              <Block label="Real answer" value={r.real} highlight />
            </div>
          </div>
        ) : (
          <div className="mt-5 short:mt-3">
            <p className="break-words font-black leading-none tracking-tighter text-[clamp(4rem,20vw,6rem)] short:text-[clamp(2.8rem,14vw,4rem)]">
              {card.stat}
            </p>
            <h2 className="mt-3 break-words text-3xl font-black leading-[0.95] tracking-tight short:mt-2 short:text-2xl">{card.headline}</h2>
            <p className="mt-3 break-words text-sm font-bold leading-5 text-white/85 short:mt-2">{card.detail}</p>
          </div>
        )}

        <p className="mt-6 text-[11px] font-black uppercase tracking-[0.2em] text-white/55 short:mt-3">find out who knows who</p>
      </div>
    </div>
  );
}
