/**
 * Minimalist theme constants
 * Black, white, gray only — no color noise
 */
export const colors = {
  black: "#000000",
  white: "#ffffff",
  gray: "#888888",
  grayLight: "#cccccc",
  grayDark: "#444444",
} as const;

export type ThemeMode = "light" | "dark";

export const theme = {
  light: {
    background: colors.white,
    text: colors.black,
    textSecondary: colors.grayDark,
    border: colors.grayLight,
  },
  dark: {
    background: colors.black,
    text: colors.white,
    textSecondary: colors.gray,
    border: colors.grayDark,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  fontWeights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
} as const;
