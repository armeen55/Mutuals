import { ArrowRight } from "lucide-react";
import { cx } from "../../../utils/ui";

// Tones map to the MUTUALS palette. Colored tones carry a strong shadow (they read
// as the primary action); `white` is intentionally quieter (border + soft shadow)
// so a stacked secondary reads second without looking disabled. The "lime" key is
// kept for call-site compatibility but renders as friendly mint.
export default function Button({ children, onClick, tone = "primary", icon: Icon = ArrowRight, className = "" }) {
  const styles = {
    primary: "bg-[#6B2CFF] text-white shadow-xl shadow-[#6B2CFF]/30",
    violet: "bg-[#7B3CFF] text-white shadow-xl shadow-[#7B3CFF]/30",
    pink: "bg-[#FF4F9A] text-white shadow-xl shadow-[#FF4F9A]/30",
    lime: "bg-[#35C58A] text-white shadow-xl shadow-[#35C58A]/30",
    mint: "bg-[#35C58A] text-white shadow-xl shadow-[#35C58A]/30",
    dark: "bg-[#17112B] text-white shadow-lg shadow-black/25",
    white: "border border-black/5 bg-white text-[#17112B] shadow-sm",
    yellow: "bg-[#FFD23F] text-[#17112B] shadow-xl shadow-[#FFD23F]/30",
  };
  return (
    <button
      onClick={onClick}
      className={cx(
        "flex min-h-[var(--button-h)] w-full items-center justify-between rounded-3xl px-5 py-3 text-left text-sm font-black transition active:scale-[0.98]",
        styles[tone] || styles.primary,
        className
      )}
    >
      <span>{children}</span>
      <Icon className="h-5 w-5" />
    </button>
  );
}
