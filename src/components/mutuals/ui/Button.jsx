import { ArrowRight } from "lucide-react";
import { cx } from "../../../utils/ui";

export default function Button({ children, onClick, tone = "primary", icon: Icon = ArrowRight, className = "" }) {
  const styles = {
    primary: "bg-[#6b2cff] text-white shadow-[#6b2cff]/30",
    pink: "bg-[#ff4f9a] text-white shadow-[#ff4f9a]/30",
    lime: "bg-[#d7ff2f] text-black shadow-[#d7ff2f]/30",
    dark: "bg-black text-white shadow-black/20",
    white: "bg-white text-black shadow-black/10",
    yellow: "bg-[#ffbd00] text-black shadow-[#ffbd00]/25",
  };
  return (
    <button
      onClick={onClick}
      className={cx(
        "flex w-full items-center justify-between rounded-3xl px-5 py-4 text-left text-sm font-black shadow-xl transition active:scale-[0.98]",
        styles[tone],
        className
      )}
    >
      <span>{children}</span>
      <Icon className="h-5 w-5" />
    </button>
  );
}
