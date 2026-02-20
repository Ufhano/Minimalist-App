/**
 * Onboarding Step 1 - What do you want more time for?
 */
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTheme } from "@/hooks/useTheme";
import { TextButton } from "@/components/TextButton";
import { spacing, typography } from "@/constants/theme";

export default function OnboardingValues() {
  const router = useRouter();
  const theme = useTheme();
  const [anchor, setAnchor] = useState(useSettingsStore.getState().motivationAnchor);
  const setMotivationAnchor = useSettingsStore((s) => s.setMotivationAnchor);
  const persist = useSettingsStore((s) => s.persist);

  const handleNext = () => {
    setMotivationAnchor(anchor);
    persist();
    router.push("/onboarding/app-audit");
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What do you want more time for?</Text>
      <Text style={styles.subtitle}>
        This will be your motivation anchor when you're tempted to scroll.
      </Text>
      <TextInput
        style={styles.input}
        value={anchor}
        onChangeText={setAnchor}
        placeholder="e.g. Reading, family, exercise..."
        placeholderTextColor={theme.textSecondary}
        multiline
      />
      <TextButton title="Next" onPress={handleNext} variant="primary" />
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
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      padding: spacing.md,
      fontSize: typography.fontSizes.md,
      color: theme.text,
      minHeight: 100,
      marginBottom: spacing.xl,
    },
  });
}
