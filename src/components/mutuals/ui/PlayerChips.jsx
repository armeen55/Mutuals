import { cx } from "../../../utils/ui";

// Status chips for the people in a room. `lateIds` overrides a player's status
// to "joined late" so late arrivals read as a feature, not a glitch.
const STATUS = {
  finished: { label: "finished", cls: "bg-[#7be495] text-black" },
  guessing: { label: "guessing", cls: "bg-[#7cdfff] text-black" },
  answering: { label: "answering", cls: "bg-[#ffd25e] text-black" },
  joined: { label: "joined", cls: "bg-black/10 text-black/60" },
  late: { label: "joined late", cls: "bg-[#ff8b5e] text-black" },
};

export default function PlayerChips({ participants = [], statuses = {}, lateIds = [], youId }) {
  if (!participants.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {participants.map((p) => {
        const key = lateIds.includes(p.id) ? "late" : statuses[p.id] || "joined";
        const s = STATUS[key] || STATUS.joined;
        const name = p.id === youId ? `${p.displayName} (you)` : p.displayName;
        return (
          <span key={p.id} className={cx("rounded-full px-3 py-1 text-xs font-black", s.cls)}>
            {name} · {s.label}
          </span>
        );
      })}
    </div>
  );
}
