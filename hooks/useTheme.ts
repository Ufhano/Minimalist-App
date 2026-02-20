/**
 * Theme hook based on settings store
 */
import { useSettingsStore } from "@/stores/settingsStore";
import { theme } from "@/constants/theme";

export function useTheme() {
  const themeMode = useSettingsStore((s) => s.theme);
  return theme[themeMode];
}
