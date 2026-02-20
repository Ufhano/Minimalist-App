/**
 * User settings store (Zustand) - offline-first with AsyncStorage
 */
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeMode = "light" | "dark";

interface SettingsState {
  theme: ThemeMode;
  motivationAnchor: string;
  onboardingComplete: boolean;
  hideNotificationBadges: boolean;
  dndEnabled: boolean;
  dndStart: string;
  dndEnd: string;
  dailyGoalMinutes: number;
  setTheme: (theme: ThemeMode) => void;
  setMotivationAnchor: (anchor: string) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setHideNotificationBadges: (enabled: boolean) => void;
  setDnd: (enabled: boolean, start?: string, end?: string) => void;
  setDailyGoalMinutes: (minutes: number) => void;
  loadFromStorage: () => Promise<void>;
  persist: () => Promise<void>;
}

const STORAGE_KEY = "@minimalist_settings";

const defaults = {
  theme: "light" as ThemeMode,
  motivationAnchor: "",
  onboardingComplete: false,
  hideNotificationBadges: false,
  dndEnabled: false,
  dndStart: "22:00",
  dndEnd: "07:00",
  dailyGoalMinutes: 120,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaults,

  setTheme: (theme) => set({ theme }),
  setMotivationAnchor: (motivationAnchor) => set({ motivationAnchor }),
  setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),
  setHideNotificationBadges: (hideNotificationBadges) => set({ hideNotificationBadges }),
  setDnd: (dndEnabled, dndStart, dndEnd) =>
    set({
      dndEnabled,
      ...(dndStart && { dndStart }),
      ...(dndEnd && { dndEnd }),
    }),
  setDailyGoalMinutes: (dailyGoalMinutes) => set({ dailyGoalMinutes }),

  loadFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const theme = parsed.theme === "grayscale" ? "light" : parsed.theme;
        set({ ...defaults, ...parsed, theme });
      }
    } catch {
      // ignore
    }
  },

  persist: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          theme: state.theme,
          motivationAnchor: state.motivationAnchor,
          onboardingComplete: state.onboardingComplete,
          hideNotificationBadges: state.hideNotificationBadges,
          dndEnabled: state.dndEnabled,
          dndStart: state.dndStart,
          dndEnd: state.dndEnd,
          dailyGoalMinutes: state.dailyGoalMinutes,
        })
      );
    } catch {
      // ignore
    }
  },
}));
