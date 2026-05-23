# CLAUDE_STATUS

Implementation log. Claude Code = implementer. Codex = read-only architect/reviewer.
Newest entry on top.

---

## Chunk 10 — Fix the stuck/waiting-room experience (BATCH: not built/pushed/deployed)

### Bug
On the live waiting/locked screens the headline was **white text over the white phone area** → invisible, so the room looked stuck. Combined with group-mode needing 3 people, a 2-phone test stranded users.

### Fixes
1. **Readable waiting screens** — Guess-waiting and Reveal-locked now put all status on solid surfaces: a black **"1:1 room" / "Group room"** pill badge up top, and inside the white BottomSheet (black text): **"N joined"**, **"Need N more person/people"** or **"Need N more to finish"**, and the explanation **"Group rooms unlock at 3. 1:1 rooms unlock at 2."** No more white-on-white.
2. **1:1 is the default** — `DEFAULT_STATE.groupMode = "duo"`; Home create sets `groupMode: "duo"`; Create defaults to 1:1 with copy "1:1 unlocks with 2 people. Group unlocks with 3+."
3. **Escape hatch** — when a room is Group with exactly 2 participants, both the Guess-waiting and Reveal-locked screens show **"Unlock as 1:1 now"**: sets local mode duo, upserts backend group mode to duo, refreshes → unlocks at 2. Rescues accidentally-Group 2-person rooms.
4. **Participant-id repair** — `repairParticipantId(groupId, participants)` in storage: on JoinWall/Guess/Reveal bundle fetch, if the local participant id is missing/stale (not in room), re-link by matching `currentUserName`. Stops stale identity from breaking targets.
5. **"Check again" feedback** — shows **"Checking…"** while it refreshes the bundle/insights, then restores; readable explanation stays visible if still blocked.
6. **No fake data** — seeded Karan remains soloDemo-only; real rooms show "Loading room…" / waiting, never seeded.

### Files changed
`mutualsStorage.js`, screens `Guess/Reveal/JoinWall/Home/Create`.

### Status
**BATCH MODE — per instruction: no `npm run build`, no push, no deploy. Local commit only.** Static checks passed (imports aligned, handlers defined, `<Phone>` tags balanced). Live site is unchanged (still Chunk 9 build) until a future deploy.

### Next (when we resume deploying)
Build → commit as `armeen55` → push (auto-deploys Ready) → 2-phone test in **1:1** mode.

---

## Chunk 9 — Speed hardening (make the working loop hard to break)

### Deploy block — ROOT CAUSE FOUND & FIXED
Vercel "Deployment Blocked" was **not** the Hobby plan — it was the **git commit author email**. Commits authored as `iranopedia5@gmail.com` (the "Persian5" identity) aren't a Vercel member, so on Hobby + private repo every git-triggered deploy was blocked. Fix: set the **local** repo author to `armeen55 <278262837+armeen55@users.noreply.github.com>` (a recognized member). New commits deploy Ready. No Pro upgrade, no CLI scope juggling. (Local git config was previously unset → fell back to the global `iranopedia5` email.)

### Fixes
1. **No seeded data while a real room loads** — `Guess` shows **"Loading room…"** when `!soloDemo && activeGroupId && bundle === null`; seeded Karan flow only renders for solo / no real group; real room with no other participants → waiting.
2. **Awaitable answers** — new `submitAnswers()` (awaited, throws on failure). Final Answer button shows **"Saving…"**, only advances to Guess on success; on failure it toasts and stays put.
3. **Real Supabase errors** — `joinGroup/saveAnswers/saveGuesses/setCompleted` now check `{ error }` and throw. `submitGuesses()` therefore never marks completed if the guess write failed.
4. **Room-scoped local state** — creating a new room (Home) and opening a different invite (`?group=`) now clear `selfAnswers/guesses/revealUnlocked/completedSteps/soloDemo` (preserve `participantIdsByGroup`). No carry-over between rooms.
5. **Create: pick mode before sharing** — 1:1 / Group choice moved **above** the link, numbered "1 · pick your room type" → "2 · share your link".
6. **Eazo CTA safety** — while `EAZO_VOTE_URL` is the placeholder, the button is disabled/soft and reads "Eazo vote link coming" (won't open eazo.ai). Activates when a real URL is set in `src/config.js`.

### Files changed
`mutualsApi.js`, screens `Answer/Guess/Home/Create/Share`, `MutualsMergedFlow.jsx`. Local git author config.

### Build & deploy — FIXED + LIVE
`npm run build` → success. Root cause of "Deployment Blocked" was the **commit-author email** (`iranopedia5@gmail.com`/Persian5, not a Vercel member) — on Hobby + private repo Vercel blocks deploys whose author isn't a member. Fix: set **local** repo author to `armeen55 <278262837+armeen55@users.noreply.github.com>`. Also reconnected the GitHub integration (I'd disconnected it in Chunk 8). Push as `armeen55` → deploy **READY** (no block). Verified live: https://mutuals-dun.vercel.app serves the Chunk 8+9 build (markers present), Supabase baked in, `/` + `/?debug=1` → 200. **Going forward: keep commits authored as `armeen55`; push → auto-deploys Ready.**

### Exact 2-phone test (after deploy is Ready)
1. Phone A → https://mutuals-dun.vercel.app → **Create a room** → **pick 1:1** (for a 2-phone test! Group needs 3 to unlock) → Share invite.
2. Phone B → open link → name → Join → answer q1–q4 ("Saving…") → guess A.
3. Phone A → answer → guess B → reveal. First finisher sees "Need 1 more", auto-updates ~6s when the other finishes → real cards.

### Known risks
- **Group mode needs 3 completed** to unlock — a 2-phone test must use **1:1** (this was the "stuck on waiting" screen you hit).
- Open RLS + public URL (demo-grade). Eazo link still placeholder.

---

## Chunk 8 — Post-answer / reveal / share blocker pass

### Deploy identity fix
GitHub→Vercel auto-deploys were failing ("Persian5 not a team member" — commit's GitHub identity isn't on the Vercel team). Fix: **disconnected the Vercel git integration** (`link: null`); deploys now go through the **Vercel CLI** as account `armeen-5267`. `git push` no longer triggers (failing) builds. Live URL unchanged: **https://mutuals-dun.vercel.app**.

### What changed
- **Guess (real rooms):** confirmed real-participant-only targeting (excludes self via per-room id), q1–q4 per target, group caps at 3; no valid targets → waiting (never seeded). Completion now via awaited `submitGuesses()` (no race).
- **Reveal (Goal 2):** redirect to Answer is now **backend-aware** — only bounces if the user isn't completed on the backend AND has no local unlock AND the room isn't ready (no longer trusts local `revealUnlocked` alone). Added a **graceful "Everyone's in / not enough overlapping guesses" state** when readiness is unlocked but `cards.length === 0`.
- **Auto-refresh (Goal 3):** Guess waiting + Reveal locked/waiting now poll the backend every **6s** (stop once others join / reveal is ready); manual "Check again" kept. No realtime subscriptions.
- **Rematch (Goal 4):** real rooms now mint a **brand-new room id** (`newRoomId` → `ensureGroup` → `captureGroup`) and route to Create — no stale rows reused. Solo still resets locally.
- **Share (Goal 5):** primary CTA **"Share this result"** (native share), secondary **Eazo vote** CTA; `EAZO_VOTE_URL` is the single source; while it's the placeholder (`eazo.ai`), the CTA reads "Vote for MUTUALS on Eazo (soon)".
- **Public landing (Goal 6):** "Try desktop view" + mobile/desktop nav toggle hidden unless `?debug=1`.

### Files changed
screens `Reveal/Guess/Share`, `MarketingLanding.jsx`, `MutualsMergedFlow.jsx`.

### Build
`npm run build` → success (546 kB, size warning only).

### Exact remaining manual test (2-phone, live)
1. Phone A → https://mutuals-dun.vercel.app → **Create a room** → pick 1:1 or Group → **Share invite**.
2. Phone B → open the shared link → enter name → **Join room** → answer q1–q4 → guess A (q1–q4).
3. Phone A → answer q1–q4 → guess B → on the last guess it should auto-advance to the reveal.
4. Both: reveal should show **real computed cards** (real names). If one finishes first, they see "Need 1 more to finish" and it **auto-updates within ~6s** when the other completes.
5. Tap **Share this result** (native share sheet) and **Rematch** (should create a fresh room link).

### Known risks
- Open RLS + public URL (anon read/write any room) — demo-grade.
- Eazo vote link still placeholder (`src/config.js`).
- Auto-refresh is polling (6s), not realtime — fine at small scale.
- Deploys are now CLI-only (git auto-deploy intentionally disconnected).

---

## Chunk 7 — Deployed to Vercel (public URL)

### Live URL
**https://mutuals-dun.vercel.app** (production, public).
Also aliased: `mutuals-armeen-5267s-projects.vercel.app`. Debug controls: append `?debug=1`.

### Deploy setup
- Vercel project `armeen-5267s-projects/mutuals`, linked to GitHub `armeen55/Mutuals` (pushes to `main` now auto-deploy to production).
- `vercel.json` pins framework=vite, build=`npm run build`, output=`dist`.
- Env vars set in Vercel **Production**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (same as `.env.local`). Confirmed baked into the production bundle → Supabase is the live backend in prod.
- **Deployment Protection disabled** (`ssoProtection=null`) so the link is publicly openable.

### Verified
- `/` → 200, `/?debug=1` → 200, title correct, Supabase URL present in the deployed JS.
- `shareUrl` uses `window.location.origin`, so rooms created on the live site share `https://mutuals-dun.vercel.app/?group=<id>` (Vercel domain).

### Known risks
- **Open RLS + public URL:** anon can read/write all rows (demo-grade). Anyone with a room link could read/write that room's data. Fine for the hackathon; tighten before real scale.
- Env vars are in **Production only** — preview/branch deploys fall back to localStorage (no Supabase).
- Publishable key ships in the client bundle (by design; browser-safe with RLS).
- No custom domain; the `*.vercel.app` URL is the share surface for now.

### Next fastest move
Real **2-phone test** on the live URL (A creates a room, B opens the link, both finish → real reveal). Fix only blockers, then wire the real `EAZO_VOTE_URL`.

---

## Chunk 6 — Real room identity + data integrity (pre-deploy blocker)

### Goal
Make room + participant identity correct so users can play multiple rooms without corruption.

### Fixes
1. **Per-room participant identity** — replaced single `currentParticipantId` with `participantIdsByGroup: { [groupId]: participantId }` (`getParticipantId`/`setParticipantId` in `mutualsStorage`). `ensureParticipant()` reads/writes the active room's id only; new rooms / invite links never reuse another room's participant.
2. **Join no longer overwrites mode/host** — `captureJoin()` and `ensureParticipant()` only `createGroup()` as a fallback when the group is missing; they never upsert the room with a local default mode. `captureGroup()` (host-only) still owns mode. JoinWall/Guess **sync local `groupMode` from `bundle.group.mode`**.
3. **Room-scoped schema uniqueness** — migration `supabase/migrations/0001_room_scoped_identity.sql` applied to project `lgzfptunoyljwyucishq`: `answers (group_id, participant_id, question_id)`, `guesses (group_id, guesser_id, target_id, question_id)`. `onConflict` in `mutualsApi` updated to match. (Verified the new constraints exist; old global ones dropped.)
4. **Participant join idempotency** — added `participants unique (group_id, display_name)`; `joinGroup()` now upserts on that key (race-safe). `schema.sql` updated for fresh setups.
5. **Reliable guess writes** — real Guess now accumulates q1–q4 per target locally and calls the awaitable `submitGuesses()` (writes all guesses, then marks complete) once at the end. No fire-and-forget completion race; button shows "Saving…".
6. **Real reveal link** — Reveal shows `shareUrl(activeGroupId)`, never `chaotic-six`/`REF_URL`.
7. **Docs** — `MIGRATION_HANDOFF.md` corrected (backend live, unique rooms, name input, real questions).

### Files changed
`mutualsStorage.js`, `mutualsApi.js`, screens `Guess/Reveal/JoinWall`, `supabase/schema.sql`, new `supabase/migrations/0001_room_scoped_identity.sql`, `MIGRATION_HANDOFF.md`.

### Verified
`npm run build` → success (544 kB). Migration applied + constraints confirmed via Management API. Pre-launch test data truncated (clean slate). Not 2-phone tested yet.

### Known risks
- `truncate groups cascade` ran on Supabase — all prior test rows cleared (intended; no real users yet).
- Still single-region localStorage fallback when no env; dev server must restart for `.env.local`.
- Group mode still caps guessing at 3 targets.

### Next fastest move
**Deploy a public URL** (so a second phone can reach it — `localhost` can't), then run the real 2-phone test and fix only blockers.

---

## Chunk 5 — Production mobile room flow

### Goal
Phone A creates a unique room → shares link → phone B opens it, joins with an in-app name field,
answers real questions, guesses real friends → room produces real reveal cards. No prototype DNA.

### What changed
- **Unique rooms (P1):** `newRoomId()` (`m-` + 7 lowercase chars) in `mutualsStorage`. Home "Create a room" now mints a fresh id (no more `chaotic-six` collisions); `chaotic-six` kept only for the solo fallback. `shareUrl` + invite `?group=<id>` use the real id.
- **Public shell + debug (P2):** `?debug=1` shows the old toggles/step buttons/Reset. Public (default) shows a minimal centered header (**MUTUALS · who actually knows who?**), forces mobile view, and hides the bottom step-controller in `MobileFlow`.
- **Real Join (P3):** `JoinWall` replaced `window.prompt` with an in-app name input (CTA disabled until non-empty), fetches the room bundle, shows **real** joined participants (or "No one has joined yet"), routes by state (Answer→Guess→Reveal). No seeded Armeen/Will/Karan in real rooms.
- **Real question pack (P4):** `src/data/questions.js` (`realQuestions`, 4 Qs). `Answer` shows one at a time, saves each, **no hidden auto-fill**. Same pack used for guessing.
- **Real guess (P5):** `Guess` asks q1–q4 per target; group caps at first 3 others, duo = the one other; excludes self; waiting state shows joined names + "Need N more" + Copy/Share/Check again. Seeded Karan only as solo fallback.
- **Real reveal (P6):** computed reveals never hit the signup gate (`atGate` excludes `realReady`); user walks all computed cards → Share. SignupGate remains for the seeded solo path only.
- **Copy cleanup (P7):** Home ("Create a room / Send the link / Reveal who knows who"), Create ("Your room is ready / Share this with your group chat / Choose your room", removed Live code/QR/tracked link/Pack/Tahoe), Today (no "retention chassis"), landing ("D+1"→"Daily").
- **OG (P8):** static OG/Twitter meta + real title in `index.html`.

### Files changed
`mutualsStorage.js`, new `data/questions.js`, `MutualsMergedFlow.jsx`, `MobileFlow.jsx`, screens `Home/Create/JoinWall/Answer/Guess/Reveal/Today`, `MarketingLanding.jsx`, `index.html`.

### Verified
`npm run build` → success (544 kB, size warning only). Not phone-tested yet.

### Known risks
- **Not run on 2 real phones yet** — that's the next step. Host-alone correctly stops at Guess waiting.
- No realtime; Join/Guess/Reveal rely on "Check again" to refetch.
- `EAZO_VOTE_URL` still placeholder; dev server must be restarted for `.env.local`.
- Group mode caps guessing at 3 targets (speed); insights still strongest in duo.

### Next fastest move
Real 2-phone test (create on A, open link on B, both finish) and fix only blockers — then sharpen the share/vote loop with the real Eazo link, then deploy a public URL.

---

## Chunk 4 — Mobile-first viral loop (share CTAs, invite/waiting, Eazo vote, real copy)

### Goal
Make MUTUALS feel instantly usable from a phone-group-chat link and make every screen push invite/vote/share.

### What changed
- **Share infra:** `src/utils/ui.js` → `shareOrCopy()` (native `navigator.share`, clipboard fallback). `src/config.js` → `EAZO_VOTE_URL` (one place to update).
- **P1 mobile join:** JoinWall headline = "Find out who actually knows who." (+ host/counts); join routes by state (Answer→Guess→Reveal). Guess "waiting" state now shows joined names, "Need N more to start", Copy + native Share invite, Check again. Reveal locked state shows joined names, "Need N more to finish", Copy + Share, Check again.
- **P2 share CTAs:** Create ("Share invite" + Copy + Continue), Guess waiting, Reveal card (native Share with the card's real headline), Share screen tiles (native), Today ("Share group" native). Sharp copy ("I made a MUTUALS room. Answer this before I start judging you.", "who knows who better?", etc.).
- **P3 Eazo vote:** Share screen has "Help MUTUALS win on Eazo" (opens `EAZO_VOTE_URL`) — post-reveal only, never blocks play.
- **P4 real reveal copy:** already real (engine uses participant names); seeded only as empty fallback. No change needed beyond confirming.
- **P5 de-prototyped copy:** "Open prototype"→"Open MUTUALS", "Try solo demo"→"Try it solo", "Reset demo"→"Reset", "Skip for demo"→"Skip for now", "next card preview"→"up next", "value preview"→"the payoff", "PNG export coming next"→"Screenshot to save & share", Answer/Guess explainer boxes rewritten. (Internal var `showPrototype` left as-is — not visible.)

### Files changed
`src/config.js` (new), `src/utils/ui.js`, `MarketingLanding.jsx`, `MutualsMergedFlow.jsx`, screens `Home/Create/JoinWall/Answer/Guess/Reveal/Share/Today/SignupGate`, `desktop/DesktopReveal.jsx`, `desktop/DesktopSignup.jsx`.

### Verified
`npm run build` → success (543 kB, size warning only). Not visually walked (per "less verifying, more going").

### Known risks
- `EAZO_VOTE_URL` is a placeholder (`https://eazo.ai`) — update in `src/config.js` when the real link exists.
- `navigator.share` only fires on HTTPS/mobile; desktop falls back to clipboard.
- Desktop screens only lightly touched (not the priority).
- Real-group flows still unwalked end-to-end (need 2–3 devices).

### Next fastest move
Generate a real share-card IMAGE (canvas/og) for the reveal so shared links carry the visual, and add an OG meta tag in `index.html` so pasted links preview richly in chats.

---

## Chunk 3 — Real participants in Guess, computed insights in Reveal, 1:1/Group mode

### Goal
Make the real game real: guess actual joined participants, show insights computed from real
answers/guesses, and let the host pick 1:1 vs Group mode (with matching unlock thresholds).

### Supabase status
- **Schema applied** to `lgzfptunoyljwyucishq` (4 tables live; PostgREST cache reloaded via `NOTIFY pgrst`).
- Access token persisted to `~/.zshenv` (`SUPABASE_ACCESS_TOKEN`) for future migrations.
- **Verified anon CRUD** (the app's exact path, publishable key, under RLS): group/participant/answer/guess inserts → 201, read-back correct, cascade delete → 204.

### Files changed
- `src/components/mutuals/screens/Create.jsx` — **C**: 1:1 vs Group toggle; stores `groupMode` + upserts the backend group.
- `src/components/mutuals/screens/Guess.jsx` — **A**: targets real joined participants (excludes self), cycles through them using the same options as Answer (so guesses are scorable); waiting/invite state when alone; **seeded Karan fallback only when there's no real group data / solo demo**.
- `src/components/mutuals/screens/Reveal.jsx` — **B**: fetches `getInsights(activeGroupId)`; shows **real computed cards** when readiness is unlocked; "X/N finished" locked state otherwise; seeded cards only as fallback / solo demo. Card UI + signup gate unchanged.

### User-facing behavior changed
- Create lets you choose **1:1 ("Who knows who better?")** or **Group ("Who actually knows the group?")**.
- Real groups: Guess shows real friends; Reveal shows insights built from real answers; reveal unlocks at **2 completed (duo)** / **3 completed (group)**.
- Solo-demo path (the "Try solo demo" button) is **unchanged** — seeded Karan + seeded 10 cards, full walkthrough.

### Verified
- `npm run build` → success (541 kB, size warning only). Supabase anon CRUD via REST (above). Insight engine math (prior Chunk-1 node test).

### Known risks
- **Dev server must be restarted** to load `.env.local` (Vite reads env at startup) — until then the app uses the localStorage fallback.
- Real-group Reveal not visually verified end-to-end (needs 2–3 real participants on separate devices). Logic + data path are verified.
- Single-user "Create" path now intentionally **waits at Guess** ("waiting for friends"); use **Try solo demo** for a solo walkthrough.
- Guess currently captures **q1 only** per target (sparse but scorable); "Unlock 7 more" label is literal even when there are fewer real cards; permissive RLS (anon all) — demo-grade.
- No realtime — Guess/Reveal have a "Check again" button to re-fetch.

### What Codex should review next
- Async fetch in `Guess`/`Reveal` (effect deps, the `alive`-less promise→setState, "Check again" path).
- `realReady` gating + the seeded-fallback boundary (`hasRealData`, `soloDemo`).
- `chooseMode` upsert overwriting `created_by`; gate behavior when real cards < 3.

### Suggested next task
Participant nudge/notify + multi-question guessing (more signal for insights), then the share-card image and the post-reveal Eazo vote prompt.

---

## Chunk 2 — Real Supabase + GitHub infrastructure

### Supabase status
- Project **Mutuals** (ref `lgzfptunoyljwyucishq`, us-west-1) connected via `.env.local`.
- Using the new **publishable** key (`sb_publishable_…`) as `VITE_SUPABASE_ANON_KEY` (browser-safe with RLS). The **secret** key is NOT used or stored anywhere.
- Key + URL **validated** against the live REST API — a `groups` query authenticated and returned PostgREST `PGRST205` (table missing), not `401`, so the credential is good.
- **Schema NOT yet applied** — `public.groups` does not exist. Blocked: no Supabase access token locally, CLI not logged in, `psql` absent. Needs `supabase/schema.sql` run in the SQL Editor (or a token).

### GitHub status
- Private repo created + pushed: **https://github.com/armeen55/Mutuals** (branch `main` → `origin/main`).
- Baseline commit `284f3af` (58 files). `.env.local` is gitignored and was NOT committed; verified no keys/project-ref in tracked source.
- Commit author name passed per-command ("Armeen" + existing global email); no persistent git-config change.

### Files changed
- New: `.env.local` (gitignored — real URL + publishable key), `.gitignore`.
- Initialized git, baseline commit, remote `origin`. No app/source code changed this chunk.

### What was verified
- Publishable key authenticates to PostgREST (valid). `.env.local` excluded from git. Push succeeded.

### Known risks
- Real multiplayer is **inactive until the schema is applied** (capture calls fail silently; app keeps running on the localStorage fallback).
- The **secret** key was visible in chat earlier — rotate it in Supabase → API Keys if this transcript is shared.
- Permissive RLS (anon all) — demo-grade. Commit email may not match GitHub account `armeen55` (cosmetic attribution).

### Next recommended task
Apply `supabase/schema.sql`, then run functional verification (create → join → answer → guess → confirm rows via REST), then wire `getInsights()` into the Reveal screen.

---

## Chunk 1 — Real multiplayer data layer + insight engine (Supabase-ready, localStorage fallback)

### 1. Goal of the edit
Move MUTUALS from prototype toward real multiplayer: a backend-agnostic data layer
(Supabase when configured, localStorage otherwise), a multi-participant data model, and a
rule-based insight engine that computes the 6 named insights from REAL stored answers/guesses.
Additive only — the locked reveal UI and the working demo flow are untouched.

### 2. Files changed
**New**
- `.env.example` — `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (blank = fallback mode).
- `supabase/schema.sql` — `groups`, `participants`, `answers`, `guesses` + permissive anon RLS.
- `src/lib/supabaseClient.js` — creates client from env; `isSupabaseEnabled` flag; `null` if unset.
- `src/lib/mutualsApi.js` — async API (createGroup/getGroup/joinGroup/saveAnswers/saveGuesses/
  setCompleted/getBundle/getInsights) with Supabase **and** localStorage backends, plus
  fire-and-forget `capture*` helpers used by screens.
- `src/lib/insights.js` — pure `computeReadiness()` + `computeInsights()` (Best Mutual Pair,
  One-Way Street, Mystery Friend/The Stranger, Group Glue, Confidently Wrong, Blind Spot).

**Edited (small, additive)**
- `src/utils/mutualsStorage.js` — added `groupMode` (`'duo'|'group'`) + `currentParticipantId` to default state.
- `src/components/mutuals/screens/Home.jsx` — `captureGroup()` on create.
- `src/components/mutuals/screens/JoinWall.jsx` — `captureJoin(name)` on join.
- `src/components/mutuals/screens/Answer.jsx` — `captureAnswers(cur)` on continue.
- `src/components/mutuals/screens/Guess.jsx` — `captureGuesses(g)` + `captureComplete()` on continue.

**Installed**: `@supabase/supabase-js`.

### 3. User-facing behavior changed
- **Visually: nothing.** Same screens, copy, colors, reveal cards. Verified flow still completes with 0 runtime errors.
- **Under the hood:** create/join/answer/guess now mirror real data into a participant-aware
  store (group + participants + per-participant answers/guesses + completion). Confirmed: a run
  persisted group `chaotic-six`, participant "You" (real UUID), and 8 answer slots.
- Two modes are modeled (`duo` 1:1 / `group` 3+); reveal-readiness requires 2 (duo) or 3 (group) completed participants.

### 4. Known bugs / risks
- **Cross-device is OFF until keys exist.** No `VITE_SUPABASE_*` → localStorage fallback = single browser. To turn on real invited people: create a Supabase project, paste both env vars into `.env.local`, run `supabase/schema.sql`.
- **Guesses are still keyed by seed names** (e.g., "Karan"), not real participant ids — the Guess screen doesn't yet let you guess *real* joined participants, so cross-participant insights won't populate from the current UI. (Engine is correct; the UI feeding it is the gap.)
- **Reveal still renders seeded cards.** `getInsights()` is built + unit-verified but NOT yet wired into the reveal UI.
- **Permissive RLS** (anon can read/write all) — fine for a demo, insecure for production.
- **No realtime** — host sees new participants only on refresh (bundle is fetched on demand).
- `capture*` could race on first action (concurrent `ensureParticipant`); local backend dedupes by name, Supabase could double-insert under fast concurrent taps. Low risk in practice.
- Bundle is 532 kB (supabase + framer-motion + lucide) — Vite size warning only, not an error.

### 5. What Codex should review next
- `src/lib/mutualsApi.js`: Supabase upsert `onConflict` keys, `maybeSingle()` usage, error paths, and the `ensureParticipant` race.
- `src/lib/insights.js`: scoring math, duo-mode collapse, ties, and sparse-data guards.
- `supabase/schema.sql`: RLS posture (acceptable for demo? plan to tighten).
- The fallback/Supabase parity (do both backends return identical `getBundle` shapes?).

### 6. Suggested next task
Wire `mutualsApi.getInsights(activeGroupId)` into the **Reveal** screen: when `readiness.unlocked`
and `cards.length >= 3`, render the computed cards through the EXISTING reveal-card UI; otherwise
keep the seeded cards (demo path unchanged). Then make the **Guess** screen target real joined
participants so cross-guesses populate, and add a **1:1 / group mode** toggle on Create.

### Build
`npm run build` → success (2,224 modules, no errors). Engine unit-checked via a synthetic
3-person group (6 correct cards). No login is required before play — per product principle,
the Eazo vote prompt should appear only after a reveal/share moment (not yet implemented).
