/**
 * Onboarding Step 5 - Done
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTheme } from "@/hooks/useTheme";
import { TextButton } from "@/components/TextButton";
import { colors, spacing, typography } from "@/constants/theme";

export default function OnboardingDone() {
  const router = useRouter();
  const theme = useTheme();
  const setOnboardingComplete = useSettingsStore((s) => s.setOnboardingComplete);
  const persist = useSettingsStore((s) => s.persist);

  const handleDone = (withAuth: boolean) => {
    setOnboardingComplete(true);
    persist();
    if (withAuth) {
      router.replace("/(auth)/login");
    } else {
      router.replace("/(tabs)/home");
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You're all set</Text>
      <Text style={styles.subtitle}>
        Sign in to sync across devices, or continue without an account.
      </Text>
      <View style={styles.buttonWrapper}>
        <TextButton
          title="Sign in"
          onPress={() => handleDone(true)}
          variant={theme.background === colors.black ? "light" : "primary"}
          fullWidth
        />
        <View style={styles.spacer} />
        <TextButton
          title="Continue without account"
          onPress={() => handleDone(false)}
          variant={theme.background === colors.black ? "outlineLight" : "outline"}
          fullWidth
        />
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: spacing.xl,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.medium,
      color: theme.text,
      marginBottom: spacing.sm,
    },
    subtitle: {
      fontSize: typography.fontSizes.md,
      color: theme.textSecondary,
      marginBottom: spacing.xl,
    },
    spacer: {
      height: spacing.md,
    },
    buttonWrapper: {
      width: "100%",
      maxWidth: 280,
      alignSelf: "center",
    },
  });
}
