/**
 * Root index - redirects based on auth and onboarding state
 */
import { useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { useSettingsStore } from "@/stores/settingsStore";

export default function Index() {
  const { user, isLoading } = useAuthStore();
  const onboardingComplete = useSettingsStore((s) => s.onboardingComplete);

  if (isLoading) {
    return null;
  }

  // Not onboarded -> onboarding
  if (!onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  // Not logged in -> main app (anonymous usage allowed)
  if (!user) {
    return <Redirect href="/(tabs)/home" />;
  }

  // Logged in and onboarded -> main app
  return <Redirect href="/(tabs)/home" />;
}
