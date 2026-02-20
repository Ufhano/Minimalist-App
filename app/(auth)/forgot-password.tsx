/**
 * Forgot password screen
 */
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/hooks/useTheme";
import { TextButton } from "@/components/TextButton";
import { spacing, typography } from "@/constants/theme";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "minimalistappv1://auth/callback",
      });
      if (error) throw error;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Check your email",
        "We've sent you a link to reset your password."
      );
      router.back();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to send reset email";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset password</Text>
      <Text style={styles.subtitle}>
        Enter your email and we'll send you a reset link.
      </Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={theme.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextButton
        title={loading ? "Sending..." : "Send reset link"}
        onPress={handleReset}
        variant="primary"
        disabled={loading}
      />

      <Pressable style={styles.link} onPress={() => router.back()}>
        <Text style={styles.linkText}>Back to sign in</Text>
      </Pressable>
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
      marginBottom: spacing.md,
    },
    link: {
      paddingVertical: spacing.md,
      alignItems: "center",
    },
    linkText: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
    },
  });
}
