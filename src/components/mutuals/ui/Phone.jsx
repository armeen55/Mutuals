import AbstractBg from "./AbstractBg";

export default function Phone({ children, mood = "purple" }) {
  return (
    <div className="mx-auto w-full max-w-[390px] rounded-[42px] bg-[#2b2540] p-3 shadow-2xl shadow-black/30">
      <div className="relative min-h-[760px] overflow-hidden rounded-[34px] bg-white text-black">
        <AbstractBg mood={mood} />
        <div className="relative z-10 flex items-center justify-between px-5 pt-4 text-[11px] font-black text-white">
          <span>9:41</span>
          <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">MUTUALS</span>
          <span>●●●</span>
        </div>
        {children}
      </div>
    </div>
  );
}
