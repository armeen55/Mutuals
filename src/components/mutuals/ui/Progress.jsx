import { cx } from "../../../utils/ui";
import { steps } from "../../../data/mutualsDemoData";

export default function Progress({ step }) {
  return (
    <div className="mx-auto flex w-full max-w-[330px] items-center gap-1 rounded-full bg-black/10 p-1">
      {steps.map((s, i) => (
        <div key={s} className={cx("h-2 flex-1 rounded-full", i <= step ? "bg-[#6b2cff]" : "bg-black/10")} />
      ))}
    </div>
  );
}
