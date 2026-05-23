import {
  Eye,
  Flame,
  Heart,
  HeartCrack,
  Lock,
  MessageCircle,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

export const REF_URL = "mutuals.app/g/chaotic-six?ref=EAZO-ARMEEN";
export const ROOM_CODE = "MUT-42";

export const members = [
  { name: "Armeen", emoji: "⚡", bg: "#ff4f9a", fg: "#fff", answered: 8, guessed: 9, status: "done" },
  { name: "Will", emoji: "🧢", bg: "#7cdfff", fg: "#071b27", answered: 8, guessed: 9, status: "done" },
  { name: "Karan", emoji: "🎯", bg: "#ffd25e", fg: "#231509", answered: 8, guessed: 8, status: "guessing" },
  { name: "Coen", emoji: "🛸", bg: "#b794ff", fg: "#1c0c38", answered: 8, guessed: 9, status: "done" },
  { name: "Maya", emoji: "🪩", bg: "#7be495", fg: "#0b2311", answered: 4, guessed: 0, status: "stuck" },
  { name: "Leo", emoji: "🌶️", bg: "#ff8b5e", fg: "#2b0b00", answered: 0, guessed: 0, status: "pending" },
];

export const steps = [
  "Home",
  "Create",
  "Join",
  "Progress",
  "Answer",
  "Guess",
  "Reveal",
  "Signup",
  "Matrix",
  "Share",
  "Today",
];

export const insightCards = [
  { id: "group", label: "Group Score", stat: "64%", headline: "Your group is close. Not accurate.", detail: "Enough history to talk trash. Not enough accuracy to be proud.", accent: "#b794ff", icon: Users, mood: "purple" },
  { id: "glue", label: "Group Glue", stat: "73%", headline: "Maya understands the most people here.", detail: "Quietly carrying the friendship economy.", accent: "#7be495", icon: Heart, mood: "cream" },
  { id: "power", label: "Power Pair", stat: "87%", headline: "Armeen + Karan know each other best.", detail: "Highest mutual score in the group. Suspiciously accurate.", accent: "#d7ff2f", icon: Trophy, mood: "dark" },
  { id: "signup", label: "Full Report", stat: "7 left", headline: "Unlock the rest of the reveal.", detail: "The first three cards are free. Sign up to see the brutal cards, matrix, and daily group questions.", accent: "#ff4f9a", icon: Lock, mood: "yellow", locked: true },
  { id: "stranger", label: "The Stranger", stat: "23%", headline: "Nobody knows Will.", detail: "Average score guessing Will's answers. Will, are you okay?", accent: "#7cdfff", icon: Eye, mood: "purple" },
  { id: "delusional", label: "Delusional One", stat: "31%", headline: "Coen thought he knew everyone. He finished last.", detail: "Confidence was high. Accuracy was not invited.", accent: "#ffbd00", icon: Zap, mood: "yellow" },
  { id: "oneway", label: "One-Way Street", stat: "+29", headline: "Karan knows Armeen. Armeen does not know Karan.", detail: "A brutal asymmetry. The chat will discuss this.", accent: "#ff4f9a", icon: HeartCrack, mood: "yellow" },
  { id: "mismatch", label: "Mismatch", stat: "5 wrong", headline: "Everyone guessed loud chewing. Real answer: slow walkers.", detail: "The group was loud, confident, and completely wrong.", accent: "#ff765e", icon: MessageCircle, mood: "cream" },
  { id: "telepath", label: "Telepath", stat: "9/10", headline: "Karan guessed Armeen almost perfectly.", detail: "At some point this stops being friendship and starts being surveillance.", accent: "#7cdfff", icon: Sparkles, mood: "purple" },
  { id: "final", label: "Final Roast", stat: "THE END", headline: "Will is officially the mystery friend.", detail: "Send him this card. Or retest the group tomorrow.", accent: "#d7ff2f", icon: Flame, mood: "dark" },
];

export const matrixRows = [
  ["—", "78", "62", "44"],
  ["81", "—", "57", "48"],
  ["91", "66", "—", "71"],
  ["35", "41", "38", "—"],
];
