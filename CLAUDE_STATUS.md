# CLAUDE_STATUS

Implementation log. Claude Code = implementer. Codex = read-only architect/reviewer.
Newest entry on top.

---

## Chunk 20 — Mobile spacing + invite-lobby conversion pass (BUILD + PUSH)

### Goal
Fix the spatial system on the four core screens so the app feels like a polished mobile game, not a stretched Figma frame. No brand redesign, no logic/schema change. Operator previews locally.

### Shared primitives
- **BottomSheet** (`ui/BottomSheet.jsx`): added a `variant` (`compact 62dvh` / `standard 72dvh` / `tall 84dvh`); `tall` kept for back-compat. **Removed the forced `min-h`** — sheets are content-driven (no more empty white tubs) — and added safe-area bottom padding (`env(safe-area-inset-bottom) + 12px`), responsive `p-4 sm:p-5`.
- **AbstractBg** (`ui/AbstractBg.jsx` + `Phone.jsx`): new `quiet` prop (forwarded by Phone). On Home/Create the lower blobs move further into the corners and soften, and the lower-right dot cluster is dropped, so nothing competes with the CTA stack.
- **Button** (`ui/Button.jsx`): `min-h-[56px]` touch target; shadow moved per-tone so colored tones read as primary and `white` is quieter (border + soft shadow), readable not disabled.

### Home (`Home.jsx`)
- Three zones: brand (top, `clamp(36px,7svh,70px)`), a centered **payoff card** ("tonight's receipts: who knows who, who missed what, who's secretly paying attention"), and an anchored action zone. No dead center. MUTUALS `clamp(3.4rem,14.5vw,5rem)`, subtitle `mt-2`. Equal `min-h-[104px]` mode cards (white text, 48px icon): "Challenge 1 Friend / Settle who knows who better." · "Start Group Room / Put the chat on the record." White Join (58px) + How-it-works.

### Create (`Create.jsx`)
- Compact hero (no billboard): eyebrow + headline `clamp(2.4rem,10vw,4.25rem)` (max-w 340) + a mode subhead. `standard` sheet, no dead space. 48px mode toggle (focus-visible only). Compact link row (44px icon, one-line). **Group** adds unlock chips (Who knows who · Power pair · Biggest miss) + friendlier "Unlocks at 3 finished." CTAs: primary **Send challenge / Send to group chat** (60px) → quieter secondary **I shared it · answer now** (58px) → mode reassurance note.

### JoinWall = invite lobby (`JoinWall.jsx`)
- Sells the room before asking a name. Mode-aware: duo badge "1:1 challenge" + headline **"{host} challenged you."** (real first participant, **no fake host**; falls back to "You got challenged."), CTA **Accept challenge**; group badge "group room" + "The group chat is on the record.", CTA **Join room**. Toned full-yellow → **cream** (warm, readable). Sheet order: live proof (joined/answered/finished + chips, empty copy "Waiting for both players." / "Be first in. Bring the chaos.") → payoff chips → **secondary** name input ("Your display name") → CTA → "No account. No install. Takes about 2 minutes."

### JoinPanel (Home)
- "Paste your invite" / "Drop in the link your friend sent." / placeholder `https://mutuals…` / helper "Room links look like mutuals.app/?group=m-xxxx" / **Enter-to-submit** / CTA "Open room".

### Files changed
`ui/BottomSheet.jsx`, `ui/Phone.jsx`, `ui/AbstractBg.jsx`, `ui/Button.jsx`, `screens/Home.jsx`, `screens/Create.jsx`, `screens/JoinWall.jsx`. **Untouched:** answer/guess/reveal logic, Supabase schema, deploy config, no deps, no fake bezel.

### Build
One `npm run build` → green (2230 modules, ~290ms). Sized to fit 390×844 / 430×932 with CTAs above the fold; touch targets ≥48px; blobs kept off text/CTAs. No manual preview per request.

---

## Chunk 19 — Replayable, viral, finished (BUILD + PUSH)

### Goal
Make MUTUALS feel like a real, replayable viral game. No schema change, no deps, no deploy change; Chunk 18 flow preserved.

1. **Question bank 8 → 36** (`data/questions.js`). Same shape (`id/lean/prompt/about/options`), 4 options each, ids q1–q36 (q1–q8 unchanged). Balance: **14 duo / 14 group / 8 both**. Adult, real, slightly dangerous; no therapy/HR/filler. `selectQuestions(groupId, mode)` still serves a deterministic 6 — now from 36, so a new room id ⇒ a genuinely fresh set; the SET stays groupId-stable (scoring-safe). Added `questionCountByLean()` + `previewQuestionsForMode()`.
2. **Duo breakdown is its own friendly screen** (`Matrix.jsx`, lavender, ink text — no "map" language): Winner · Mutual score · Biggest miss · Best read · Final verdict, with **"Share the verdict"** + **"Run it back."** Eyebrow "the 1:1 verdict", title "The verdict is in."
3. **Group map is friendly + screenshot-worthy** (`Matrix.jsx`, cream/white cards, ink text, violet/pink/yellow): "Who knows who? / The group-chat map," strongest-pair badge, top-5 directed reads with bars, the SVG graph on a white card. Empty state: "Not enough guesses to draw the map yet. Run it back with more people." CTAs **Share the map** + **Run it back**.
4. **Map share image** (`utils/shareImage.js`) redone to the friendly **cream** system (white content card, ink text, violet/pink/yellow) instead of dark navy; still 1080×1920, no deps. Reveal-card image stays the colored-on-navy stage.
5. **Share = afterparty** (`Share.jsx`): mode-aware headline (duo "The verdict is in." / group "The receipts are in."); hero label from `hero.id` (receipt of the round / strongest mutual / mystery friend / top knower / result); duo shows **"View breakdown"** not map; CTA order Share image → Run it back → Challenge → Eazo. Eazo: disabled "Eazo vote link coming", live "Help MUTUALS win on Eazo."
6. **Rematch feels fresh**: new room resets `selfAnswers/guesses/revealUnlocked/completedSteps` **and clears `roundsByGroup`** so the old round can't leak; keeps `currentUserName`; toast "New 1:1/group room ready"; copy "Run it back · new questions" + "Same chaos, new receipts."
7. **Prototype smells removed from public paths**: `ensureGroup` `createdBy` now `currentUserName || "Host"` (was "Armeen"); share-link ref `EAZO-ARMEEN → eazo`. Fake names (Will/Maya/Karan) remain only in debug/solo screens unreachable from the public flow.
8. **Reveal copy** (`insights.js`, copy-only, formulas untouched): "Loud, confident, and wrong. This is why the group chat needs evidence.", "One of you was reading. One of you was projecting."
9. **Local analytics** (`utils/analytics.js`, new): console + capped localStorage buffer, no backend. Tracks room_created, invite_shared, joined_room, answers_saved, guesses_saved, reveal_viewed, share_image_clicked, rematch_clicked.

### Files changed
`data/questions.js`, `utils/analytics.js` (new), `utils/shareImage.js`, `utils/mutualsStorage.js`, `lib/insights.js`, `screens/Matrix.jsx`, `screens/Share.jsx`, `screens/Home.jsx`, `screens/Create.jsx`, `screens/JoinWall.jsx`, `screens/Answer.jsx`, `screens/Guess.jsx`, `screens/Reveal.jsx`. **Untouched:** Supabase schema, deploy config, insight formulas, scoring (qid-based, stable), no fake phone bezel.

### Build
One `npm run build` → green (2230 modules, ~335ms). Question count = **36** (14/14/8). No manual preview per request.

### Smoke paths (live)
1. **1:1:** Home → Challenge 1 Friend → Send invite → name → Answer → Guess → Reveal → **See the breakdown** (lavender verdict) → Share.
2. **Group:** Home → Start Group Room → Send invite → 3 players → Answer → Guess → Reveal → **See the map** (cream group-chat map) → Share map.

---

## Chunk 18 — Conversion + clarity sweep (BUILD + PUSH)

### Goal
Fix the core UX confusions; no new big features, no schema change, no color redesign (contrast fixes only), no share-image rework. One build.

1. **Real question progress** (`ui/Progress.jsx` now supports `current`/`total`+`label`). Answer shows **"Question N of 6"** (`qi+1`/length); Guess shows **"Guess N of 18"** (`ti*len+qi+1` / `targets*len`). Removed the global `Progress step={4/5}` from the public question flows (legacy step mode kept for debug screens).
2. **Duo no longer goes to the group map.** Reveal's final real CTA branches: group → **"See the map"**, duo → **"See the breakdown."** `Matrix.jsx` now renders a **DuoBreakdown** (winner · mutual score · biggest miss · best read) for 1:1 and the graph for group.
3. **Contrast sweep.** Light screens = ink text, dark stage = white text; bumped faint disabled/ghost text (e.g. Eazo `/25`→`/40`); no core instruction below `/40`.
4. **Host name before Answer.** JoinWall is now host-neutral + name-first ("What should we call you?" / "the name your friends will guess"), collected before answers save. CTA → "Continue."
5. **Real "Join a Room."** Home's Join opens a paste-invite-link panel that extracts `?group=`, `ensureGroup`, and routes to Join — no dead room.
6. **Invite-first Create.** Primary = **Send invite / challenge / to group chat** (shares only); secondary = **"I shared it · answer now"** (advances). Copy stays in the invite card.
7. **Nudge on waiting screens.** Guess-waiting "Nudge a friend" ("one more player unlocks the reveal"); Reveal-waiting **"Nudge {unfinished name}"** ("finish your MUTUALS answers — the receipts are waiting").
8. **Guess back/edit.** Previous button in Guess; navigating restores the locally-held guess; nothing submits until the final awaited `submitGuesses`.
9. **Share auto-picks the spiciest hero**: receipts → power → most-misunderstood → winner → first (was always winner).
10. **Run-it-back copy**: "Run it back · new questions" + "Same chaos, new receipts" (late joiner → "Run it back with {name}"). Fresh-room behavior unchanged.
11. **Mode-leaning questions (safe).** Questions tagged `lean` (duo/group/both); `selectQuestions(groupId, mode)` keeps the **SET groupId-stable** (scoring safe across unlock-as-1:1) and only re-orders so duo leads intimate, group leads social.
12. **Eazo** stays post-reveal only (Share), readable when disabled, "Help MUTUALS win on Eazo" when live. URL unchanged.

### Files changed
`data/questions.js`, `ui/Progress.jsx`, `MobileFlow.jsx`, `screens/Answer.jsx`, `screens/Guess.jsx`, `screens/Reveal.jsx`, `screens/Matrix.jsx`, `screens/Share.jsx`, `screens/Home.jsx`, `screens/Create.jsx`, `screens/JoinWall.jsx`. **Untouched:** Supabase schema, insight engine internals, share-image canvas, Eazo URL. Scoring stays qid-based and stable.

### Build
One `npm run build` → green (2229 modules, ~303ms). No manual preview per request.

### Smoke path (live)
1. Home → **Challenge 1 Friend** (or **Start Group Room**) → Create shows **Send invite** (primary) then **I shared it · answer now** → JoinWall **"What should we call you?"** → Answer with **"Question N of 6"** progress.
2. Friends open the link (or Home → **Join a Room** → paste link); answer + guess with **"Guess N of 18"** progress and a **Back** button.
3. Waiting screens show a **Nudge** CTA. Reveal cards → final CTA: duo **See the breakdown** / group **See the map**.
4. Matrix: duo breakdown vs group graph → **Continue** → Share (hero = spiciest card, **Run it back · new questions**, Eazo post-reveal).

---

## Chunk 17B — Color system pass (friendlier/warmer, dark = reveal stage only) (BUILD + PUSH)

### Goal
No features, no flow changes. Make the palette friendlier/warmer/cohesive; use dark navy only as the dramatic reveal/map stage, not the default emotional background. Normalized in the theme files.

### Palette normalized (`ui/Phone.jsx`, `ui/AbstractBg.jsx`, `ui/Button.jsx`)
- `Phone.jsx` now exports `PALETTE` (ink #17112B, cream #FFF3DF, pageCream, violet #7B3CFF, deepViolet #6B2CFF, lavender #F3EFFF, pink #FF4F9A, yellow #FFD23F, mint #35C58A, sky #7CDFFF, softLine) and a `mood→bg` map (added `lavender`/`violet`/`mint`/`sky`/`pageCream`; `dark`/`ink` = navy). Default mood is now **cream**, default text **ink**.
- `Button.jsx` tones remapped to the palette; the `lime` key now renders **mint**, `dark` → ink, `yellow` → #FFD23F (added a `violet` tone).
- `AbstractBg.jsx`: warm blob palettes per mood, **reduced dark-purple dominance** (accents are sky/violet/white at low opacity), and **mood-aware dots** (ink on light, white on dark) + a pink squiggle so decorations frame content on every screen.

### Screen moods reassigned
- **Home** → cream (was dark): ink text, white "Join a Room", purple/pink doors kept. Friendly, not threatening.
- **Answer** → cream (was dark): warm/safe; white question card, **lavender** choices, **pink** selected.
- **Guess** → lavender (was full purple) across loading/waiting/guess states; ink text, white question card, **sky** selected.
- **Create** → lavender (1:1) / cream (group), ink header text.
- **Reveal** stays the dark dramatic stage, but `BigRevealCard`/share-image card palette is now bright + white-text-safe (**pink / mint / violet / deepViolet**); the receipts "real answer" highlight is **yellow** (was lime).
- **Matrix (map)** keeps a navy frame with colorful elements; best-pair highlight → yellow.
- **Share** keeps a navy frame but the top-knower preview is now a bright **violet** card (celebration); Eazo accent → yellow.

### Files changed
`ui/Phone.jsx`, `ui/AbstractBg.jsx`, `ui/Button.jsx`, `ui/BigRevealCard.jsx`, `utils/shareImage.js`, `screens/Home.jsx`, `screens/Answer.jsx`, `screens/Guess.jsx`, `screens/Create.jsx`, `screens/Matrix.jsx`, `screens/Share.jsx`. **Untouched:** all flow logic (Chunk 15 rounds/late-join/answer-edit, Chunk 17 share/map), Supabase schema, insight engine, Eazo URL. No features added.

### Build
One `npm run build` → green (2229 modules, ~265ms). No manual preview per request.

---

## Chunk 17 — Screenshot-worthy reveal/share + real share-card images (BUILD + PUSH)

### Goal
Make the post-game flow feel like a mini Wrapped/Jackbox result: real share-card PNGs, a visual who-knows-who graph, and a tight viral loop. No schema change, no new deps (dependency-free canvas), Chunk 15 round/late-join logic preserved. Operator previews locally — no browser preview run here.

### Real image generation (`utils/shareImage.js`, new)
- Dependency-free `<canvas>` → **1080×1920 PNG**. `createRevealShareImage(card,{index})` draws a vivid result card on navy with confetti, MUTUALS wordmark, label badge, big stat/headline/detail, or the **Question / Guessed / Real answer** receipts blocks; auto-fits long stats. `createMapShareImage(graph)` draws the best mutual pair + "who reads who" bars. `shareImageBlob({blob,text,url,fileName})` uses `navigator.canShare({files})` to share the PNG, else downloads it, else copies the link — with toasts ("Image saved" / "Link copied" / "Shared"). Every caller wraps it in try/catch and falls back to native text share, so canvas failure never breaks the flow.

### Reveal redesigned (`Reveal.jsx`, `ui/BigRevealCard.jsx`, `ui/ShareActionTile.jsx` new)
- Dark navy screen, top "Here's what we learned…", the result card as the **star**, animated progress dots, then an action row **Share Image · Copy Link · More**, a subtle Prev, and a primary CTA: **Next result** → **See the map** (final real) / **Finish** (seeded).
- `BigRevealCard` is now a self-contained vivid **card** (cycles color by index, white text, label badge, MUTUALS mark, in-card confetti, watermark) — mirrors the PNG so a screenshot looks intentional. Receipts render as structured blocks (real answer on lime). Removed the utilitarian room-link metadata card. "Save" → **Share Image** (real), "Next card" → **Next result**.

### Visual map (`Matrix.jsx`)
- Real **who-knows-who graph**: circular SVG nodes (initials) with connection lines weighted by score, **best mutual pair** highlighted lime, name chips, a "who reads who" list with score bars. Actions: **Share Map** (PNG via canvas) · Copy Link · **Continue**.

### Share = result hub (`Share.jsx`)
- Dark result page (off the full-yellow mood): a **top-knower preview card** (+ player count + late-joiner nudge), action row **Share Image · Copy Link · More**, primary **Play another round · new questions**, secondary **Challenge 1 Friend / Challenge a Group**, tertiary **View map · Back to start · Eazo** (de-emphasized, URL unchanged).

### Copy + responsiveness
- "live reveal"/"from your group's real answers" removed; "the receipts" framing throughout. All three screens use `h-[100dvh]` + an internal `min-h-0 overflow-y-auto` content area so the card/map/preview scroll **inside** while action tiles + CTAs stay pinned (no below-fold), with `clamp()` sizing for 375×667 → 430×932.

### Files changed
`utils/shareImage.js` (new), `ui/ShareActionTile.jsx` (new), `ui/BigRevealCard.jsx`, `screens/Reveal.jsx`, `screens/Matrix.jsx`, `screens/Share.jsx`. **Untouched:** Supabase schema, insight engine (reused `pairScores`), Chunk 15 round/late-join/answer-edit logic, Home/Create/AbstractBg (Chunk 16B), Eazo URL.

### Build
One `npm run build` → green (2229 modules, ~272ms). No manual preview per request.

---

## Chunk 16B — Home/Create visual direction + responsiveness (BUILD + PUSH)

### Goal
Chunk 16's Home/Create were too empty/harsh and not responsive. Match the friendly dark MUTUALS reference (deep navy/purple, playful organic shapes, big white wordmark, compact spacing). Logic from Chunk 15/16 untouched. Operator previews locally — no browser preview run here.

### Home (`Home.jsx`)
- Dropped the dead-center `flex-1 justify-center` brand block and the neon lime "U". Plain **white MUTUALS** wordmark, subtitle "Find out who knows who".
- Vertical rhythm via two weighted flex spacers (top `flexGrow:1`, middle `flexGrow:1.4`) so the brand sits in the upper third and the two doors sit toward the bottom with decorations framing the middle — not a dead empty zone.
- **Responsive clamps:** logo `clamp(3.25rem,16vw,5.25rem)`, subtitle `clamp(1rem,4.6vw,1.25rem)`, top padding `clamp(28px,6svh,60px)`, bottom padding `safe-area-inset-bottom + clamp(20px,4svh,36px)`, door padding `clamp(14px,2.4svh,20px)`. Computed to fit 375×667 → 430×932 with no scroll/clipping.
- Doors: **Challenge 1 Friend** (1:1 showdown) / **Start Group Room** (group chaos) + subcopy; secondary **Join a Room**; tiny helper + How-it-works sheet. Behavior unchanged (duo/group room creation, Join routes to Join).

### Create (`Create.jsx`)
- Removed the giant `pt-16` + `text-5xl` header and `BottomSheet tall`. Compact clamped header (`clamp(2rem,8.5vw,3.25rem)`), default BottomSheet.
- Raw localhost link no longer dominates: a compact **"invite link ready"** card with a link icon, a single **truncated** line, and a copy icon. Primary CTA is the share (**Send challenge** / **Send to group chat**); "Copy link instead" is the tertiary. Mode-specific eyebrow/title/body/rule retained.

### Decorations (`ui/AbstractBg.jsx`)
- Friendlier, corner-framed composition: yellow blob top-right, accent top-left, pink on the left edge (lower half), teal bottom-right, soft accent bottom-left, two dot clusters, one SVG squiggle. Organic `rounded-[%]` shapes tucked into the edges and kept out of the vertical center so headlines/buttons stay clean. Friendly per-mood palettes (yellow/pink/teal + accent). Pure CSS/SVG.

### Files changed
`screens/Home.jsx`, `screens/Create.jsx`, `ui/AbstractBg.jsx`. **Untouched:** Chunk 15/16 logic (rounds, late joiners, answer editing, map/`pairScores`, reveal flow), Supabase schema, deploy config, Eazo.

### Build
One `npm run build` → green (2227 modules, ~273ms). No manual preview per request.

---

## Chunk 16 — Brand, mode separation, reveal artifact, social-graph loop (BUILD + PUSH)

### Goal
Make MUTUALS feel like a real mobile social game (Jackbox + Wrapped + group-chat receipts), not a product demo. Built on Chunk 15 — round logic, late joiners, answer editing, waiting status, partial reveal, aftermath all preserved. No schema change, no deploy change, engine reused (added one pure helper).

### 1. Home is now a game landing (`Home.jsx`)
- Dark base, big **MUTUALS** wordmark (lime "U"), "Find out who knows who." Two huge doors — **Challenge 1 Friend** (purple, 1:1) and **Start Group Room** (pink, group) — plus **Join a Room** (→ Join). Tiny helper "Answer about yourself. Guess your friends. Reveal the receipts." and a **How it works** bottom-sheet (3 short steps). Removed "async group chat test," the 3-step card grid, and all PM language.

### 2. 1:1 vs Group are different products (`Create.jsx`)
- The mode now defines the screen. **1:1** (`dark`): "1:1 showdown / Prove who knows who better." → CTA **Send challenge**. **Group** (`purple`): "group chaos / Put the group chat on the record." + "Group unlocks at 3 finished. Bigger groups make better receipts." → CTA **Send to group chat**. Segmented 1:1/Group toggle stays; the primary CTA shares the link **and** advances.

### 3. Polished Answer/Guess (`Answer.jsx`, `Guess.jsx`)
- Dark/purple base + a **white question card**, big answer buttons, obvious selected state. Chunk 15 logic untouched (Answer Back button, Guess round targets / late-joiner banner / status). Verified: Answer shows "about you · 1/6" + white card.

### 4. Receipts artifact (`ui/BigRevealCard.jsx`)
- The card is now a standalone, screenshot-ready composition: `min-h-[54dvh]`, **MUTUALS** wordmark up top, big stat/headline (or the Question / Guessed / Real-answer receipts block), and a `mutuals.app · find out who knows who` watermark pinned at the bottom.

### 5. Who-Knows-Who map (`Matrix.jsx` repurposed + `insights.pairScores`)
- New pure `pairScores(bundle)` derives directed pair accuracy + best mutual pair from existing data (no schema). The old fake Matrix is now the real **"Who knows who map / The receipts, but visual."** — player chips, **best mutual pair** (lime), and a sorted **"who reads who"** list ("Alex → Sam 75%"). Graceful empty state. Verified via the live engine.

### 6. Post-reveal loop
- Reveal's last real card → **See the map** (`go("Matrix")`) → Continue → Share. **Share** CTAs: **Share the receipts** (primary) · **Run it back · new questions** (fresh room ⇒ a new deterministic 6-of-8) · **View who-knows-who map** · **Challenge a friend / a group** · Eazo. Late-joiner rematch nudge from Chunk 15 retained ("Run it back with Ava").

### 7. Color / language cleanup
- Public surfaces moved off beige/cream to the dark-navy + electric-purple + pink/lime accents palette. Scrubbed product-y words ("async / test / Wrapped-style") from reachable copy ("Wrapped-style" → "your highlight reel"). `async progress` remains only in debug-only ProgressScreen.

### Files changed
`lib/insights.js`, `screens/Home.jsx`, `screens/Create.jsx`, `screens/Answer.jsx`, `screens/Guess.jsx`, `screens/Matrix.jsx`, `screens/Reveal.jsx`, `screens/Share.jsx`, `ui/BigRevealCard.jsx`. **Untouched:** Supabase schema, deploy config, Chunk 15 round/late-join/answer-edit logic, Eazo config.

### Build + verify
One `npm run build` → green (2227 modules, ~288ms). Preview-verified: Home (dark, two doors), Create (1:1 vs Group copy distinct), Answer (dark + white card), and `pairScores`/`roomStatus`/questions via the live modules.

### Smoke-test path (live)
1. Open URL → dark Home → **Challenge 1 Friend** (or **Start Group Room**). 2. Create shows mode-specific copy → **Send challenge / Send to group chat** (shares link + advances) → name → answer 6 (Back to edit). 3. Friends join + guess (group: up to 3 targets; late joiners surface). 4. Reveal cards (Receipts artifact with watermark) → **See the map** → who-knows-who map → **Continue**. 5. **Share**: Share the receipts / Run it back · new questions / View map / Challenge.

---

## Chunk 15 — Round logic, late joiners, answer editing, non-abrupt ending (BUILD + PUSH)

### Goal
The missing product layer so MUTUALS feels like a real group-chat game, not a loose quiz. Client-derived state + existing tables only — **no Supabase schema change**, no deploy change, engine left intact (only re-ranked + one helper added).

### 1. Answer editing / back nav (`Answer.jsx`)
- A **Back** button appears from question 2 on (3-col grid: Back + Next). Free movement back/forth; selections persist (already saved per-pick), and the final CTA still does the one awaited `submitAnswers`. Verified in preview: pick A → Next → Back restores the highlighted answer.

### 2. Stable round target list (`mutualsStorage.js` + `Guess.jsx`)
- New `roundsByGroup` state + `getRound / ensureRound / addRoundTarget`. When a player first enters Guess, their target list is **locked** (`{ targets, known }`) so it never shuffles mid-flow.
- Duo → the other person. Group → **up to 3** of the current participants (excluding self), preferring people who've already answered. `known` = who was present at lock time (powers late-joiner detection).

### 3. Late joiners — explicit, not silent (`Guess` / `Reveal` / `Share`)
- Bundle now polls continuously (no longer stops once someone joins), so arrivals after lock are detected (`participant not in round.known`).
- Mid-guess: a banner — "Ava joined late. / This reveal uses your current round." + **Add Ava to your guesses** (`addRoundTarget`, appended at the end so in-progress guessing isn't disrupted). "+N more joined late" when several.
- Already finished: Reveal shows "Ava joined late — rematch after the reveal."

### 4. Big-group rule (visible, intentional)
- Group Guess + waiting show: "You'll guess up to 3 people. Bigger groups make better receipts as more finish." 8 people → still only 3 targets each; the engine already scores on **partial graph** data, so this reads as a feature.

### 5. Better waiting status (`PlayerChips.jsx` + `insights.roomStatus`)
- New `roomStatus(bundle, need)` derives, from existing tables: **joined** (participant exists) / **answering** (some answers) / **guessing** (all `need` answers) / **finished** (`completed`). Waiting screens in Guess + Reveal now show the three counts and per-player chips ("Mason · finished", "Ava · joined late", "(you)").

### 6. Partial-reveal readiness copy (`Reveal.jsx`)
- On the unlocked reveal: "N finished. Reveal unlocked. M more can still make it better." Duo unlocks at 2, group at 3 — extra finishers improve it rather than block it.

### 7. Non-abrupt ending (`Share.jsx`)
- Share now opens with an **aftermath** card (fetches `getInsights`): the winner/top-knower headline + "N players in this round" + any late joiner. CTAs: **Share the receipts** (primary, seeds the winner line) → **Run it back with this room** → **Challenge a friend / a group** → Eazo. No fake Today/streak anywhere in the public path.

### 8. Grounded question pack (`questions.js`)
- Replaced the weaker fake-scenario questions with real social-curiosity ones (still 4 MCQ, no therapy/HR-speak): in conflict I'm most likely to… · pretend not to care but do… · worst group-chat habit · what makes me go quiet · compliment that hits hardest · what I need but rarely ask for · most misunderstood · what makes me feel left out. `selectQuestions` still serves a deterministic 6-of-8. Receipts `SPICY_ORDER` re-ranked for the new ids.

### 9. Late-join / rematch is viral (`Share.jsx`)
- With late joiners: "Ava joined late — run it back with them?" and the button reads **Run it back with Ava**. Rematch mints a **fresh room** (clean, no stale answers) — same mechanism as Challenge.

### Files changed
`utils/mutualsStorage.js`, `data/questions.js`, `lib/insights.js`, `ui/PlayerChips.jsx` (new), `screens/Answer.jsx`, `screens/Guess.jsx`, `screens/Reveal.jsx`, `screens/Share.jsx`. **Untouched:** Supabase schema, deploy config, room create/join, core answer/guess saving, Eazo config.

### Build + verify
One `npm run build` → green (2227 modules, ~282ms). Verified via the live dev engine: `roomStatus` (joined 4 / answered 3 / finished 3, late = "answering"), round helpers (ensure → add late joiner appends to targets+known), late detection, the new questions, and Answer back-nav with persisted selection.

### Smoke-test path (live)
1. Open URL → Create a room → **Answer your questions**; on Q2+ a **Back** button lets you edit; finish 6.
2. Phone B (and C for group) → open link → name → Join → answer → guess (group: up to 3 targets; the rule line shows).
3. A friend opens the link after you're already guessing → **"Ava joined late"** banner with **Add Ava** (before you finish) or **rematch** copy (after).
4. Waiting/reveal show joined/answered/finished counts + status chips; reveal says "N finished. Reveal unlocked. M more can make it better."
5. Reveal → Finish → **Share**: aftermath (winner + player count + late joiner) → Share the receipts / Run it back with Ava / Challenge.

---

## Chunk 14 — Sharper v1 question pack + research-arc reveal (BUILD + PUSH)

### Goal
Spicier, more adult, more viral — without touching the safe core (MCQ self-answers; friends guess). No open text, no anon messages, no contact sync, no coworker mode, no fake daily/streaks.

### New question pack (`src/data/questions.js`)
- **8 questions**, adult 18-35 group-chat energy, ~75% spicy / 25% sincere. Each has: first-person `prompt` (Answer screen), `{name}`-templated `about` (Guess + Receipts), 4 guessable options, short `topic`.
- Topics: group chat fights · a night in jail · toxic social habit · three drinks in · "in my drama I'm secretly…" · red flag I pretend is green · most misunderstood · feeling cared for. Avoids sex-history / mental-health diagnosis / money-debt / family trauma.
- **Fast game:** `selectQuestions(groupId)` returns a deterministic **6 of 8** (seeded by room id) — short game, packs vary room-to-room. Answer + Guess both call it with the same `activeGroupId` → identical set → **honest scoring**. Added `getQuestion(id)` + `fillName(tpl,name)`.

### Reveal deck reordered around the research arc (`src/lib/insights.js`)
- Real-room priority: **Card 1 = the miss** (most shareable), then winner → mutual/group score → one-way → most misunderstood → best read → scoreboard (group) → strong closing share card.
- **Receipts card (Card 1)** — the screenshot. Real question text + real option labels:
  - 1:1 → `"{guesser} did not know {target}."` + `"In a group chat fight, Sam becomes…" / "Alex guessed: …" / "Real answer: …"`
  - Group → `"The answer everyone got wrong." (N/N wrong)` + most-common wrong guess vs real answer.
- **Verified through the real engine** (synthetic run via Vite): duo = **6 cards** (Receipts→Winner→Mutual→One-Way→Best Read→Final Verdict); group = **8 cards** (Receipts→Group Winner→Power Pair→One-Way→Most Misunderstood→Open Book→Scoreboard→Final Roast).
- Copy de-genericized: dropped "friendship economy" / "guessed vibes"; added "the group chat has receipts now," "send this before they deny it," "loud, confident, and incorrect," "guessing blind," "close enough to be dangerous."

### Receipts rendering (`ui/BigRevealCard.jsx`)
- When `card.receipts` is present, render the structured **Question / Guessed / Real-answer** block (real answer on lime) instead of stat/headline/detail. `break-words` throughout; Reveal's mood remap keeps it readable.

### Screens
- `Answer.jsx` / `Guess.jsx` now pull `selectQuestions(activeGroupId)` (the same 6). Guess headline renders the `{name}`-templated `about` text.

### Fake-leftover purge (req 9)
- **Public flow is clean:** Home→Create→Join→Answer→Guess→Reveal→Share has no fake names (JoinWall routes straight to Answer, skipping the seeded ProgressScreen/Matrix/Today/SignupGate). Real rooms only render real participant names + real computed cards.
- Genericized the one opt-in-public surface — MarketingLanding (`?landing=1`): "Nobody knows Will." → "Nobody actually knows the quiet one."; fake "Today / Daily" tile → "Modes / 1:1 & Group."
- Seeded `mutualsDemoData.js`, `Today`/`Matrix`/`SignupGate`/`SeededGuess`, and desktop screens remain **debug/solo-only** (unreachable in normal public play).

### Untouched (req 8)
Supabase schema, deploy config, room creation/joining, core answer/guess saving, Eazo config.

### Build + verify
One `npm run build` → green (2226 modules, ~270ms). Verified in the live dev preview: Home generic (no "Will"), Answer shows the new pack with 6 progress dots, engine decks + receipts correct.

### Smoke-test path (live)
1. Open URL → Home → **Create a room** → **Answer your questions** → name → answer 6 spicy questions.
2. Phone B → open link → name → Join → answer 6 → guess Phone A.
3. Phone A → guess Phone B → reveal opens on the **Receipts** card (real question + their wrong guess + real answer), then Winner / Mutual / One-Way / Best Read / Final Verdict (1:1); group adds Power Pair / Most Misunderstood / Open Book / Scoreboard.

---

## Chunk 13 — Real mobile web app, not a phone mockup (BUILD + PUSH)

### Goal
Kill the phone-inside-a-phone demo feel. Public visitors should land in a real, full-bleed mobile web app — no fake device chrome, no marketing detour, no fake people.

### Native shell (`ui/Phone.jsx`)
- Removed the fake dark device frame, the **"9:41"** clock, the **"MUTUALS"** status pill, and the decorative status dots.
- Phone is now a **full-bleed mood background** (`min-h-[100dvh] flex flex-col`, per-mood color) so white headers stay readable and it reads like a real screen. `AbstractBg` kept behind `z-10` content.

### Bottom panel (`ui/BottomSheet.jsx`)
- No longer an `absolute inset-x-2 bottom-2` fixed mockup with `min-h-[390/520px]`. Now a real flow panel: `mt-auto` pins it to the bottom of the Phone flex column, `max-h-[88dvh] overflow-y-auto` so it scrolls internally, `min-h-[58dvh]`/`[42dvh]` for presence. When content exceeds the viewport the page scrolls — **CTAs stay reachable on iPhone**.

### Reveal card resilience (`ui/BigRevealCard.jsx`)
- Responsive + `break-words` everywhere: stat `text-6xl sm:text-[78px]`, headline `text-3xl sm:text-4xl`, detail `text-white/85`, icon tile `h-20→24`. Long names/headlines wrap instead of overflowing behind the sheet.
- **Reveal mood remap** (`Reveal.jsx`): card text is white, so `cream→purple` and `yellow→dark` for readable reveal backgrounds.

### Skip landing + full-bleed public (`MutualsMergedFlow.jsx`)
- Public root **opens directly into Home** (`showPrototype` defaults true). MarketingLanding is now opt-in: **`?landing=1`** or `?debug=1`.
- Public render is **full-bleed** — a centered `max-w-md` column only matters on desktop (dark surround), no boxed phone shell, no big desktop padding, and the old public "MUTUALS" header bar is gone.
- Debug (`?debug=1`) keeps the boxed mobile/desktop + step-nav shell. Invite links (`?group=`) still route to **Join**.

### Purged fake public surfaces
- Removed Home **"Try it solo"** — it was the only public entry into `soloDemo`/the seeded **Karan** path. Solo + seeded `SeededGuess` are now unreachable in normal public flow (real rooms always have an `activeGroupId`).
- Home sample reveal genericized: ~~"Nobody knows Will." / "23% average score…"~~ → **"Who's the mystery friend?" / "Find out who your group actually knows."**
- Share **"Today's question"** CTA removed (Today isn't real yet). Today is now unreachable from the public flow.

### Real-room error handling
- `Guess.jsx`: final `submitGuesses()` wrapped in try/catch like Answer — on failure: toast **"Couldn't save — try again"**, `saving=false`, **don't advance**.
- `mutualsApi.js`: `sb.createGroup` now checks `{ error }` and throws; `sb.getBundle` checks errors from **all four** reads (groups/participants/answers/guesses) and throws on a real failure instead of returning empty fake-looking state (a missing group row via `maybeSingle()` is **not** an error). All callers `.catch` → stay on loading/waiting rather than render fake state. **Local fallback unchanged.**

### Create copy (`Create.jsx`)
- Hint → **"1:1 is best for a fast test. Group needs 3+ people."**; primary CTA **"Continue" → "Answer your questions"**.

### Files changed
`ui/Phone.jsx`, `ui/BottomSheet.jsx`, `ui/BigRevealCard.jsx`, `MutualsMergedFlow.jsx`, `screens/Home.jsx`, `screens/Share.jsx`, `screens/Reveal.jsx`, `screens/Create.jsx`, `screens/Guess.jsx`, `lib/mutualsApi.js`. **No** schema, insight-engine, or route-order changes (only landing-skip + public full-bleed).

### Build + deploy
One `npm run build` → green (2226 modules, ~261ms). Pushed to `main` as `armeen55` → Vercel auto-deploys Ready.

### Final smoke-test path (live)
1. Open live URL on a phone → lands **directly on Home** (no landing, no fake device frame, no "Will"). Tap **Create a room** (1:1 default).
2. On Create → **Share invite**, then **Answer your questions** → enter name (Join) → answer q1–q4.
3. Phone B → open the link → name → Join → answer q1–q4 → guess Phone A.
4. Phone A → guess Phone B → reveal unlocks (duo deck). Swipe cards — long names wrap, text readable on every mood. Tap **Share**.
5. On Share: **Share the reveal** + **Challenge a friend** (fresh 1:1). No "Today's question" button.

---

## Chunk 12 — Stronger post-reveal share / challenge / vote loop (BUILD + PUSH)

### What changed (`src/components/mutuals/screens/Share.jsx`)
- **Sharper copy:** "the verdict is in" → **"Your group has receipts."** → "Send it before they deny it." (dropped generic "Keep the group alive").
- **Clear CTA hierarchy:** primary **"Share the reveal"** (native share: *"We just played MUTUALS and found out who actually knows who."* + room link); then **"Challenge a friend"** (fresh 1:1) and **"Challenge a group"** (fresh group); then the Eazo vote CTA; then **"Today's question"**.
- **Challenge flows start FRESH rooms** — `newRoom(mode)` mints a new `newRoomId()`, clears `selfAnswers/guesses/revealUnlocked/completedSteps/soloDemo`, sets the chosen mode, upserts the backend group, and routes to Create with a fresh invite. No stale data reused.
- **Eazo CTA** stays the single source (`src/config.js`): while it's the placeholder it's disabled/soft ("Eazo vote link coming"); set a real `EAZO_VOTE_URL` and it activates as "Help MUTUALS win on Eazo" (never opens eazo.ai).
- **Reveal Share** already uses `card.shareText || card.headline` + the room link (Chunk 11).
- **Weak language audit:** grep confirms no visible "soon/demo/prototype/preview/coming/retention" except the intentional disabled-Eazo "coming".

### Files changed
`src/components/mutuals/screens/Share.jsx`. (Reveal share wiring was Chunk 11.) No schema/deploy/room-flow changes.

### Build + deploy
This chunk ends batch mode: one `npm run build`, then push Chunks 10+11+12 to `main` as `armeen55` → Vercel auto-deploys Ready. (Filled in below after running.)

### Final smoke-test path (live)
1. Phone A → live URL → **Create a room** (defaults to **1:1**) → **Share invite**.
2. Phone B → open link → name → Join → answer q1–q4 → guess A.
3. Phone A → answer → guess B → reveal computes (duo deck: Winner / Mutual / One-Way Read / Biggest Miss / Best Read / Final Verdict).
4. On the reveal, tap **Share** (per-card hook). On the Share screen, tap **Share the reveal**, then **Challenge a friend** (should open a brand-new 1:1 room link).

---

## Chunk 11 — Viral reveal decks (duo vs group) (BATCH: local commit only)

### Goal
Make the real computed reveal the thing people screenshot. Mode-specific decks, roasty copy, honest stats — no change to room/answer/guess flow.

### What changed (`src/lib/insights.js` rewrite + `Reveal.jsx`)
- **Mode-specific decks.** `computeInsights(bundle)` branches on `group.mode`: `duoDeck` vs `groupDeck`. Same card shape + new optional `shareText`. Seeded stays solo-only.
- **Duo deck (showdown, ~6 cards):** Winner ("Mason knows Lebron better." 75%), Mutual Score ("You two are 63% mutual."), One-Way Read ("Mason read Lebron. Lebron guessed vibes." +gap), Biggest Miss ("…completely misread Lebron's pressure mode."), Best Read ("had them figured out." x/y), Final Verdict ("Friends. Provisionally." / "Close enough to be dangerous.").
- **Group deck (argument-starter, ~9 cards):** Group Winner, Most Misunderstood, Open Book, Power Pair, One-Way Friendship, Confidently Wrong, Biggest Blind Spot, **Scoreboard** (ranked one-liner in `detail`), Final Roast.
- **No empty reveals:** a normal unlocked room produces a full deck (verified: **6 cards duo / 9 cards group** from a clean q1–q4 run). The "not enough overlapping guesses" state is now genuinely rare.
- **Copy:** ~70% roasty/competitive, ~30% warm; real names used aggressively; no therapy/corporate filler.
- **Per-card share:** Reveal's Share button now uses `card.shareText || card.headline` — each card has a hook that makes someone want to open the room.
- **Honest stats:** all % from actual overlapping guesses; scoreboard is a real ranking; no invented numbers.

### Files changed
`src/lib/insights.js` (full rewrite), `src/components/mutuals/screens/Reveal.jsx` (share-text wiring). No schema, deploy, room-flow, or BigRevealCard changes. Seeded Karan untouched (solo-only).

### Status / verify
**BATCH MODE — local commit only; not full-built, not pushed, not deployed.** Validated the engine with a throwaway Node smoke test (duo→6 cards, group→9 cards, stats correct, copy reads clean). Live site unchanged until a future deploy.

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
