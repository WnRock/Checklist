import { Stack } from "expo-router";
import { ChecklistProvider } from "../contexts/ChecklistContext";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ChecklistProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="edit-checklist"
            options={{ headerShown: false }}
          />
        </Stack>
      </ChecklistProvider>
    </ThemeProvider>
  );
}
