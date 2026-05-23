import { cx } from "../../../utils/ui";

export default function Avatar({ member, size = "md" }) {
  const dims = size === "sm" ? "h-10 w-10 text-sm" : size === "lg" ? "h-20 w-20 text-2xl" : "h-14 w-14 text-lg";
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cx(dims, "grid place-items-center rounded-3xl border-4 border-white shadow-lg")}
        style={{ background: member.bg, color: member.fg }}
      >
        {member.emoji}
      </div>
      {size !== "sm" && <span className="text-xs font-black text-black/60">{member.name}</span>}
    </div>
  );
}
