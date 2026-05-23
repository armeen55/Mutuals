import { cx } from "../../../utils/ui";

// A real mobile bottom panel: sits at the bottom of the screen via flex `mt-auto`,
// grows with content, and scrolls internally before it can push CTAs off-screen.
export default function BottomSheet({ children, tall = false }) {
  return (
    <div className="relative z-20 mt-auto w-full px-2 pb-2">
      <div
        className={cx(
          "max-h-[88dvh] overflow-y-auto rounded-[34px] bg-white p-5 shadow-2xl",
          tall ? "min-h-[58dvh]" : "min-h-[42dvh]"
        )}
      >
        {children}
      </div>
    </div>
  );
}
