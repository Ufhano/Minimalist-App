/**
 * Settings screen
 */
import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useAuthStore } from "@/stores/authStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTheme } from "@/hooks/useTheme";
import { TextButton } from "@/components/TextButton";
import { colors, spacing, typography } from "@/constants/theme";

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const signOut = useAuthStore((s) => s.signOut);
  const user = useAuthStore((s) => s.user);

  const {
    theme: themeMode,
    hideNotificationBadges,
    dndEnabled,
    setTheme,
    setHideNotificationBadges,
    setDnd,
    persist,
  } = useSettingsStore();

  const handleToggle = (fn: (v: boolean) => void, value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn(value);
    persist();
  };

  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.row}>
          {(["light", "dark"] as const).map((t) => (
            <Pressable
              key={t}
              style={[
                styles.themeOption,
                themeMode === t && styles.themeOptionActive,
              ]}
              onPress={() => {
                setTheme(t);
                persist();
              }}
            >
              <Text
                style={[
                  styles.themeOptionText,
                  themeMode === t && styles.themeOptionTextActive,
                ]}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Distraction</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Hide notification badges</Text>
          <Switch
            value={hideNotificationBadges}
            onValueChange={(v) => handleToggle(setHideNotificationBadges, v)}
            trackColor={{ false: theme.border, true: colors.gray }}
            thumbColor={colors.white}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Do Not Disturb</Text>
          <Switch
            value={dndEnabled}
            onValueChange={(v) => {
              handleToggle(() => {}, v);
              setDnd(v);
              persist();
            }}
            trackColor={{ false: theme.border, true: colors.gray }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Manage</Text>
        <Pressable
          style={styles.link}
          onPress={() => router.push("/app-manager")}
        >
          <Text style={styles.linkText}>App Manager</Text>
        </Pressable>
      </View>

      {user && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Text style={styles.email}>{user.email}</Text>
          <TextButton title="Sign out" onPress={signOut} variant="outline" />
        </View>
      )}

      {!user && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TextButton
            title="Sign in"
            onPress={() => router.push("/(auth)/login")}
            variant="primary"
          />
        </View>
      )}
    </ScrollView>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: spacing.lg,
    },
    title: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.medium,
      color: theme.text,
      marginBottom: spacing.xl,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: typography.fontSizes.xs,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
      textTransform: "uppercase",
    },
    row: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    themeOption: {
      flex: 1,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
    },
    themeOptionActive: {
      backgroundColor: theme.text,
      borderColor: theme.text,
    },
    themeOptionText: {
      fontSize: typography.fontSizes.sm,
      color: theme.text,
    },
    themeOptionTextActive: {
      color: theme.background,
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    settingLabel: {
      fontSize: typography.fontSizes.md,
      color: theme.text,
    },
    link: {
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    linkText: {
      fontSize: typography.fontSizes.md,
      color: theme.text,
    },
    email: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
    },
  });
}
