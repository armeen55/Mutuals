import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// When keys are absent we fall back to localStorage (demo-safe, single-browser).
export const isSupabaseEnabled = Boolean(url && key);
export const supabase = isSupabaseEnabled ? createClient(url, key) : null;
