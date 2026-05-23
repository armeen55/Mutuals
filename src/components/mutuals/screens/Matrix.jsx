import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Progress from "../ui/Progress";
import Button from "../ui/Button";
import { members, matrixRows } from "../../../data/mutualsDemoData";

export default function Matrix({ next }) {
  return (
    <Phone mood="cream">
      <div className="relative z-10 px-6 pt-16 text-center">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-black/50">proof layer</p>
        <h2 className="mt-3 text-5xl font-black leading-none">Who knows who.</h2>
      </div>
      <BottomSheet tall>
        <Progress step={8} />
        <div className="mt-5 rounded-[28px] bg-[#f4f1fa] p-3">
          <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-black text-black/35">
            <span />
            {members.slice(0, 4).map((m) => (
              <span key={m.name}>{m.name.slice(0, 2)}</span>
            ))}
          </div>
          {matrixRows.map((row, r) => (
            <div key={r} className="mt-1 grid grid-cols-5 gap-1 text-center text-xs font-black">
              <span className="grid h-9 place-items-center rounded-xl bg-white text-black/45">
                {members[r].name.slice(0, 2)}
              </span>
              {row.map((cell, c) => {
                const n = Number(cell);
                const bg =
                  cell === "—" ? "#fff" : n > 80 ? "#d7ff2f" : n > 60 ? "#ffd25e" : n > 40 ? "#ff9ac3" : "#ff765e";
                return (
                  <span key={`${r}-${c}`} className="grid h-9 place-items-center rounded-xl" style={{ background: bg }}>
                    {cell}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-[26px] bg-[#e9fff0] p-4">
          <p className="text-sm font-black">Score = correct guesses. Mutual score = both directions averaged.</p>
          <p className="mt-1 text-xs font-bold text-black/50">Full report uses enough guesses to power 10 insight cards.</p>
        </div>
        <div className="mt-5">
          <Button onClick={next} tone="primary">
            What now?
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
