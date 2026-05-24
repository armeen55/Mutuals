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
    <Phone mood="cream" quiet>
      <div
        className="relative z-10 flex flex-1 flex-col px-6 text-[#17112B]"
        style={{
          paddingTop: "clamp(28px, 5svh, 56px)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + clamp(18px, 4svh, 32px))",
        }}
      >
        {/* upper framing (smaller, so the cluster sits in the upper-middle) */}
        <div style={{ flexGrow: 0.7 }} />

        {/* brand */}
        <div className="text-center">
          <h1 className="font-black leading-none tracking-tighter" style={{ fontSize: "clamp(4rem, 15vw, 5.5rem)" }}>
            MUTUALS
          </h1>
          <p
            className="mx-auto mt-2.5 max-w-[320px] font-bold leading-snug text-black/55"
            style={{ fontSize: "clamp(0.95rem, 4vw, 1.05rem)" }}
          >
            Prove which of your friends actually knows you, and which ones are faking.
          </p>
        </div>

        {/* modest gap so logo + actions meet near the middle */}
        <div style={{ height: "clamp(26px, 5svh, 56px)" }} />

        {/* actions */}
        <div className="space-y-3">
          <button
            onClick={() => startRoom("duo")}
            className="flex min-h-[104px] w-full items-center justify-between gap-3 rounded-[26px] bg-[#6B2CFF] px-5 py-4 text-left text-white shadow-xl transition active:scale-[0.98]"
          >
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-white/65">1:1 showdown</p>
              <p className="mt-0.5 text-2xl font-black leading-tight">Challenge 1 Friend</p>
              <p className="text-sm font-bold text-white/75">Settle who knows who better.</p>
            </div>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15">
              <Users className="h-6 w-6" />
            </div>
          </button>

          <button
            onClick={() => startRoom("group")}
            className="flex min-h-[104px] w-full items-center justify-between gap-3 rounded-[26px] bg-[#FF4F9A] px-5 py-4 text-left text-white shadow-xl transition active:scale-[0.98]"
          >
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-white/75">group chaos</p>
              <p className="mt-0.5 text-2xl font-black leading-tight">Start Group Room</p>
              <p className="text-sm font-bold text-white/85">Put the chat on the record.</p>
            </div>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20">
              <Users className="h-6 w-6" />
            </div>
          </button>

          <button
            onClick={() => setJoinOpen(true)}
            className="flex min-h-[58px] w-full items-center justify-center gap-2 rounded-[22px] border border-black/5 bg-white text-sm font-black text-[#17112B] shadow-sm transition active:scale-[0.98]"
          >
            <UserPlus className="h-5 w-5" /> Join a room
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

        {/* lower framing */}
        <div style={{ flexGrow: 1 }} />
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
      <div
        className="rounded-t-[34px] bg-white p-6"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-xl font-black">How it works</p>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-black/5">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {steps.map((s) => (
            <div key={s.n} className="flex gap-3 rounded-2xl bg-[#F3EFFF] p-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#6B2CFF] text-sm font-black text-white">
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
      <div
        className="rounded-t-[34px] bg-white p-6"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-xl font-black text-[#17112B]">Paste your invite</p>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-black/5">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-sm font-bold text-black/55">Drop in the link your friend sent.</p>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="https://mutuals…"
          autoFocus
          className="mt-3 min-h-[56px] w-full rounded-2xl border-4 border-black/10 bg-white px-4 text-sm font-black text-[#17112B] outline-none placeholder:font-bold placeholder:text-black/30 focus:border-[#6B2CFF]"
        />
        <p className="mt-2 text-[11px] font-bold text-black/35">Room links look like mutuals.app/?group=m-xxxx</p>
        <button
          onClick={submit}
          className={cx(
            "mt-3 min-h-[56px] w-full rounded-2xl bg-[#6B2CFF] text-sm font-black text-white transition active:scale-[0.98]",
            text.trim() ? "" : "pointer-events-none opacity-40"
          )}
        >
          Open room
        </button>
      </div>
    </div>
  );
}
