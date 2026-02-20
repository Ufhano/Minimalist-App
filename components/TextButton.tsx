/**
 * Minimal text-based button
 */
import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, spacing, typography } from "@/constants/theme";

interface TextButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "outlineLight" | "light";
  disabled?: boolean;
  fullWidth?: boolean;
}

export function TextButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  fullWidth = false,
}: TextButtonProps) {
  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "outline" && styles.outline,
        variant === "outlineLight" && styles.outlineLight,
        variant === "light" && styles.light,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.text,
        variant === "primary" && styles.textPrimary,
        variant === "secondary" && styles.textSecondary,
        variant === "outline" && styles.textOutline,
        variant === "outlineLight" && styles.textOutlineLight,
        variant === "light" && styles.textLight,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  primary: {
    backgroundColor: colors.black,
  },
  secondary: {
    backgroundColor: colors.gray,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.black,
  },
  outlineLight: {
    borderWidth: 1,
    borderColor: colors.white,
  },
  light: {
    backgroundColor: colors.white,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
  },
  textPrimary: {
    color: colors.white,
  },
  textSecondary: {
    color: colors.white,
  },
  textOutline: {
    color: colors.black,
  },
  textOutlineLight: {
    color: colors.white,
  },
  textLight: {
    color: colors.black,
  },
});
