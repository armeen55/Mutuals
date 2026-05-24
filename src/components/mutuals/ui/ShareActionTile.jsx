import { cx } from "../../../utils/ui";

// Compact action tile for the reveal/share action row (Share Image · Copy Link · More).
export default function ShareActionTile({ icon: Icon, label, onClick, tone = "ghost" }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "flex flex-1 flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-[11px] font-black transition active:scale-95",
        tone === "primary" ? "bg-[#6b2cff] text-white shadow-lg" : "bg-white/10 text-white hover:bg-white/15"
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}
