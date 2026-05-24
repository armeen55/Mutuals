import AbstractBg from "./AbstractBg";

// MUTUALS palette (single source for screen backgrounds). Dark navy (ink) is the
// dramatic reveal stage only — friendly cream/lavender/violet carry the rest.
export const PALETTE = {
  ink: "#17112B",
  cream: "#FFF3DF",
  pageCream: "#F8F1E8",
  violet: "#7B3CFF",
  deepViolet: "#6B2CFF",
  lavender: "#F3EFFF",
  pink: "#FF4F9A",
  yellow: "#FFD23F",
  mint: "#35C58A",
  sky: "#7CDFFF",
  softLine: "#E8DFF8",
};

// mood -> background color
const BG = {
  ink: PALETTE.ink,
  dark: PALETTE.ink, // alias for existing reveal-stage usages
  cream: PALETTE.cream,
  pageCream: PALETTE.pageCream,
  lavender: PALETTE.lavender,
  purple: PALETTE.deepViolet,
  violet: PALETTE.violet,
  yellow: PALETTE.yellow,
  pink: PALETTE.pink,
  mint: PALETTE.mint,
  sky: PALETTE.sky,
};

export default function Phone({ children, mood = "cream", quiet = false }) {
  return (
    <div
      className="mutuals-screen relative flex h-[100dvh] max-h-[100dvh] min-h-[100svh] flex-col overflow-hidden text-[#17112B]"
      style={{ background: BG[mood] || BG.cream }}
    >
      <AbstractBg mood={mood} quiet={quiet} />
      {children}
    </div>
  );
}
