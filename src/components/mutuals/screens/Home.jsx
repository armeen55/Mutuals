import { useState } from "react";
import { Users, UserPlus, X } from "lucide-react";
import Phone from "../ui/Phone";
import { ensureGroup, saveMutualsState, newRoomId } from "../../../utils/mutualsStorage";
import { captureGroup } from "../../../lib/mutualsApi";
import { cx, showToast } from "../../../utils/ui";
import { track } from "../../../utils/analytics";

// Pull a room id out of a pasted MUTUALS invite link (or a raw id).
function parseInvite(text) {
  const t = (text || "").trim();
  if (!t) return null;
  try {
    const u = new URL(t);
    const g = u.searchParams.get("group");
    if (g) return g;
    const m = (u.hash || "").match(/\/g\/([^/?#]+)/);
    if (m) return m[1];
  } catch {
    // not a full URL — fall through
  }
  const m = t.match(/[?&]group=([^&\s]+)/);
  if (m) return m[1];
  return t.replace(/\s+/g, "");
}

export default function Home({ next, go }) {
  const [how, setHow] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const startRoom = (mode) => {
    ensureGroup(newRoomId());
    saveMutualsState({
      groupMode: mode,
      selfAnswers: {},
      guesses: {},
      revealUnlocked: false,
      completedSteps: [],
      soloDemo: false,
      roundsByGroup: {},
    });
    captureGroup();
    track("room_created", { mode });
    next();
  };

  return (
    <Phone mood="cream">
      <div
        className="relative z-10 flex flex-1 flex-col px-6 text-[#17112B]"
        style={{
          paddingTop: "clamp(28px, 6svh, 60px)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + clamp(20px, 4svh, 36px))",
        }}
      >
        {/* breathing space above the brand (kept smaller than the middle) */}
        <div style={{ flexGrow: 1 }} />

        <div className="text-center">
          <h1 className="font-black leading-none tracking-tighter" style={{ fontSize: "clamp(3.25rem, 16vw, 5.25rem)" }}>
            MUTUALS
          </h1>
          <p className="mt-3 font-bold text-black/55" style={{ fontSize: "clamp(1rem, 4.6vw, 1.25rem)" }}>
            Find out who knows who
          </p>
        </div>

        {/* the decorative middle — bigger so the brand sits in the upper third */}
        <div style={{ flexGrow: 1.4 }} />

        <div className="space-y-3">
          <button
            onClick={() => startRoom("duo")}
            className="flex w-full items-center justify-between gap-3 rounded-[26px] bg-[#6b2cff] px-5 text-left shadow-xl transition active:scale-[0.98]"
            style={{ paddingTop: "clamp(14px, 2.4svh, 20px)", paddingBottom: "clamp(14px, 2.4svh, 20px)" }}
          >
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-white/60">1:1 showdown</p>
              <p className="text-xl font-black leading-tight sm:text-2xl">Challenge 1 Friend</p>
              <p className="text-sm font-bold text-white/70">Prove who knows who better.</p>
            </div>
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/15">
              <Users className="h-5 w-5" />
            </div>
          </button>

          <button
            onClick={() => startRoom("group")}
            className="flex w-full items-center justify-between gap-3 rounded-[26px] bg-[#ff4f9a] px-5 text-left shadow-xl transition active:scale-[0.98]"
            style={{ paddingTop: "clamp(14px, 2.4svh, 20px)", paddingBottom: "clamp(14px, 2.4svh, 20px)" }}
          >
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-white/70">group chaos</p>
              <p className="text-xl font-black leading-tight sm:text-2xl">Start Group Room</p>
              <p className="text-sm font-bold text-white/80">Who actually pays attention?</p>
            </div>
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/20">
              <Users className="h-5 w-5" />
            </div>
          </button>

          <button
            onClick={() => setJoinOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-[22px] border-2 border-[#6B2CFF]/20 bg-white py-3.5 text-sm font-black text-[#17112B] shadow-sm transition active:scale-[0.98]"
          >
            <UserPlus className="h-5 w-5" /> Join a Room
          </button>

          <p className="px-2 pt-1 text-center text-xs font-bold leading-relaxed text-black/45">
            Answer about yourself. Guess your friends. Reveal the receipts.
          </p>
          <button
            onClick={() => setHow(true)}
            className="mx-auto block text-center text-xs font-black uppercase tracking-widest text-black/45 underline-offset-4 hover:underline"
          >
            How it works
          </button>
        </div>
      </div>

      {how && <HowItWorks onClose={() => setHow(false)} />}
      {joinOpen && <JoinPanel onClose={() => setJoinOpen(false)} go={go} />}
    </Phone>
  );
}

function HowItWorks({ onClose }) {
  const steps = [
    { n: "1", t: "Answer about yourself", d: "A few spicy questions. Be honest — your answers stay hidden." },
    { n: "2", t: "Guess your friends", d: "Predict what they actually picked about themselves." },
    { n: "3", t: "Reveal the receipts", d: "See who knows who — and who was guessing vibes." },
  ];
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/60" onClick={onClose}>
      <div className="rounded-t-[34px] bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p className="text-xl font-black">How it works</p>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-black/5">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {steps.map((s) => (
            <div key={s.n} className="flex gap-3 rounded-2xl bg-[#f3efff] p-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#6b2cff] text-sm font-black text-white">
                {s.n}
              </div>
              <div>
                <p className="text-sm font-black">{s.t}</p>
                <p className="text-xs font-bold text-black/55">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function JoinPanel({ onClose, go }) {
  const [text, setText] = useState("");
  const submit = () => {
    const id = parseInvite(text);
    if (!id) {
      showToast("Paste a valid invite link");
      return;
    }
    ensureGroup(id);
    saveMutualsState({ selfAnswers: {}, guesses: {}, revealUnlocked: false, completedSteps: [], soloDemo: false, roundsByGroup: {} });
    go("Join");
  };
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/60" onClick={onClose}>
      <div className="rounded-t-[34px] bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p className="text-xl font-black text-[#17112B]">Join a room</p>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-black/5">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-sm font-bold text-black/55">Paste the MUTUALS invite link a friend sent you.</p>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste invite link…"
          className="mt-3 w-full rounded-2xl border-4 border-black/10 bg-white px-4 py-3.5 text-sm font-black text-[#17112B] outline-none placeholder:font-bold placeholder:text-black/30 focus:border-[#6B2CFF]"
        />
        <button
          onClick={submit}
          className={cx(
            "mt-3 w-full rounded-2xl bg-[#6B2CFF] py-3.5 text-sm font-black text-white transition active:scale-[0.98]",
            text.trim() ? "" : "pointer-events-none opacity-40"
          )}
        >
          Join room
        </button>
      </div>
    </div>
  );
}
