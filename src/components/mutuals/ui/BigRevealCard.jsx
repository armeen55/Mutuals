// The shareable artifact. Designed to read as a complete composition in a
// screenshot: wordmark up top, big stat/headline, and a watermark footer.
export default function BigRevealCard({ card }) {
  const Icon = card.icon;
  const r = card.receipts;
  return (
    <div className="relative z-10 flex min-h-[54dvh] flex-col px-6 pt-14 text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black">
          {card.label}
        </span>
        <span className="shrink-0 text-sm font-black tracking-tight">MUTUALS</span>
      </div>

      {r ? (
        <div className="mt-7">
          <h2 className="break-words text-4xl font-black leading-[0.95] tracking-tight">{card.headline}</h2>
          <div className="mt-6 space-y-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Question</p>
              <p className="mt-1 break-words text-xl font-black leading-tight">{r.question}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{r.guessedLabel}</p>
              <p className="mt-1 break-words text-lg font-black">{r.guessed}</p>
            </div>
            <div className="rounded-2xl bg-[#d7ff2f] p-4 text-black">
              <p className="text-[10px] font-black uppercase tracking-widest text-black/50">Real answer</p>
              <p className="mt-1 break-words text-lg font-black">{r.real}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-7">
          <div className="grid h-20 w-20 place-items-center rounded-[26px] bg-white text-black shadow-xl sm:h-24 sm:w-24">
            <Icon className="h-10 w-10 sm:h-11 sm:w-11" />
          </div>
          <p
            className="mt-7 break-words text-6xl font-black leading-none tracking-tighter sm:text-[78px]"
            style={{ color: card.accent }}
          >
            {card.stat}
          </p>
          <h2 className="mt-3 break-words text-3xl font-black leading-[0.95] tracking-tight sm:text-4xl">{card.headline}</h2>
          <p className="mt-3 break-words text-sm font-bold leading-5 text-white/85">{card.detail}</p>
        </div>
      )}

      <p className="mt-auto pt-6 text-[11px] font-black uppercase tracking-[0.2em] text-white/45">
        mutuals.app · find out who knows who
      </p>
    </div>
  );
}
