import { ChevronLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cx } from "../../utils/ui";
import { steps } from "../../data/mutualsDemoData";
import Home from "./screens/Home";
import Create from "./screens/Create";
import JoinWall from "./screens/JoinWall";
import ProgressScreen from "./screens/ProgressScreen";
import Answer from "./screens/Answer";
import Guess from "./screens/Guess";
import Reveal from "./screens/Reveal";
import SignupGate from "./screens/SignupGate";
import Matrix from "./screens/Matrix";
import Share from "./screens/Share";
import Today from "./screens/Today";

export default function MobileFlow({ step, setStep }) {
  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const go = (name) => setStep(Math.max(0, steps.indexOf(name)));
  const screens = [
    <Home next={next} go={go} />,
    <Create next={next} />,
    <JoinWall go={go} />,
    <ProgressScreen next={next} />,
    <Answer next={next} />,
    <Guess next={next} />,
    <Reveal next={next} go={go} goSignup={() => setStep(7)} />,
    <SignupGate next={next} />,
    <Matrix next={next} />,
    <Share next={next} go={go} />,
    <Today go={go} />,
  ];
  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.2 }}
        >
          {screens[step]}
        </motion.div>
      </AnimatePresence>
      <div className="mx-auto mt-5 flex max-w-[390px] items-center gap-3 px-2">
        <button onClick={back} className="grid h-12 w-12 place-items-center rounded-2xl bg-black text-white shadow-lg">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 rounded-2xl bg-white p-3 shadow-lg">
          <div className="flex gap-1">
            {steps.map((s, i) => (
              <div key={s} className={cx("h-2 flex-1 rounded-full", i <= step ? "bg-[#6b2cff]" : "bg-black/10")} />
            ))}
          </div>
          <p className="mt-2 text-center text-xs font-black uppercase tracking-widest text-black/45">
            {step + 1}/{steps.length} · {steps[step]}
          </p>
        </div>
        <button onClick={next} className="grid h-12 w-12 place-items-center rounded-2xl bg-[#6b2cff] text-white shadow-lg">
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
