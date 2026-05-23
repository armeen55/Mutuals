import AbstractBg from "../ui/AbstractBg";

export default function TwoColHero({ title, body, card }) {
  return (
    <div className="mt-8 grid grid-cols-[1fr_320px] gap-6">
      <div className="relative min-h-[360px] overflow-hidden rounded-[36px] bg-[#fff2df] p-8">
        <AbstractBg mood="cream" />
        <div className="relative z-10 max-w-md">
          <p className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
            async group chat test
          </p>
          <h2 className="mt-12 text-7xl font-black leading-[0.82] tracking-tighter">{title}</h2>
          <p className="mt-5 text-lg font-bold leading-7 text-black/60">{body}</p>
        </div>
      </div>
      <div className="rounded-[36px] bg-[#6b2cff] p-6 text-white">
        <p className="text-xs font-black uppercase tracking-widest text-white/55">sample card</p>
        <p className="mt-5 text-5xl font-black leading-none">{card}</p>
        <p className="mt-4 text-sm font-bold text-white/65">One card is a post. Ten cards is a reveal moment.</p>
      </div>
    </div>
  );
}
