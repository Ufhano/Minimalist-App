/**
 * Login screen - Email/password + Google OAuth
 */
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/hooks/useTheme";
import { TextButton } from "@/components/TextButton";
import { spacing, typography } from "@/constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)/home");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Google OAuth requires expo-auth-session + web browser
      // For now we show a placeholder - configure in Supabase dashboard
      Alert.alert(
        "Google Sign-In",
        "Configure Google OAuth in Supabase Dashboard → Authentication → Providers"
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.subtitle}>Use your email or Google account</Text>

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
        placeholder="Password"
        placeholderTextColor={theme.textSecondary}
        secureTextEntry
      />

      <TextButton
        title={loading ? "Signing in..." : "Sign in"}
        onPress={handleLogin}
        variant="primary"
        disabled={loading}
      />

      <Pressable
        style={styles.link}
        onPress={() => router.push("/(auth)/forgot-password")}
      >
        <Text style={styles.linkText}>Forgot password?</Text>
      </Pressable>

      <TextButton
        title="Sign in with Google"
        onPress={handleGoogleSignIn}
        variant="outline"
        disabled={loading}
      />

      <Pressable
        style={styles.link}
        onPress={() => router.push("/(auth)/signup")}
      >
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
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
