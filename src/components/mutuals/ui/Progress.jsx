import { cx } from "../../../utils/ui";
import { steps } from "../../../data/mutualsDemoData";

// Two modes:
//  - question progress: pass `current` + `total` (+ optional `label`) — used by
//    Answer/Guess so the bar reflects the actual question, not the global flow.
//  - legacy step mode: pass `step` — global app-step bar (debug screens only).
export default function Progress({ step, current, total, label }) {
  if (typeof total === "number" && total > 0) {
    return (
      <div>
        <div className="flex w-full items-center gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={cx("h-2 flex-1 rounded-full", i < current ? "bg-[#6B2CFF]" : "bg-[#6B2CFF]/15")}
            />
          ))}
        </div>
        {label && (
          <p className="mt-2 text-center text-xs font-black uppercase tracking-widest text-black/45 short:mt-1">{label}</p>
        )}
      </div>
    );
  }
  return (
    <div className="mx-auto flex w-full max-w-[330px] items-center gap-1 rounded-full bg-black/10 p-1">
      {steps.map((s, i) => (
        <div key={s} className={cx("h-2 flex-1 rounded-full", i <= step ? "bg-[#6B2CFF]" : "bg-black/10")} />
      ))}
    </div>
  );
}
