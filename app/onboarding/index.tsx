/**
 * Onboarding Step 0 - Welcome
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { TextButton } from "@/components/TextButton";
import { spacing, typography } from "@/constants/theme";

export default function OnboardingWelcome() {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minimalist</Text>
      <Text style={styles.subtitle}>
        Less screen time. More of what matters.
      </Text>
      <TextButton
        title="Get started"
        onPress={() => router.push("/onboarding/values")}
        variant="primary"
      />
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
      fontSize: typography.fontSizes.xxl,
      fontWeight: typography.fontWeights.medium,
      color: theme.text,
      marginBottom: spacing.md,
    },
    subtitle: {
      fontSize: typography.fontSizes.lg,
      color: theme.textSecondary,
      marginBottom: spacing.xxl,
    },
  });
}
