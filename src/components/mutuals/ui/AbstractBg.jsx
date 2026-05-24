// Friendly, corner-framed decorations: warm organic blobs tucked into the edges,
// a few dots and a squiggle. `quiet` (Home/Create) pushes the lower blobs further
// into the corners, softens them, and drops the lower-right dot cluster so nothing
// competes with the CTA stack. Dot color adapts to light vs dark moods.
const LIGHT = ["cream", "pageCream", "lavender", "yellow", "sky", "mint"];

const PALETTES = {
  // [blob1, blob2, blob3, accent]  — accent is intentionally not heavy purple
  cream: ["#FFD23F", "#FF4F9A", "#35C58A", "#7CDFFF"],
  pageCream: ["#FFD23F", "#FF4F9A", "#35C58A", "#7CDFFF"],
  lavender: ["#FFD23F", "#FF4F9A", "#35C58A", "#7B3CFF"],
  yellow: ["#7B3CFF", "#FF4F9A", "#35C58A", "#7CDFFF"],
  dark: ["#FFD23F", "#FF4F9A", "#35C58A", "#7CDFFF"],
  ink: ["#FFD23F", "#FF4F9A", "#35C58A", "#7CDFFF"],
  purple: ["#FFD23F", "#FF4F9A", "#35C58A", "#FFFFFF"],
  violet: ["#FFD23F", "#FF4F9A", "#35C58A", "#FFFFFF"],
};

export default function AbstractBg({ mood = "cream", quiet = false }) {
  const [c1, c2, c3, accent] = PALETTES[mood] || PALETTES.cream;
  const isLight = LIGHT.includes(mood);
  const dot = isLight ? "#17112B" : "#ffffff";
  const dotOpacity = isLight ? "opacity-20" : "opacity-40";
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* yellow/violet blob — top-right corner */}
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-[42%]" style={{ background: c1, opacity: 0.9 }} />
      {/* accent blob — top-left, soft */}
      <div className="absolute -left-12 -top-12 h-28 w-28 rounded-[46%]" style={{ background: accent, opacity: 0.38 }} />
      {/* pink blob — left edge, lower half (mostly off-screen) */}
      <div
        className="absolute -left-12 top-[58%] h-40 w-28 rounded-[55%]"
        style={{ background: c2, opacity: quiet ? 0.5 : 0.78 }}
      />
      {/* mint blob — bottom-right corner (pushed lower when quiet) */}
      <div
        className={quiet ? "absolute -bottom-16 -right-12 h-36 w-36 rounded-[44%]" : "absolute -bottom-10 -right-8 h-40 w-40 rounded-[44%]"}
        style={{ background: c3, opacity: quiet ? 0.5 : 0.82 }}
      />
      {/* accent blob — bottom-left, very soft */}
      <div
        className="absolute -bottom-16 -left-10 h-28 w-32 rounded-[50%]"
        style={{ background: accent, opacity: quiet ? 0.18 : 0.3 }}
      />

      {/* dots — upper left */}
      <div className={`absolute left-6 top-[12%] grid grid-cols-3 gap-2 ${dotOpacity}`}>
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
        ))}
      </div>
      {/* dots — lower right (hidden when quiet so they don't sit behind CTAs) */}
      {!quiet && (
        <div className={`absolute bottom-[18%] right-7 grid grid-cols-4 gap-1.5 ${isLight ? "opacity-15" : "opacity-25"}`}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
          ))}
        </div>
      )}

      {/* squiggle — upper right (pink reads on light + dark) */}
      <svg className="absolute right-12 top-[11%] opacity-80" width="58" height="14" viewBox="0 0 58 14" fill="none">
        <path d="M2 8 Q9 1 16 8 T30 8 T44 8 T56 6" stroke="#FF4F9A" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}
