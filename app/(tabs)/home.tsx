/**
 * Minimalist Home / Launcher view
 * Plain text list of allowed apps, clock, one-tap access with intention prompt
 */
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useAuthStore } from "@/stores/authStore";
import { useAppStore } from "@/stores/appStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { getApps } from "@/lib/api";
import { HomeSkeleton } from "@/components/LoadingSkeleton";
import { useTheme } from "@/hooks/useTheme";
import { colors, spacing, typography } from "@/constants/theme";

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const motivationAnchor = useSettingsStore((s) => s.motivationAnchor);
  const activeProfileId = useAppStore((s) => s.activeProfileId);
  const setApps = useAppStore((s) => s.setApps);
  const cacheApps = useAppStore((s) => s.cacheApps);
  const loadCachedApps = useAppStore((s) => s.loadCachedApps);

  const clock = useClock();

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["apps", user?.id, activeProfileId],
    queryFn: () => (user ? getApps(user.id, activeProfileId) : []),
    enabled: !!user,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (apps) {
      setApps(apps);
      cacheApps(apps);
    }
  }, [apps, setApps, cacheApps]);

  useEffect(() => {
    if (!user) loadCachedApps();
  }, [user, loadCachedApps]);

  const allowedApps = apps.filter(
    (a) =>
      a.category === "allowed" &&
      (!activeProfileId || a.profile_id === activeProfileId || !a.profile_id)
  );

  const restrictedApps = apps.filter((a) => a.category === "restricted");

  const handleAppPress = (app: { id: string; app_name: string; package_name: string; category: string }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (app.category === "restricted") {
      router.push({
        pathname: "/intention-prompt",
        params: { appId: app.id, appName: app.app_name, packageName: app.package_name },
      });
    } else {
      // In a real launcher, we'd open the app via Linking
      // For demo, we show the intention prompt for all for consistency
      router.push({
        pathname: "/intention-prompt",
        params: { appId: app.id, appName: app.app_name, packageName: app.package_name },
      });
    }
  };

  const styles = createStyles(theme);

  if (isLoading && apps.length === 0) {
    return <HomeSkeleton />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.clock}>
        {clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </Text>

      {motivationAnchor ? (
        <Text style={styles.motivation}>"{motivationAnchor}"</Text>
      ) : null}

      <View style={styles.appList}>
        {allowedApps.map((app) => (
          <Pressable
            key={app.id}
            style={({ pressed }) => [styles.appItem, pressed && styles.appItemPressed]}
            onPress={() => handleAppPress(app)}
          >
            <Text style={styles.appName}>{app.app_name}</Text>
          </Pressable>
        ))}
        {restrictedApps.map((app) => (
          <Pressable
            key={app.id}
            style={({ pressed }) => [styles.appItem, pressed && styles.appItemPressed]}
            onPress={() => handleAppPress(app)}
          >
            <Text style={[styles.appName, styles.restricted]}>
              {app.app_name}
              {app.daily_limit_minutes ? ` (${app.daily_limit_minutes} min)` : ""}
            </Text>
          </Pressable>
        ))}
      </View>

      {allowedApps.length === 0 && restrictedApps.length === 0 ? (
        <Text style={styles.empty}>
          No apps yet. Add apps in Settings → App Manager.
        </Text>
      ) : null}
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
      paddingTop: spacing.xxl,
    },
    clock: {
      fontSize: 64,
      fontWeight: typography.fontWeights.regular,
      color: theme.text,
      fontVariant: ["tabular-nums"],
      marginBottom: spacing.md,
    },
    motivation: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
      fontStyle: "italic",
      marginBottom: spacing.xl,
    },
    appList: {
      gap: spacing.sm,
    },
    appItem: {
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    appItemPressed: {
      opacity: 0.6,
    },
    appName: {
      fontSize: typography.fontSizes.lg,
      color: theme.text,
    },
    restricted: {
      color: theme.textSecondary,
    },
    empty: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
      marginTop: spacing.xl,
    },
  });
}
