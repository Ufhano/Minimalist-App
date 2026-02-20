/**
 * Intention prompt - "Why are you opening this app?"
 */
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useAuthStore } from "@/stores/authStore";
import { logAppOpen } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";
import { TextButton } from "@/components/TextButton";
import { spacing, typography } from "@/constants/theme";

export default function IntentionPromptScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ appId?: string; appName?: string; packageName?: string }>();
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);

  const [intention, setIntention] = useState("");

  const handleOpen = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (user) {
      try {
        await logAppOpen(user.id, {
          app_id: params.appId ?? undefined,
          app_name: params.appName ?? undefined,
          package_name: params.packageName ?? undefined,
          intention: intention.trim() || null,
        });
      } catch (e) {
        console.error(e);
      }
    }
    // In a real launcher we would open the app via Linking.openURL
    router.back();
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Why are you opening this?</Text>
      <Text style={styles.appName}>{params.appName ?? "App"}</Text>
      <TextInput
        style={styles.input}
        value={intention}
        onChangeText={setIntention}
        placeholder="e.g. Reply to mom, check calendar..."
        placeholderTextColor={theme.textSecondary}
        multiline
      />
      <TextButton title="Open" onPress={handleOpen} variant="primary" />
      <View style={styles.spacer} />
      <TextButton title="Cancel" onPress={handleCancel} variant="outline" />
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.xl,
      justifyContent: "center",
      backgroundColor: theme.background,
    },
    title: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.medium,
      color: theme.text,
      marginBottom: spacing.sm,
    },
    appName: {
      fontSize: typography.fontSizes.md,
      color: theme.textSecondary,
      marginBottom: spacing.lg,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      padding: spacing.md,
      fontSize: typography.fontSizes.md,
      color: theme.text,
      minHeight: 80,
      marginBottom: spacing.lg,
    },
    spacer: {
      height: spacing.sm,
    },
  });
}
