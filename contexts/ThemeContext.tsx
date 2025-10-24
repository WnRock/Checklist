import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import themes, { ThemeColors, ThemeName } from "../constants/Color";

type ThemeContextValue = {
  themeName: ThemeName;
  colors: ThemeColors;
  setTheme: (t: ThemeName) => void;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = "@app_theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = Appearance.getColorScheme();
  const initial = colorScheme === "dark" ? "dark" : "light";
  const [themeName, setThemeName] = useState<ThemeName>(initial as ThemeName);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "light" || stored === "dark") {
          setThemeName(stored);
        }
      } catch (error) {
        console.warn("Failed to load theme from AsyncStorage:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Persist theme when it changes
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(THEME_STORAGE_KEY, themeName).catch((error) => {
        console.warn("Failed to save theme to AsyncStorage:", error);
      });
    }
  }, [themeName, isLoaded]);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      // noop for now
    });
    return () => {
      try {
        sub.remove();
      } catch {
        // some RN versions expose different removal APIs; ignore safely
      }
    };
  }, []);

  const setTheme = (t: ThemeName) => setThemeName(t);
  const toggleTheme = () =>
    setThemeName((prev) => (prev === "light" ? "dark" : "light"));

  const value: ThemeContextValue = {
    themeName,
    colors: themes[themeName],
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

export default ThemeContext;
