/**
 * Onboarding Step 2 - App audit (simplified - just info)
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { TextButton } from "@/components/TextButton";
import { spacing, typography } from "@/constants/theme";

export default function OnboardingAppAudit() {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App audit</Text>
      <Text style={styles.subtitle}>
        After setup, go to Settings → App Manager to choose which apps appear
        on your home screen. You can mark them as allowed, restricted (with
        limits), or blocked.
      </Text>
      <TextButton
        title="Next"
        onPress={() => router.push("/onboarding/limits")}
        variant="primary"
      />
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.xl,
      paddingTop: spacing.xxl,
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
      lineHeight: 24,
    },
  });
}
