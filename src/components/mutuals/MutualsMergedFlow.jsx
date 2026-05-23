import { useState, useEffect } from "react";
import { cx } from "../../utils/ui";
import { steps } from "../../data/mutualsDemoData";
import {
  saveMutualsState,
  resetMutualsState,
  readGroupFromUrl,
  ensureGroup,
  getMutualsState,
} from "../../utils/mutualsStorage";
import MarketingLanding from "./MarketingLanding";
import MobileFlow from "./MobileFlow";
import DesktopApp from "./desktop/DesktopApp";
import Toast from "./ui/Toast";

const param = (k) => {
  try {
    return new URLSearchParams(window.location.search).get(k);
  } catch {
    return null;
  }
};
const isDebug = () => param("debug") === "1";

export default function MutualsMergedFlow() {
  const debug = isDebug();
  // Public visitors drop straight into the live app. The marketing landing is
  // opt-in via ?landing=1 (and always available in ?debug=1).
  const wantsLanding = debug || param("landing") === "1";
  const [showPrototype, setShowPrototype] = useState(!wantsLanding);
  const [view, setView] = useState("mobile");
  const [step, setStep] = useState(0);

  useEffect(() => {
    saveMutualsState({ lastVisitedAt: Date.now() });
    const gid = readGroupFromUrl();
    if (gid) {
      const prev = getMutualsState().activeGroupId;
      ensureGroup(gid);
      if (gid !== prev) {
        // Opening a different room — drop the previous room's local play state.
        saveMutualsState({ selfAnswers: {}, guesses: {}, revealUnlocked: false, completedSteps: [], soloDemo: false });
      }
      setShowPrototype(true);
      setStep(steps.indexOf("Join"));
    }
  }, []);

  if (!showPrototype) {
    return <MarketingLanding onStart={() => setShowPrototype(true)} view={view} setView={setView} debug={debug} />;
  }

  // PUBLIC: full-bleed mobile web app. The centered max-w-md column only matters on
  // desktop, where a dark surround frames the screen instead of a fake phone bezel.
  if (!debug) {
    return (
      <div className="min-h-[100dvh] bg-[#17112b]">
        <div className="mx-auto w-full max-w-md">
          <MobileFlow step={step} setStep={setStep} debug={false} />
        </div>
        <Toast />
      </div>
    );
  }

  // DEBUG: boxed shell with mobile/desktop + step controls.
  const effectiveView = view;

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f0e8] text-black">
      <div className="sticky top-0 z-50 border-b border-black/5 bg-white/85 px-4 py-4 shadow-lg backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setShowPrototype(false)}
                className="rounded-2xl bg-black px-4 py-3 text-sm font-black text-white"
              >
                Landing
              </button>
              <div>
                <p className="text-lg font-black leading-none">MUTUALS Flow</p>
                <p className="text-xs font-bold uppercase tracking-widest text-black/35">debug · mobile/desktop + steps</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
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
              <div className="hidden flex-wrap gap-1 xl:flex">
                {steps.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setStep(i)}
                    className={cx(
                      "rounded-xl px-3 py-2 text-xs font-black transition",
                      i === step ? "bg-[#ff4f9a] text-white" : "bg-black/5 text-black/55 hover:bg-black/10"
                    )}
                  >
                    {i + 1}. {s}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  resetMutualsState();
                  setShowPrototype(false);
                  setStep(0);
                }}
                className="rounded-xl px-3 py-2 text-xs font-black text-black/40 transition hover:text-black/70"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="mx-auto mt-3 flex max-w-7xl gap-1 xl:hidden">
            {steps.map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(i)}
                className={cx(
                  "h-2 flex-1 rounded-full",
                  i === step ? "bg-[#ff4f9a]" : i < step ? "bg-[#6b2cff]" : "bg-black/10"
                )}
                aria-label={s}
              />
            ))}
          </div>
        </div>

      <div
        className={cx(
          "mx-auto min-h-[calc(100vh-104px)] px-4 py-8",
          effectiveView === "desktop" ? "max-w-[1500px]" : "max-w-lg"
        )}
      >
        {effectiveView === "mobile" ? (
          <MobileFlow step={step} setStep={setStep} debug={debug} />
        ) : (
          <DesktopApp step={step} setStep={setStep} />
        )}
      </div>
      <Toast />
    </div>
  );
}
