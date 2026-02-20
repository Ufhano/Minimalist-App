/**
 * App configuration constants
 */
export const APP_SCHEME = "minimalistappv1";

export const FOCUS_SESSION_TYPES = {
  pomodoro: { duration: 25, label: "Pomodoro" },
  deep: { duration: 90, label: "Deep Work" },
  custom: { duration: 30, label: "Custom" },
} as const;

export const DEFAULT_DAILY_GOAL_MINUTES = 120;

export const ONBOARDING_STEPS = 5;
