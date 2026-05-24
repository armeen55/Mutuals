import { cx } from "../../../utils/ui";

// A real mobile bottom panel: anchored to the bottom via flex `mt-auto`, sized to
// its content, and capped per variant. The cap GROWS as the viewport shortens —
// the header above shrinks on short screens, so the sheet may take more of the
// view. Internal scroll is an emergency only; compact content should never reach
// the cap on a normal phone.
const MAXH = {
  compact: "max-h-[60dvh] short:max-h-[68dvh] tiny:max-h-[76dvh]",
  standard: "max-h-[68dvh] short:max-h-[78dvh] tiny:max-h-[84dvh]",
  tall: "max-h-[var(--sheet-maxh)]",
};

export default function BottomSheet({ children, variant = "standard", tall = false, noScroll = false, center = false }) {
  const v = tall ? "tall" : variant;
  return (
    <div
      className={cx("relative z-20 w-full px-3 tiny:px-2", center ? "my-auto" : "mt-auto")}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)" }}
    >
      <div
        className={cx("min-h-0 bg-white shadow-2xl", noScroll ? "overflow-hidden" : "overflow-y-auto", MAXH[v] || MAXH.standard)}
        style={{ padding: "var(--sheet-pad)", borderRadius: "var(--radius-sheet)" }}
      >
        {children}
      </div>
    </div>
  );
}
