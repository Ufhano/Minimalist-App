/**
 * Supabase Client Configuration
 * Uses environment variables for URL and anon key.
 * Uses platform-aware storage to avoid "window is not defined" on web/SSR.
 */
import { createClient } from "@supabase/supabase-js";
import { supabaseStorage } from "./storage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
