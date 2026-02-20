/**
 * App list and launcher state (Zustand)
 */
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Database } from "@/types/database";

type App = Database["public"]["Tables"]["apps"]["Row"];

interface AppStoreState {
  apps: App[];
  activeProfileId: string | null;
  setApps: (apps: App[]) => void;
  addApp: (app: App) => void;
  updateApp: (id: string, updates: Partial<App>) => void;
  removeApp: (id: string) => void;
  setActiveProfileId: (id: string | null) => void;
  getAllowedApps: () => App[];
  getRestrictedApps: () => App[];
  cacheApps: (apps: App[]) => Promise<void>;
  loadCachedApps: () => Promise<App[]>;
}

const CACHE_KEY = "@minimalist_apps";

export const useAppStore = create<AppStoreState>((set, get) => ({
  apps: [],
  activeProfileId: null,

  setApps: (apps) => set({ apps }),

  addApp: (app) => set((state) => ({ apps: [...state.apps, app] })),

  updateApp: (id, updates) =>
    set((state) => ({
      apps: state.apps.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),

  removeApp: (id) =>
    set((state) => ({ apps: state.apps.filter((a) => a.id !== id) })),

  setActiveProfileId: (activeProfileId) => set({ activeProfileId }),

  getAllowedApps: () => {
    const { apps, activeProfileId } = get();
    return apps.filter(
      (a) =>
        a.category === "allowed" &&
        (!activeProfileId || a.profile_id === activeProfileId || !a.profile_id)
    );
  },

  getRestrictedApps: () =>
    get().apps.filter((a) => a.category === "restricted"),

  cacheApps: async (apps) => {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(apps));
    } catch {
      // ignore
    }
  },

  loadCachedApps: async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const apps = JSON.parse(cached) as App[];
        set({ apps });
        return apps;
      }
    } catch {
      // ignore
    }
    return [];
  },
}));
