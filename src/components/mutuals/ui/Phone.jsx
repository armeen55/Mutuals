import AbstractBg from "./AbstractBg";

// Full-bleed mood background so white-on-screen headers stay readable and the
// reveal reads like a real screen — not a phone-inside-a-phone mockup.
const BG = { purple: "#6b2cff", dark: "#17112b", cream: "#fff2df", yellow: "#ffbd00" };

export default function Phone({ children, mood = "purple" }) {
  return (
    <div
      className="relative flex min-h-[100dvh] flex-col overflow-hidden text-black"
      style={{ background: BG[mood] || BG.purple }}
    >
      <AbstractBg mood={mood} />
      {children}
    </div>
  );
}
