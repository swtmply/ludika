import "@/global.css";
import { useSecurityStore } from "@ludika/store/security";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useThemeColor } from "heroui-native/hooks";
import { useCallback } from "react";
import { AppThemeProvider, MobileUIProvider, ThemeToggle } from "@ludika/mobile-ui";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { SecurityBlockScreen } from "@ludika/mobile-ui/components/security-block";
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
  const { checkDeviceSecurity, isChecked, isCompromised } = useSecurityStore();

  // Run the security check once on mount.
  useEffect(() => {
    void checkDeviceSecurity();
  }, [checkDeviceSecurity]);

  // Hold the splash until the check resolves.
  if (!isChecked) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0f",
        }}
      >
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  // Block compromised devices before mounting any router logic.
  if (isCompromised) {
    return <SecurityBlockScreen />;
  }

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
