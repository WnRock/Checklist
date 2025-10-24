export type ThemeName = "light" | "dark";

export interface ThemeColors {
  // Base colors
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  borderStrong: string;
  placeholder: string;
  disabled: string;

  // Completed item colors
  completedItem: string;
  completedItemBackground: string;

  // Component-specific
  fabBorder: string;
}

export const lightTheme: ThemeColors = {
  // Base colors
  background: "#FFFFFF",
  surface: "#F8F8F8",
  textPrimary: "#000000",
  textSecondary: "#666666",
  border: "#E0E0E0",
  borderStrong: "#000000",
  placeholder: "#999999",
  disabled: "#E0E0E0",

  // Completed item colors
  completedItem: "#4CAF50",
  completedItemBackground: "#E8F5E8",

  // Component-specific
  fabBorder: "#CCCCCC",
};

export const darkTheme: ThemeColors = {
  // Base colors
  background: "#121212",
  surface: "#1E1E1E",
  textPrimary: "#FFFFFF",
  textSecondary: "#B0B0B0",
  border: "#2C2C2C",
  borderStrong: "#FFFFFF",
  placeholder: "#707070",
  disabled: "#2C2C2C",

  // Completed item colors
  completedItem: "#66BB6A",
  completedItemBackground: "#1B3A1B",

  // Component-specific
  fabBorder: "#3C3C3C",
};

export const themes: Record<ThemeName, ThemeColors> = {
  light: lightTheme,
  dark: darkTheme,
};

export default themes;
