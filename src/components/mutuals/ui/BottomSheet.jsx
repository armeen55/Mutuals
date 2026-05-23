import { cx } from "../../../utils/ui";

export default function BottomSheet({ children, tall = false }) {
  return (
    <div
      className={cx(
        "absolute inset-x-2 bottom-2 z-20 rounded-[34px] bg-white p-5 shadow-2xl",
        tall ? "min-h-[520px]" : "min-h-[390px]"
      )}
    >
      {children}
    </div>
  );
}
