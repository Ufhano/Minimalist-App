/**
 * Onboarding Step 4 - Pick theme
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTheme } from "@/hooks/useTheme";
import { TextButton } from "@/components/TextButton";
import { colors, spacing, typography } from "@/constants/theme";

const THEMES = ["light", "dark"] as const;

export default function OnboardingTheme() {
  const router = useRouter();
  const theme = useTheme();
  const themeMode = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const persist = useSettingsStore((s) => s.persist);

  const handleSelect = (t: (typeof THEMES)[number]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTheme(t);
    persist();
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick a theme</Text>
      <Text style={styles.subtitle}>Choose light or dark mode.</Text>

      <View style={styles.options}>
        {THEMES.map((t) => (
          <Pressable
            key={t}
            style={({ pressed }) => [
              styles.option,
              themeMode === t && styles.optionActive,
              pressed && styles.optionPressed,
            ]}
            onPress={() => handleSelect(t)}
          >
            <Text
              style={[
                styles.optionText,
                themeMode === t && styles.optionTextActive,
              ]}
            >
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.doneWrapper}>
        <TextButton
          title="Done"
          onPress={() => router.push("/onboarding/done")}
          variant={theme.background === colors.black ? "light" : "primary"}
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
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
      marginBottom: spacing.lg,
    },
    options: {
      flexDirection: "row",
      gap: spacing.md,
      marginBottom: spacing.xxl,
    },
    option: {
      flex: 1,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
    },
    optionActive: {
      backgroundColor: theme.text,
      borderColor: theme.text,
    },
    optionPressed: {
      opacity: 0.8,
    },
    optionText: {
      fontSize: typography.fontSizes.sm,
      color: theme.text,
    },
    optionTextActive: {
      color: theme.background,
    },
    doneWrapper: {
      width: "100%",
      maxWidth: 280,
      alignSelf: "center",
    },
  });
}
