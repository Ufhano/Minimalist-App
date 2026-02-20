/**
 * Onboarding Step 3 - Set daily limits
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { TextButton } from "@/components/TextButton";
import { spacing, typography } from "@/constants/theme";

export default function OnboardingLimits() {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set limits</Text>
      <Text style={styles.subtitle}>
        You can set daily time limits per app in App Manager. For restricted
        apps, you'll be prompted to state your intention before opening.
      </Text>
      <TextButton
        title="Next"
        onPress={() => router.push("/onboarding/theme")}
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
