import Avatar from "../ui/Avatar";
import QuestionPanel from "../ui/QuestionPanel";
import { members } from "../../../data/mutualsDemoData";
import TwoColHero from "./TwoColHero";
import DesktopCreate from "./DesktopCreate";
import DesktopJoin from "./DesktopJoin";
import DesktopProgress from "./DesktopProgress";
import DesktopReveal from "./DesktopReveal";
import DesktopSignup from "./DesktopSignup";
import DesktopMatrix from "./DesktopMatrix";
import DesktopShare from "./DesktopShare";
import DesktopToday from "./DesktopToday";

export default function DesktopMain({ step, cardIndex, setCardIndex, currentCard, CardIcon, setStep }) {
  if (step === 0) {
    return (
      <TwoColHero
        title="Who knows who?"
        body="Async-first. Friends do not need to be live together. The reveal becomes a 10-card moment."
        card="Nobody knows Will."
      />
    );
  }
  if (step === 1) return <DesktopCreate />;
  if (step === 2) return <DesktopJoin setStep={setStep} />;
  if (step === 3) return <DesktopProgress />;
  if (step === 4) {
    return (
      <QuestionPanel
        question="What would the group be most wrong about?"
        options={["My biggest ick", "My toxic trait", "My ideal trip", "My hidden hot take"]}
        selected={0}
      />
    );
  }
  if (step === 5) {
    return (
      <div className="mt-8 grid grid-cols-[260px_1fr] gap-6">
        <div className="rounded-[34px] bg-[#f3efff] p-6 text-center">
          <Avatar member={members[2]} size="lg" />
          <p className="mt-5 text-3xl font-black">Guess Karan</p>
          <p className="mt-2 text-sm font-bold text-black/45">Real game collects enough guesses for 10 cards.</p>
        </div>
        <QuestionPanel
          question="What did Karan pick?"
          options={["Slow walkers", "Loud chewing", "Bad texters", "Overexplaining"]}
          selected={1}
        />
      </div>
    );
  }
  if (step === 6) {
    return (
      <DesktopReveal
        cardIndex={cardIndex}
        setCardIndex={setCardIndex}
        currentCard={currentCard}
        CardIcon={CardIcon}
        setStep={setStep}
      />
    );
  }
  if (step === 7) return <DesktopSignup setStep={setStep} />;
  if (step === 8) return <DesktopMatrix />;
  if (step === 9) return <DesktopShare />;
  return <DesktopToday />;
}
