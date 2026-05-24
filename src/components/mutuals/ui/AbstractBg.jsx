// Friendly, corner-framed decorations: organic blobs tucked into the edges,
// a few dots and a squiggle. Kept out of the vertical center so headlines and
// buttons stay clean. Pure CSS/SVG — no imported images.
export default function AbstractBg({ mood = "purple" }) {
  const palettes = {
    purple: ["#ffd23f", "#ff4f9a", "#35c58a", "#ffffff"], // yellow, pink, teal, white
    dark: ["#ffd23f", "#ff4f9a", "#35c58a", "#7c2cff"], // yellow, pink, teal, purple
    cream: ["#ffd23f", "#ff7b8a", "#35c58a", "#7c2cff"],
    yellow: ["#7c2cff", "#ff4f9a", "#35c58a", "#ff765e"], // purple, pink, teal, orange
  };
  const [yellow, pink, teal, accent] = palettes[mood] || palettes.purple;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* yellow blob — top-right corner */}
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-[42%]" style={{ background: yellow, opacity: 0.92 }} />
      {/* accent blob — top-left, mostly off-screen */}
      <div className="absolute -left-12 -top-12 h-32 w-32 rounded-[46%]" style={{ background: accent, opacity: 0.5 }} />
      {/* pink blob — left edge, lower half */}
      <div className="absolute -left-12 top-[60%] h-40 w-28 rounded-[55%]" style={{ background: pink, opacity: 0.8 }} />
      {/* teal blob — bottom-right corner */}
      <div className="absolute -bottom-10 -right-8 h-40 w-40 rounded-[44%]" style={{ background: teal, opacity: 0.85 }} />
      {/* accent blob — bottom-left, soft */}
      <div className="absolute -bottom-12 -left-8 h-32 w-36 rounded-[50%]" style={{ background: accent, opacity: 0.42 }} />

      {/* dots — upper left */}
      <div className="absolute left-6 top-[13%] grid grid-cols-3 gap-2 opacity-50">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-white" />
        ))}
      </div>
      {/* dots — lower right */}
      <div className="absolute bottom-[18%] right-7 grid grid-cols-4 gap-1.5 opacity-30">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-white" />
        ))}
      </div>

      {/* squiggle — upper right */}
      <svg className="absolute right-12 top-[11%] opacity-80" width="58" height="14" viewBox="0 0 58 14" fill="none">
        <path d="M2 8 Q9 1 16 8 T30 8 T44 8 T56 6" stroke={yellow} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}
