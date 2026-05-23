export default function AbstractBg({ mood = "purple" }) {
  const palettes = {
    purple: ["#6b2cff", "#ff3366", "#ffd23f", "#7cdfff"],
    cream: ["#fff2df", "#ff7b8a", "#ffd23f", "#35c58a"],
    yellow: ["#ffbd00", "#0aa65a", "#2d5bff", "#ff765e"],
    dark: ["#130014", "#7c2cff", "#ff4f9a", "#d7ff2f"],
  };
  const [a, b, c, d] = palettes[mood] || palettes.purple;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-16 -top-12 h-44 w-44 rounded-full" style={{ background: c }} />
      <div className="absolute -right-14 top-8 h-40 w-48 rounded-[45%]" style={{ background: b }} />
      <div className="absolute bottom-[-70px] left-[-45px] h-48 w-64 rounded-full" style={{ background: d }} />
      <div className="absolute bottom-16 right-[-35px] h-36 w-36 rounded-full" style={{ background: a }} />
      <div className="absolute left-8 top-24 h-20 w-20 rounded-full border-[10px] border-white/70" />
      <div className="absolute right-14 bottom-28 h-20 w-20 rotate-45 border-[12px] border-black/20" />
      <div className="absolute left-10 bottom-36 h-1 w-24 rotate-45 rounded-full bg-black/30" />
      <div className="absolute right-32 top-24 h-1 w-24 -rotate-45 rounded-full bg-white/70" />
      <div className="absolute left-28 top-16 grid grid-cols-3 gap-2 opacity-60">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-black" />
        ))}
      </div>
      <div className="absolute bottom-20 right-20 grid grid-cols-4 gap-1 opacity-40">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-white" />
        ))}
      </div>
    </div>
  );
}
