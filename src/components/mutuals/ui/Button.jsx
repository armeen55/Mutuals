import { ArrowRight } from "lucide-react";
import { cx } from "../../../utils/ui";

// Tones map to the MUTUALS palette. The "lime" key is kept for call-site
// compatibility but now renders as friendly mint.
export default function Button({ children, onClick, tone = "primary", icon: Icon = ArrowRight, className = "" }) {
  const styles = {
    primary: "bg-[#6B2CFF] text-white shadow-[#6B2CFF]/30",
    violet: "bg-[#7B3CFF] text-white shadow-[#7B3CFF]/30",
    pink: "bg-[#FF4F9A] text-white shadow-[#FF4F9A]/30",
    lime: "bg-[#35C58A] text-white shadow-[#35C58A]/30",
    mint: "bg-[#35C58A] text-white shadow-[#35C58A]/30",
    dark: "bg-[#17112B] text-white shadow-black/25",
    white: "bg-white text-[#17112B] shadow-black/10",
    yellow: "bg-[#FFD23F] text-[#17112B] shadow-[#FFD23F]/30",
  };
  return (
    <button
      onClick={onClick}
      className={cx(
        "flex w-full items-center justify-between rounded-3xl px-5 py-4 text-left text-sm font-black shadow-xl transition active:scale-[0.98]",
        styles[tone] || styles.primary,
        className
      )}
    >
      <span>{children}</span>
      <Icon className="h-5 w-5" />
    </button>
  );
}
