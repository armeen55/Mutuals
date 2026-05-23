export default function BigRevealCard({ card }) {
  const Icon = card.icon;
  return (
    <div className="relative z-10 px-5 pt-12 text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black">
          {card.label}
        </span>
        <span className="shrink-0 text-sm font-black">MUTUALS.APP</span>
      </div>
      <div className="mt-7 grid h-20 w-20 place-items-center rounded-[26px] bg-white text-black shadow-xl sm:h-24 sm:w-24">
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
  );
}
