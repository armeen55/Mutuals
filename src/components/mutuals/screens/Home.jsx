import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Button from "../ui/Button";
import { ensureGroup, saveMutualsState, newRoomId } from "../../../utils/mutualsStorage";
import { captureGroup } from "../../../lib/mutualsApi";

export default function Home({ next }) {
  return (
    <Phone mood="cream">
      <div className="relative z-10 px-8 pt-32 text-center">
        <p className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
          async group chat test
        </p>
        <h1 className="mt-8 text-6xl font-black leading-[0.82] tracking-tighter">Who knows who?</h1>
        <p className="mx-auto mt-4 max-w-[285px] text-sm font-bold leading-5 text-black/60">
          Async-first. No need to get 4 friends live at once. Room code is optional for hangouts.
        </p>
      </div>
      <BottomSheet>
        <div className="grid grid-cols-3 gap-2">
          {["Create a room", "Send the link", "Reveal who knows who"].map((x, i) => (
            <div key={x} className="rounded-2xl bg-[#f3efff] p-3 text-center">
              <p className="text-xl font-black text-[#6b2cff]">{i + 1}</p>
              <p className="text-[11px] font-black text-black/50">{x}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-[28px] bg-[#6b2cff] p-4 text-white">
          <p className="text-xs font-black uppercase tracking-widest text-white/60">the reveal</p>
          <p className="mt-2 text-3xl font-black leading-none">Who's the mystery friend?</p>
          <p className="mt-2 text-sm text-white/70">Find out who your group actually knows.</p>
        </div>
        <div className="mt-5">
          <Button
            onClick={() => {
              ensureGroup(newRoomId());
              saveMutualsState({
                selfAnswers: {},
                guesses: {},
                revealUnlocked: false,
                completedSteps: [],
                soloDemo: false,
                groupMode: "duo",
              });
              captureGroup();
              next();
            }}
            tone="pink"
          >
            Create a room
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
