/**
 * Platform-aware storage for Supabase Auth
 * Uses localStorage on web (avoids AsyncStorage "window is not defined" during SSR)
 * Uses AsyncStorage on native
 */
import { Platform } from "react-native";

export const supabaseStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (typeof window === "undefined") return null;
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (typeof window === "undefined") return;
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
      return;
    }
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (typeof window === "undefined") return;
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
      return;
    }
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    await AsyncStorage.removeItem(key);
  },
};
