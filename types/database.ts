/**
 * Supabase Database Types
 * Generate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
 * Or maintain manually for local development.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users_profile: {
        Row: {
          id: string;
          motivation_anchor: string | null;
          theme: "light" | "dark";
          onboarding_complete: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          motivation_anchor?: string | null;
          theme?: "light" | "dark" | "grayscale";
          onboarding_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          motivation_anchor?: string | null;
          theme?: "light" | "dark" | "grayscale";
          onboarding_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          schedule_start: string | null;
          schedule_end: string | null;
          days_active: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          schedule_start?: string | null;
          schedule_end?: string | null;
          days_active?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          schedule_start?: string | null;
          schedule_end?: string | null;
          days_active?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      apps: {
        Row: {
          id: string;
          user_id: string;
          app_name: string;
          package_name: string;
          category: "allowed" | "restricted" | "blocked";
          daily_limit_minutes: number | null;
          profile_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          app_name: string;
          package_name: string;
          category: "allowed" | "restricted" | "blocked";
          daily_limit_minutes?: number | null;
          profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          app_name?: string;
          package_name?: string;
          category?: "allowed" | "restricted" | "blocked";
          daily_limit_minutes?: number | null;
          profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_logs: {
        Row: {
          id: string;
          user_id: string;
          app_id: string | null;
          opened_at: string;
          closed_at: string | null;
          intention: string | null;
          reflection: string | null;
          duration_seconds: number | null;
          app_name: string | null;
          package_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          app_id?: string | null;
          opened_at: string;
          closed_at?: string | null;
          intention?: string | null;
          reflection?: string | null;
          duration_seconds?: number | null;
          app_name?: string | null;
          package_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          app_id?: string | null;
          opened_at?: string;
          closed_at?: string | null;
          intention?: string | null;
          reflection?: string | null;
          duration_seconds?: number | null;
          app_name?: string | null;
          package_name?: string | null;
          created_at?: string;
        };
      };
      focus_sessions: {
        Row: {
          id: string;
          user_id: string;
          started_at: string;
          ended_at: string | null;
          duration_minutes: number | null;
          session_type: "pomodoro" | "deep" | "custom";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          started_at: string;
          ended_at?: string | null;
          duration_minutes?: number | null;
          session_type?: "pomodoro" | "deep" | "custom";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          started_at?: string;
          ended_at?: string | null;
          duration_minutes?: number | null;
          session_type?: "pomodoro" | "deep" | "custom";
          created_at?: string;
        };
      };
      streaks: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          total_screen_time_minutes: number;
          goal_met: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          total_screen_time_minutes?: number;
          goal_met?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          total_screen_time_minutes?: number;
          goal_met?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
