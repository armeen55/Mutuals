# MUTUALS — Migration Handoff

The UI now lives in **one self-contained feature folder** (`src/components/mutuals/`) plus 2 shared data/util files. Everything else is standard scaffolding.

## 1. Files to copy (to move the UI anywhere)
| Path | What it is | Required? |
|------|-----------|-----------|
| `src/components/mutuals/` | The whole feature: shell + screens + ui primitives + desktop. Entry = `MutualsMergedFlow.jsx` (default export). | **Yes** (whole folder) |
| `src/data/mutualsDemoData.js` | All static content: `members`, `steps`, `insightCards`, `matrixRows`, `REF_URL`, `ROOM_CODE`. | **Yes** |
| `src/utils/ui.js` | `cx()` classname helper + tiny toast pub/sub. | **Yes** |
| `src/utils/mutualsStorage.js` | localStorage state layer + invite-link / URL helpers. | **Yes** |
| `src/App.jsx` | Example entry that renders the component. | Optional (reference) |
| `src/index.css` | `@import "tailwindcss";` | Only if target lacks Tailwind |

Folder layout inside `src/components/mutuals/`:
```
mutuals/
  MutualsMergedFlow.jsx   <- default export (sticky shell + view/step state)
  MarketingLanding.jsx
  MobileFlow.jsx
  useMutuals.js           <- hook: subscribes to mutualsStorage
  ui/                     <- AbstractBg, Button, Avatar, Phone, BottomSheet, Progress,
                             PlayerProgressRow, ActionTile, QuestionPanel, BigRevealCard, CheckDot, Toast
  screens/                <- Home, Create, JoinWall, ProgressScreen, Answer, Guess,
                             Reveal, SignupGate, Matrix, Share, Today
  desktop/                <- DesktopApp, DesktopMain, TwoColHero, DesktopCreate, DesktopJoin,
                             DesktopProgress, DesktopReveal, DesktopSignup, DesktopMatrix, DesktopShare, DesktopToday
```

Copy the `mutuals/` folder + `mutualsDemoData.js` + `ui.js` + `mutualsStorage.js` into any React project. That's the migration.

## 2. Dependencies required
- `react`, `react-dom`
- `lucide-react` (icons)
- `framer-motion` (screen + toast animation)
- **Tailwind CSS** (all styling is Tailwind utility classes — this is mandatory, see Risks)

## 3. Install command
```bash
npm install react react-dom lucide-react framer-motion
# Tailwind (Vite target): 
npm install -D tailwindcss @tailwindcss/vite
# then add @tailwindcss/vite to vite plugins and `@import "tailwindcss";` to your CSS
```

## 4. Entry point
```jsx
import MutualsMergedFlow from "./components/mutuals/MutualsMergedFlow";

export default function App() {
  return <MutualsMergedFlow />;
}
```
`MutualsMergedFlow` is a **default export**, self-contained, no props, no router required. It manages its own state (`showPrototype`, `view`, `step`); per-screen state lives in `mutualsStorage` via the `useMutuals()` hook.

## 5. Current real-ish browser functionality (localStorage, NO backend)
These actually work and persist in `localStorage` (key `mutuals.state.v1`, via `src/utils/mutualsStorage.js`). Components read state through the `useMutuals()` hook (`src/components/mutuals/useMutuals.js`).
- **localStorage state layer** — `loadMutualsState()`, `saveMutualsState(next)`, `resetMutualsState()`.
- **Invite URL detection** — opening `?group=<id>` (or `#/g/<id>`) boots straight into the Join wall for that group.
- **Real-ish group creation** — "Create async group" / "Copy link" create a group (default `chaotic-six`) and copy a real openable link (`?group=<id>`).
- **Join** — sets `currentUserName` (prompt with safe fallback to "You") and adds you to `groupMembers`.
- **Answer / Guess persistence** — your selection saves; remaining slots auto-fill so the reveal can unlock.
- **Reveal unlock** — locked until you've answered + guessed (or used solo demo); otherwise routes you back to Answer.
- **Signup unlock** — "Sign up and continue" sets `signedUp = true`; cards 4–10 + Matrix stay unlocked and the gate does not reappear.
- **Post-reveal actions** — Rematch resets answers/guesses; Send Will / Challenge copy prewritten messages with the link; Today routes.
- **Today** — adapts copy/CTA based on whether the group has played.
- **Demo reset** — "Reset demo" (top shell) clears localStorage and returns to Landing.
- **Clipboard** — copy/share writes are real; PNG export + native share sheet are still toast stubs.

## 6. What still needs a backend later (not built yet)
- **real auth** — current signup is a localStorage flag; the real vote action needs a real account.
- **server-side groups + invites** — per-browser only today; a friend opening your link gets a fresh local group, not your data.
- **cross-device answer/guess storage** — everything currently lives in one browser.
- **real reveal generation** — the 10 cards + matrix are seeded, not computed from real answers.
- **share image / PNG export** — currently a toast stub.

## 7. How to preserve the UI (do NOT change)
- Do **not** change the color palette (cream `#f5f0e8`, purple `#6b2cff`, pink `#ff4f9a`, lime `#d7ff2f`, yellow `#ffbd00`, blue `#7cdfff`).
- Do **not** change the typography (huge black weights, tight tracking).
- Do **not** remove `AbstractBg` (the blob backgrounds).
- Do **not** remove the rounded mobile phone frame (`Phone` component).
- Do **not** remove the desktop dashboard (`DesktopApp`).

## 8. Fast migration checklist
- [ ] Copy the `src/components/mutuals/` folder + `src/data/mutualsDemoData.js` + `src/utils/ui.js` + `src/utils/mutualsStorage.js` (keep the same relative paths, or fix the imports)
- [ ] Install deps (section 3)
- [ ] Ensure Tailwind is configured and scanning the copied files
- [ ] Import `mutuals/MutualsMergedFlow` into the target route/page
- [ ] Confirm the default export renders
- [ ] Smoke-check: landing loads, "Open prototype" works, mobile/desktop toggle works

## Risks
1. **Tailwind is mandatory.** The UI is 100% Tailwind utility classes (incl. arbitrary values like `bg-[#6b2cff]`, `rounded-[42px]`). On a target without Tailwind configured to scan these files, it will render **unstyled**. This is the only real migration trap.
2. Inline `style={{ background }}` is used for blob shapes / card accents — framework-agnostic, copies fine.
3. No router/SSR assumptions — but if moving to Next.js App Router, add `"use client"` at the top of `components/mutuals/MutualsMergedFlow.jsx` (the screens/hook all use `useState`/`useEffect`; marking the entry makes the whole imported subtree client).
