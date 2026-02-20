/**
 * App Manager - Manage allowed/restricted/blocked apps
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useAuthStore } from "@/stores/authStore";
import { getApps, upsertApp, deleteApp } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography } from "@/constants/theme";
import type { Database } from "@/types/database";

type App = Database["public"]["Tables"]["apps"]["Row"];
type Category = "allowed" | "restricted" | "blocked";

const SAMPLE_APPS = [
  { app_name: "Messages", package_name: "com.apple.mobilesms" },
  { app_name: "Phone", package_name: "com.apple.mobilephone" },
  { app_name: "Instagram", package_name: "com.instagram.android" },
  { app_name: "Twitter", package_name: "com.twitter.android" },
  { app_name: "Chrome", package_name: "com.android.chrome" },
  { app_name: "Gmail", package_name: "com.google.android.gm" },
  { app_name: "YouTube", package_name: "com.google.android.youtube" },
  { app_name: "Maps", package_name: "com.google.android.apps.maps" },
];

export default function AppManagerScreen() {
  const router = useRouter();
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [newAppName, setNewAppName] = useState("");
  const [newPackage, setNewPackage] = useState("");

  const { data: apps = [] } = useQuery({
    queryKey: ["apps", user?.id],
    queryFn: () => (user ? getApps(user.id) : []),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: (app: {
      app_name: string;
      package_name: string;
      category: Category;
      daily_limit_minutes?: number | null;
      profile_id?: string | null;
    }) =>
      user
        ? upsertApp(user.id, {
            ...app,
            daily_limit_minutes: app.daily_limit_minutes ?? null,
            profile_id: app.profile_id ?? null,
          })
        : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apps"] });
    },
  });

  const handleAdd = () => {
    const name = newAppName.trim() || "Custom App";
    const pkg = newPackage.trim() || `com.custom.${name.toLowerCase().replace(/\s/g, "")}`;
    if (!user) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addMutation.mutate({
      app_name: name,
      package_name: pkg,
      category: "allowed",
      daily_limit_minutes: null,
      profile_id: null,
    });
    setNewAppName("");
    setNewPackage("");
  };

  const handleCategoryChange = (app: App, category: Category) => {
    if (!user) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    upsertApp(user.id, {
      ...app,
      category,
      daily_limit_minutes: category === "restricted" ? 20 : null,
    }).then(() => queryClient.invalidateQueries({ queryKey: ["apps"] }));
  };

  const handleDelete = (app: App) => {
    Alert.alert("Remove app", `Remove ${app.app_name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => deleteMutation.mutate(app.id),
      },
    ]);
  };

  const handleAddSample = (sample: { app_name: string; package_name: string }) => {
    if (!user) return;
    const existing = apps.find((a) => a.package_name === sample.package_name);
    if (existing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addMutation.mutate({
      ...sample,
      category: "allowed",
      daily_limit_minutes: null,
      profile_id: null,
    });
  };

  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>App Manager</Text>
      <Text style={styles.subtitle}>
        Choose which apps appear on your home screen and set limits.
      </Text>

      <View style={styles.addSection}>
        <Text style={styles.sectionTitle}>Add app</Text>
        <TextInput
          style={styles.input}
          value={newAppName}
          onChangeText={setNewAppName}
          placeholder="App name"
          placeholderTextColor={theme.textSecondary}
        />
        <TextInput
          style={styles.input}
          value={newPackage}
          onChangeText={setNewPackage}
          placeholder="Package (e.g. com.example.app)"
          placeholderTextColor={theme.textSecondary}
        />
        <Pressable style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Quick add</Text>
      <View style={styles.sampleRow}>
        {SAMPLE_APPS.map((s) => (
          <Pressable
            key={s.package_name}
            style={styles.sampleChip}
            onPress={() => handleAddSample(s)}
          >
            <Text style={styles.sampleChipText}>{s.app_name}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Your apps</Text>
      {apps.map((app) => (
        <View key={app.id} style={styles.appRow}>
          <Text style={styles.appName}>{app.app_name}</Text>
          <View style={styles.categoryRow}>
            {(["allowed", "restricted", "blocked"] as const).map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.catBtn,
                  app.category === cat && styles.catBtnActive,
                ]}
                onPress={() => handleCategoryChange(app, cat)}
              >
                <Text
                  style={[
                    styles.catBtnText,
                    app.category === cat && styles.catBtnTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
          {app.category === "restricted" && app.daily_limit_minutes && (
            <Text style={styles.limit}>
              {app.daily_limit_minutes} min/day
            </Text>
          )}
          <Pressable onPress={() => handleDelete(app)}>
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </View>
      ))}

      {apps.length === 0 && (
        <Text style={styles.empty}>
          No apps yet. Add from quick add or enter custom.
        </Text>
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
    back: {
      marginBottom: spacing.md,
    },
    backText: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
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
    sectionTitle: {
      fontSize: typography.fontSizes.xs,
      color: theme.textSecondary,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
      textTransform: "uppercase",
    },
    addSection: {
      marginBottom: spacing.md,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      padding: spacing.sm,
      fontSize: typography.fontSizes.sm,
      color: theme.text,
      marginBottom: spacing.sm,
    },
    addBtn: {
      alignSelf: "flex-start",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    addBtnText: {
      fontSize: typography.fontSizes.sm,
      color: theme.text,
    },
    sampleRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    sampleChip: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
    },
    sampleChipText: {
      fontSize: typography.fontSizes.sm,
      color: theme.text,
    },
    appRow: {
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    appName: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.medium,
      color: theme.text,
      marginBottom: spacing.xs,
    },
    categoryRow: {
      flexDirection: "row",
      gap: spacing.xs,
      marginBottom: spacing.xs,
    },
    catBtn: {
      paddingVertical: 2,
      paddingHorizontal: spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
    },
    catBtnActive: {
      backgroundColor: theme.text,
      borderColor: theme.text,
    },
    catBtnText: {
      fontSize: typography.fontSizes.xs,
      color: theme.text,
    },
    catBtnTextActive: {
      color: theme.background,
    },
    limit: {
      fontSize: typography.fontSizes.xs,
      color: theme.textSecondary,
      marginBottom: spacing.xs,
    },
    removeText: {
      fontSize: typography.fontSizes.xs,
      color: theme.textSecondary,
    },
    empty: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
      marginTop: spacing.md,
    },
  });
}
