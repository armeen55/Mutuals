import { cx } from "../../../utils/ui";

// A real mobile bottom panel: anchored to the bottom via flex `mt-auto`, sized to
// its content, and capped per variant so it scrolls internally instead of pushing
// CTAs off-screen. No forced min-height — sheets never read as empty white tubs.
const MAXH = { compact: "max-h-[62dvh]", standard: "max-h-[72dvh]", tall: "max-h-[84dvh]" };

export default function BottomSheet({ children, variant = "standard", tall = false }) {
  const v = tall ? "tall" : variant;
  return (
    <div
      className="relative z-20 mt-auto w-full px-3"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div className={cx("overflow-y-auto rounded-[34px] bg-white p-4 shadow-2xl sm:p-5", MAXH[v] || MAXH.standard)}>
        {children}
      </div>
    </div>
  );
}
