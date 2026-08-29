import "@/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { MobileUIProvider } from "@ludika/mobile-ui";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppThemeProvider } from "@/contexts/app-theme-context";
import { queryClient } from "@/utils/trpc";

export const unstable_settings = {
  initialRouteName: "(drawer)",
};

function StackLayout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
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
