import AbstractBg from "./ui/AbstractBg";
import { cx } from "../../utils/ui";

export default function MarketingLanding({ onStart, view, setView, debug }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f0e8] px-4 py-6 text-black">
      <AbstractBg mood="cream" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-48px)] max-w-7xl flex-col">
        <nav className="flex items-center justify-between rounded-[28px] bg-white/85 px-5 py-4 shadow-xl backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#6b2cff] text-xl font-black text-white">
              M
            </div>
            <div>
              <p className="text-lg font-black leading-none">MUTUALS</p>
              <p className="text-xs font-bold uppercase tracking-widest text-black/35">async group chat test</p>
            </div>
          </div>
          {debug && (
            <div className="flex rounded-2xl bg-[#f3efff] p-1">
              {["mobile", "desktop"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setView(mode)}
                  className={cx(
                    "rounded-xl px-4 py-2 text-xs font-black capitalize transition",
                    view === mode ? "bg-[#6b2cff] text-white" : "text-black/50"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          )}
        </nav>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_430px]">
          <section>
            <p className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-white">
              one link. no scheduling. one group map.
            </p>
            <h1 className="mt-8 max-w-4xl text-7xl font-black leading-[0.82] tracking-tighter sm:text-8xl lg:text-9xl">
              Find out who actually knows who.
            </h1>
            <p className="mt-7 max-w-2xl text-xl font-bold leading-8 text-black/60">
              Create an async group, drop the link in the chat, let friends answer whenever, and reveal the social graph
              as a 10-card moment.
            </p>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {["Send link", "Friends play later", "Reveal 10 cards"].map((label, i) => (
                <div key={label} className="rounded-[28px] bg-white/90 p-5 shadow-xl backdrop-blur">
                  <p className="text-4xl font-black text-[#6b2cff]">{i + 1}</p>
                  <p className="mt-3 text-lg font-black">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onStart}
                className="rounded-3xl bg-[#ff4f9a] px-8 py-5 text-left text-base font-black text-white shadow-xl shadow-[#ff4f9a]/25"
              >
                Open MUTUALS →
              </button>
              {debug && (
                <button
                  onClick={() => {
                    setView(view === "mobile" ? "desktop" : "mobile");
                    onStart();
                  }}
                  className="rounded-3xl bg-black px-8 py-5 text-left text-base font-black text-white shadow-xl"
                >
                  Try {view === "mobile" ? "desktop" : "mobile"} view
                </button>
              )}
            </div>
          </section>

          <section className="relative">
            <div className="absolute -inset-6 rounded-[52px] bg-[#6b2cff]/20 blur-3xl" />
            <div className="relative rounded-[44px] bg-[#17112b] p-5 shadow-2xl">
              <div className="relative overflow-hidden rounded-[36px] bg-[#6b2cff] p-7 text-white">
                <AbstractBg mood="purple" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black">
                      The Stranger
                    </span>
                    <span className="text-sm font-black">MUTUALS.APP</span>
                  </div>
                  <p className="mt-16 text-8xl font-black leading-none text-[#7cdfff]">23%</p>
                  <h2 className="mt-5 text-5xl font-black leading-[0.9] tracking-tighter">Nobody actually knows the quiet one.</h2>
                  <p className="mt-4 text-sm font-bold text-white/75">
                    The card your group chat argues about whenever everyone finishes.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[26px] bg-white p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-black/35">Reveal</p>
                  <p className="mt-1 text-3xl font-black text-[#6b2cff]">10 cards</p>
                </div>
                <div className="rounded-[26px] bg-[#d7ff2f] p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-black/35">Modes</p>
                  <p className="mt-1 text-3xl font-black">1:1 &amp; Group</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
