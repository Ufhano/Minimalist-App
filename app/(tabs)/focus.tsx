/**
 * Focus / Pomodoro session launcher
 */
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/hooks/useTheme";
import { FOCUS_SESSION_TYPES } from "@/constants/config";
import { spacing, typography } from "@/constants/theme";

export default function FocusScreen() {
  const router = useRouter();
  const theme = useTheme();

  const startSession = (type: keyof typeof FOCUS_SESSION_TYPES) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/focus-session",
      params: { type },
    });
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Focus Session</Text>
      <Text style={styles.subtitle}>
        Lock non-essential apps and work in timed blocks.
      </Text>

      <View style={styles.options}>
        {(Object.keys(FOCUS_SESSION_TYPES) as Array<keyof typeof FOCUS_SESSION_TYPES>).map(
          (key) => {
            const { duration, label } = FOCUS_SESSION_TYPES[key];
            return (
              <Pressable
                key={key}
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                onPress={() => startSession(key)}
              >
                <Text style={styles.optionLabel}>{label}</Text>
                <Text style={styles.optionDuration}>{duration} min</Text>
                <Text style={styles.startLink}>Start</Text>
              </Pressable>
            );
          }
        )}
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.lg,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.medium,
      color: theme.text,
      marginBottom: spacing.sm,
    },
    subtitle: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
      marginBottom: spacing.xl,
    },
    options: {
      gap: spacing.lg,
    },
    option: {
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    optionPressed: {
      opacity: 0.7,
    },
    optionLabel: {
      fontSize: typography.fontSizes.md,
      color: theme.text,
      fontWeight: typography.fontWeights.medium,
    },
    optionDuration: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
      marginVertical: spacing.xs,
    },
    startLink: {
      fontSize: typography.fontSizes.sm,
      color: theme.text,
      fontWeight: typography.fontWeights.medium,
      marginTop: spacing.xs,
    },
  });
}
