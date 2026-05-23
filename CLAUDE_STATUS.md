# CLAUDE_STATUS

Implementation log. Claude Code = implementer. Codex = read-only architect/reviewer.
Newest entry on top.

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
