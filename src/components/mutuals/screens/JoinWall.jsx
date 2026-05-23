import Phone from "../ui/Phone";
import BottomSheet from "../ui/BottomSheet";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import { members } from "../../../data/mutualsDemoData";
import { useMutuals } from "../useMutuals";
import { saveMutualsState, withStep } from "../../../utils/mutualsStorage";
import { captureJoin } from "../../../lib/mutualsApi";
import { showToast } from "../../../utils/ui";

export default function JoinWall({ go }) {
  const app = useMutuals();
  const group = (app.createdGroups || []).find((g) => g.id === app.activeGroupId);
  const host = group?.createdBy || "Armeen";
  const invited = members.length;
  const finished = members.filter((m) => m.status === "done").length;
  const join = () => {
    let name = app.currentUserName;
    if (!name) {
      let entered = "";
      try {
        entered = window.prompt("Your name?", "") || "";
      } catch {
        entered = "";
      }
      name = entered.trim() || "You";
    }
    const roster = app.groupMembers || [];
    const nextRoster = roster.includes(name) ? roster : [...roster, name];
    saveMutualsState({ currentUserName: name, groupMembers: nextRoster, completedSteps: withStep("Join") });
    captureJoin(name);
    showToast(`Welcome, ${name}`);
    go("Answer");
  };
  return (
    <Phone mood="yellow">
      <div className="relative z-10 px-7 pt-24 text-center">
        <p className="inline-flex rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
          you were invited
        </p>
        <h2 className="mt-7 text-6xl font-black leading-[0.85] tracking-tighter">
          {host} wants to test the group.
        </h2>
        <p className="mx-auto mt-4 max-w-[260px] text-sm font-bold text-black/60">
          {invited} friends invited. {finished} finished. Takes about 90 seconds. Your answers stay private until the
          reveal.
        </p>
      </div>
      <BottomSheet>
        <div className="grid grid-cols-3 gap-2">
          {members.slice(0, 3).map((m) => (
            <div key={m.name} className="rounded-2xl bg-[#f3efff] p-3 text-center">
              <Avatar member={m} size="sm" />
              <p className="mt-2 text-[11px] font-black text-black/50">joined</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-[26px] bg-black p-4 text-white">
          <p className="text-xs font-black uppercase tracking-widest text-white/45">what happens</p>
          <p className="mt-2 text-xl font-black">
            Answer about yourself, then guess a few friends. The group unlocks 10 cards.
          </p>
        </div>
        <div className="mt-5">
          <Button onClick={join} tone="pink">
            Join and answer
          </Button>
        </div>
      </BottomSheet>
    </Phone>
  );
}
