import { useState, useEffect } from "react";
import { Download, Share2, ChevronLeft, Lock } from "lucide-react";
import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import BigRevealCard from "../ui/BigRevealCard";
import Button from "../ui/Button";
import { insightCards, REF_URL } from "../../../data/mutualsDemoData";
import { useMutuals } from "../useMutuals";
import { cx, showToast } from "../../../utils/ui";

// Card display order for the reveal (skips index 3 — the "Full Report" gate card).
const REVEAL_ORDER = [0, 1, 2, 4, 5, 6, 7, 8, 9];

export default function Reveal({ next, go, goSignup }) {
  const app = useMutuals();
  const [pos, setPos] = useState(0);
  useEffect(() => {
    if (!app.revealUnlocked && !app.soloDemo) go("Answer");
  }, []);
  const card = insightCards[REVEAL_ORDER[Math.min(pos, REVEAL_ORDER.length - 1)]];
  const cardNumber = Math.min(pos + 1, 10);
  const atGate = !app.signedUp && pos >= 2;
  const atEnd = pos >= REVEAL_ORDER.length - 1;
  return (
    <Phone mood={card.mood}>
      <BigRevealCard card={card} />
      <BottomSheet>
        <div className="flex gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={cx("h-2 flex-1 rounded-full", i <= pos ? "bg-[#ff4f9a]" : "bg-black/10")} />
          ))}
        </div>
        <div className="mt-5 rounded-[26px] bg-[#f4f1fa] p-4">
          <p className="text-xs font-black uppercase tracking-widest text-black/35">reveal sequence</p>
          <p className="mt-2 text-sm font-black">Card {cardNumber} of 10 · auto-advancing Wrapped-style moment</p>
          <p className="mt-1 truncate text-xs font-bold text-black/45">{REF_URL}</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button tone="lime" icon={Download} onClick={() => showToast("PNG export coming next")}>
            Save PNG
          </Button>
          <Button tone="white" icon={Share2} onClick={() => showToast("Ready to share")}>
            Share
          </Button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Button tone="dark" icon={ChevronLeft} onClick={() => setPos(Math.max(0, pos - 1))}>
            Prev
          </Button>
          {atGate ? (
            <Button onClick={goSignup} tone="pink" icon={Lock}>
              Unlock 7 more
            </Button>
          ) : atEnd ? (
            <Button onClick={() => go("Share")} tone="primary">
              Finish
            </Button>
          ) : (
            <Button onClick={() => setPos(pos + 1)} tone="primary">
              Next card
            </Button>
          )}
        </div>
      </BottomSheet>
    </Phone>
  );
}
