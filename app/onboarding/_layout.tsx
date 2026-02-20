/**
 * Onboarding layout - 5-step flow
 */
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="values" />
      <Stack.Screen name="app-audit" />
      <Stack.Screen name="limits" />
      <Stack.Screen name="theme" />
      <Stack.Screen name="done" />
    </Stack>
  );
}
