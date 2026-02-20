/**
 * Sign up screen
 */
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/hooks/useTheme";
import { TextButton } from "@/components/TextButton";
import { spacing, typography } from "@/constants/theme";

export default function SignupScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Check your email",
        "We've sent you a confirmation link. Check your inbox to verify your account."
      );
      router.back();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Sign up failed";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Sign up with your email</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={theme.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password (min 6 characters)"
        placeholderTextColor={theme.textSecondary}
        secureTextEntry
      />

      <TextButton
        title={loading ? "Creating account..." : "Sign up"}
        onPress={handleSignUp}
        variant="primary"
        disabled={loading}
      />

      <Pressable style={styles.link} onPress={() => router.back()}>
        <Text style={styles.linkText}>Already have an account? Sign in</Text>
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
