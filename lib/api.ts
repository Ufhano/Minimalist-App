/**
 * API helper functions for Supabase operations
 */
import { supabase } from "./supabase";
import type { Database } from "@/types/database";

type UserProfile = Database["public"]["Tables"]["users_profile"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type App = Database["public"]["Tables"]["apps"]["Row"];
type UsageLog = Database["public"]["Tables"]["usage_logs"]["Row"];
type FocusSession = Database["public"]["Tables"]["focus_sessions"]["Row"];
type Streak = Database["public"]["Tables"]["streaks"]["Row"];

// ============ User Profile ============
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("users_profile")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data as UserProfile;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<UserProfile, "motivation_anchor" | "theme" | "onboarding_complete">>
) {
  const { data, error } = await supabase
    .from("users_profile")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data as UserProfile;
}

// ============ Profiles (Launcher profiles) ============
export async function getProfiles(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Profile[];
}

export async function createProfile(
  userId: string,
  profile: Omit<Profile, "id" | "user_id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("profiles")
    .insert({ user_id: userId, ...profile })
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(
  profileId: string,
  updates: Partial<Pick<Profile, "name" | "schedule_start" | "schedule_end" | "days_active">>
) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", profileId)
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function deleteProfile(profileId: string) {
  const { error } = await supabase.from("profiles").delete().eq("id", profileId);
  if (error) throw error;
}

// ============ Apps ============
export async function getApps(userId: string, profileId?: string | null) {
  let query = supabase.from("apps").select("*").eq("user_id", userId);
  if (profileId) {
    query = query.or(`profile_id.eq.${profileId},profile_id.is.null`);
  }
  const { data, error } = await query.order("app_name", { ascending: true });
  if (error) throw error;
  return data as App[];
}

export async function upsertApp(
  userId: string,
  app: Omit<App, "id" | "user_id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("apps")
    .upsert(
      { user_id: userId, ...app, updated_at: new Date().toISOString() },
      { onConflict: "user_id,package_name" }
    )
    .select()
    .single();
  if (error) throw error;
  return data as App;
}

export async function deleteApp(appId: string) {
  const { error } = await supabase.from("apps").delete().eq("id", appId);
  if (error) throw error;
}

// ============ Usage Logs ============
export async function logAppOpen(
  userId: string,
  params: {
    app_id?: string | null;
    app_name?: string;
    package_name?: string;
    intention?: string | null;
  }
) {
  const { data, error } = await supabase
    .from("usage_logs")
    .insert({
      user_id: userId,
      opened_at: new Date().toISOString(),
      intention: params.intention ?? null,
      app_id: params.app_id ?? null,
      app_name: params.app_name ?? null,
      package_name: params.package_name ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function logAppClose(
  logId: string,
  params: { duration_seconds: number; reflection?: string | null }
) {
  const { data, error } = await supabase
    .from("usage_logs")
    .update({
      closed_at: new Date().toISOString(),
      duration_seconds: params.duration_seconds,
      reflection: params.reflection ?? null,
    })
    .eq("id", logId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getUsageLogs(
  userId: string,
  fromDate: string,
  toDate: string
) {
  const { data, error } = await supabase
    .from("usage_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("opened_at", fromDate)
    .lte("opened_at", toDate)
    .order("opened_at", { ascending: false });
  if (error) throw error;
  return data as UsageLog[];
}

// ============ Focus Sessions ============
export async function startFocusSession(
  userId: string,
  sessionType: "pomodoro" | "deep" | "custom"
) {
  const { data, error } = await supabase
    .from("focus_sessions")
    .insert({
      user_id: userId,
      started_at: new Date().toISOString(),
      session_type: sessionType,
    })
    .select()
    .single();
  if (error) throw error;
  return data as FocusSession;
}

export async function endFocusSession(
  sessionId: string,
  durationMinutes: number
) {
  const { data, error } = await supabase
    .from("focus_sessions")
    .update({
      ended_at: new Date().toISOString(),
      duration_minutes: durationMinutes,
    })
    .eq("id", sessionId)
    .select()
    .single();
  if (error) throw error;
  return data as FocusSession;
}

// ============ Streaks ============
export async function upsertStreak(
  userId: string,
  date: string,
  totalMinutes: number,
  goalMet: boolean
) {
  const { data, error } = await supabase
    .from("streaks")
    .upsert(
      { user_id: userId, date, total_screen_time_minutes: totalMinutes, goal_met: goalMet },
      { onConflict: "user_id,date" }
    )
    .select()
    .single();
  if (error) throw error;
  return data as Streak;
}

export async function getStreaks(userId: string, fromDate: string, toDate: string) {
  const { data, error } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .gte("date", fromDate)
    .lte("date", toDate)
    .order("date", { ascending: false });
  if (error) throw error;
  return data as Streak[];
}
