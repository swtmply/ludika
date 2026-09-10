import "@/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useThemeColor } from "heroui-native/hooks";
import { useCallback } from "react";
import { AppThemeProvider, MobileUIProvider, ThemeToggle } from "@ludika/mobile-ui";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { queryClient } from "@/utils/trpc";

export const unstable_settings = {
  initialRouteName: "index",
};

function StackLayout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

  return (
    <Stack
      screenOptions={{
        headerTintColor: themeColorForeground,
        headerStyle: { backgroundColor: themeColorBackground },
        headerTitleStyle: { fontWeight: "600", color: themeColorForeground },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(forms)/order" options={{ headerShown: false }} />
      <Stack.Screen name="account" options={{ title: "Account", headerRight: renderThemeToggle }} />
      <Stack.Screen name="modal" options={{ title: "Modal", presentation: "modal" }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <MobileUIProvider>
        <KeyboardProvider>
          <AppThemeProvider>
            <StackLayout />
          </AppThemeProvider>
        </KeyboardProvider>
      </MobileUIProvider>
    </QueryClientProvider>
  );
}
