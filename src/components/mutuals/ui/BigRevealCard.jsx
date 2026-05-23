export default function BigRevealCard({ card }) {
  const Icon = card.icon;
  return (
    <div className="relative z-10 px-5 pt-12 text-white">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black">
          {card.label}
        </span>
        <span className="text-sm font-black">MUTUALS.APP</span>
      </div>
      <div className="mt-8 grid h-24 w-24 place-items-center rounded-[30px] bg-white text-black shadow-xl">
        <Icon className="h-11 w-11" />
      </div>
      <p className="mt-8 text-[78px] font-black leading-none tracking-tighter" style={{ color: card.accent }}>
        {card.stat}
      </p>
      <h2 className="mt-3 text-4xl font-black leading-[0.9] tracking-tight">{card.headline}</h2>
      <p className="mt-3 text-sm font-bold leading-5 text-white/75">{card.detail}</p>
    </div>
  );
}
