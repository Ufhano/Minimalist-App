/**
 * Active Focus Session - Pomodoro timer
 */
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import { useAuthStore } from "@/stores/authStore";
import { startFocusSession, endFocusSession } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";
import { TextButton } from "@/components/TextButton";
import { FOCUS_SESSION_TYPES } from "@/constants/config";
import { spacing, typography } from "@/constants/theme";

export default function FocusSessionScreen() {
  const router = useRouter();
  const { type = "pomodoro" } = useLocalSearchParams<{ type?: string }>();
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);

  const config = FOCUS_SESSION_TYPES[type as keyof typeof FOCUS_SESSION_TYPES] ?? FOCUS_SESSION_TYPES.pomodoro;
  const durationSec = config.duration * 60;

  const [secondsLeft, setSecondsLeft] = useState(durationSec);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning && !isPaused && secondsLeft > 0) {
      const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
      return () => clearInterval(id);
    }
  }, [isRunning, isPaused, secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (sessionId && user) {
        endFocusSession(sessionId, config.duration).catch(console.error);
      }
      router.back();
    }
  }, [secondsLeft, sessionId, user, config.duration, router]);

  const startSession = async () => {
    if (user) {
      try {
        const session = await startFocusSession(user.id, type as "pomodoro" | "deep" | "custom");
        setSessionId(session.id);
      } catch (e) {
        console.error(e);
      }
    } else {
      setSessionId("local");
    }
    setIsRunning(true);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{config.label}</Text>
      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>

      <View style={styles.buttonGroup}>
        {!sessionId ? (
          <TextButton title="Start" onPress={startSession} variant="primary" fullWidth />
        ) : (
          <TextButton
            title={isPaused ? "Resume" : "Pause"}
            onPress={() => setIsPaused((p) => !p)}
            variant="outline"
            fullWidth
          />
        )}
        <View style={styles.buttonSpacer} />
        <TextButton title="End session" onPress={() => router.back()} variant="secondary" fullWidth />
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.xl,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.medium,
      color: theme.text,
      marginBottom: spacing.md,
    },
    timer: {
      fontSize: 72,
      fontWeight: typography.fontWeights.regular,
      color: theme.text,
      fontVariant: ["tabular-nums"],
      marginBottom: spacing.xxl,
    },
    buttonGroup: {
      alignItems: "stretch",
      width: "100%",
      maxWidth: 280,
    },
    buttonSpacer: {
      height: spacing.md,
    },
  });
}
