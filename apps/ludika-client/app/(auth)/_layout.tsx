import { Stack } from "expo-router";
import { useThemeColor } from "heroui-native/hooks";
import { useCallback } from "react";

import { ThemeToggle } from "@ludika/mobile-ui";

export default function AuthLayout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

  return (
    <Stack
      screenOptions={{
        headerTintColor: themeColorForeground,
        headerStyle: { backgroundColor: themeColorBackground },
        headerTitleStyle: { fontWeight: "600", color: themeColorForeground },
        headerRight: renderThemeToggle,
      }}
    >
      <Stack.Screen name="sign-in" options={{ title: "Sign In" }} />
      <Stack.Screen name="sign-up" options={{ title: "Create Account" }} />
    </Stack>
  );
}
