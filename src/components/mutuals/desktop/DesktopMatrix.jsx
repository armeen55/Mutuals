import { members, matrixRows } from "../../../data/mutualsDemoData";

export default function DesktopMatrix() {
  return (
    <div className="mt-8 grid grid-cols-[1fr_280px] gap-6">
      <div className="rounded-[34px] bg-[#f4f1fa] p-6">
        <div className="grid grid-cols-5 gap-2 text-center text-xs font-black text-black/35">
          <span />
          {members.slice(0, 4).map((m) => (
            <span key={m.name}>{m.name.slice(0, 2)}</span>
          ))}
        </div>
        {matrixRows.map((row, r) => (
          <div key={r} className="mt-2 grid grid-cols-5 gap-2 text-center text-sm font-black">
            <span className="grid h-14 place-items-center rounded-2xl bg-white text-black/45">
              {members[r].name.slice(0, 2)}
            </span>
            {row.map((cell, c) => {
              const n = Number(cell);
              const bg =
                cell === "—" ? "#fff" : n > 80 ? "#d7ff2f" : n > 60 ? "#ffd25e" : n > 40 ? "#ff9ac3" : "#ff765e";
              return (
                <span key={`${r}-${c}`} className="grid h-14 place-items-center rounded-2xl" style={{ background: bg }}>
                  {cell}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <div className="rounded-[34px] bg-[#e9fff0] p-6">
        <p className="text-2xl font-black">Proof formula</p>
        <p className="mt-4 text-sm font-bold leading-6 text-black/55">
          Score = correct guesses. Mutual score = both directions averaged. Full game collects enough guesses to power
          10 cards.
        </p>
      </div>
    </div>
  );
}
