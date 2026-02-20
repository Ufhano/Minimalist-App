/**
 * Screen Time Dashboard
 * Daily/weekly usage, streak tracker, graphs
 */
import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getUsageLogs, getStreaks } from "@/lib/api";
import { useSettingsStore } from "@/stores/settingsStore";
import { StatsSkeleton } from "@/components/LoadingSkeleton";
import { useTheme } from "@/hooks/useTheme";
import { spacing, typography } from "@/constants/theme";

function formatMinutes(m: number) {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return min ? `${h}h ${min}m` : `${h}h`;
}

export default function StatsScreen() {
  const user = useAuthStore((s) => s.user);
  const dailyGoal = useSettingsStore((s) => s.dailyGoalMinutes);
  const theme = useTheme();

  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const { data: usageLogs = [], isLoading: usageLoading } = useQuery({
    queryKey: ["usage", user?.id, weekAgo, today],
    queryFn: () =>
      user ? getUsageLogs(user.id, `${weekAgo}T00:00:00Z`, `${today}T23:59:59Z`) : [],
    enabled: !!user,
  });

  const { data: streaks } = useQuery({
    queryKey: ["streaks", user?.id, weekAgo, today],
    queryFn: () => user ? getStreaks(user.id, weekAgo, today) : [],
    enabled: !!user,
  });

  const { dailyTotal, weeklyByDay, streakCount, todayVsAvg } = useMemo(() => {
    if (!usageLogs) {
      return { dailyTotal: 0, weeklyByDay: [], streakCount: 0, todayVsAvg: 0 };
    }

    const byDate: Record<string, number> = {};
    let dailyTotal = 0;

    for (const log of usageLogs) {
      const d = log.opened_at.slice(0, 10);
      const sec = log.duration_seconds ?? 0;
      byDate[d] = (byDate[d] ?? 0) + sec;
      if (d === today) dailyTotal += sec;
    }

    const dailyTotalMin = Math.round(dailyTotal / 60);
    const days = 7;
    const weeklyByDay = Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const key = d.toISOString().slice(0, 10);
      return { x: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()], y: Math.round((byDate[key] ?? 0) / 60) };
    });

    let streakCount = 0;
    if (streaks) {
      const sorted = [...streaks].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      for (const s of sorted) {
        if (s.goal_met) streakCount++;
        else break;
      }
    }

    const weekMins = Object.values(byDate).reduce((a, s) => a + Math.round(s / 60), 0);
    const avg = days > 0 ? Math.round(weekMins / days) : 0;
    const todayVsAvg = avg > 0 ? Math.round(((dailyTotalMin - avg) / avg) * 100) : 0;

    return {
      dailyTotal: dailyTotalMin,
      weeklyByDay,
      streakCount,
      todayVsAvg,
    };
  }, [usageLogs, streaks, today]);

  const styles = createStyles(theme);

  if (usageLoading && usageLogs.length === 0) {
    return <StatsSkeleton />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Screen Time</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Today</Text>
        <Text style={styles.cardValue}>{formatMinutes(dailyTotal)}</Text>
        <Text style={styles.cardSub}>
          Goal: {formatMinutes(dailyGoal)}
          {dailyTotal <= dailyGoal ? " ✓" : ""}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Streak</Text>
          <Text style={styles.cardValue}>{streakCount} days</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>vs 7-day avg</Text>
          <Text style={[styles.cardValue, todayVsAvg <= 0 ? styles.positive : styles.negative]}>
            {todayVsAvg <= 0 ? "" : "+"}
            {todayVsAvg}%
          </Text>
        </View>
      </View>

      {weeklyByDay.length > 0 && (
        <View style={styles.chart}>
          <Text style={styles.chartTitle}>Last 7 days</Text>
          <View style={styles.barChart}>
            {weeklyByDay.map((d, i) => {
              const maxY = Math.max(...weeklyByDay.map((x) => x.y), 1);
              const barHeight = maxY > 0 ? Math.max(4, (d.y / maxY) * 100) : 4;
              return (
                <View key={i} style={styles.barColumn}>
                  <View
                    style={[
                      styles.bar,
                      { height: barHeight, backgroundColor: theme.text },
                    ]}
                  />
                  <Text style={styles.barLabel}>{d.x}</Text>
                  <Text style={styles.barValue}>{d.y}m</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {!user && (
        <Text style={styles.anonymous}>
          Sign in to sync usage across devices.
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
    title: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.medium,
      color: theme.text,
      marginBottom: spacing.lg,
    },
    card: {
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: spacing.md,
    },
    cardLabel: {
      fontSize: typography.fontSizes.xs,
      color: theme.textSecondary,
    },
    cardValue: {
      fontSize: typography.fontSizes.xxl,
      fontWeight: typography.fontWeights.medium,
      color: theme.text,
    },
    cardSub: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
      marginTop: spacing.xs,
    },
    row: {
      flexDirection: "row",
      gap: spacing.md,
    },
    positive: {
      color: theme.text,
    },
    negative: {
      color: theme.textSecondary,
    },
    chart: {
      marginTop: spacing.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    chartTitle: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
    },
    barChart: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      height: 120,
      gap: spacing.xs,
    },
    barColumn: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end",
      height: "100%",
    },
    bar: {
      width: "80%",
      minHeight: 2,
    },
    barLabel: {
      fontSize: 10,
      color: theme.textSecondary,
      marginTop: spacing.xs,
    },
    barValue: {
      fontSize: 10,
      color: theme.text,
    },
    anonymous: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
      marginTop: spacing.xl,
    },
  });
}
