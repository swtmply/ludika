import { UserCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Link, Stack } from "expo-router";
import { useThemeColor } from "heroui-native/hooks";
import { useCallback } from "react";
import { Pressable, View } from "react-native";

import { ThemeToggle } from "@ludika/mobile-ui";
import { OrderDraftProvider } from "@/components/order-draft-context";

export const unstable_settings = {
  initialRouteName: "pickup-dropoff",
};

export default function OrderLayout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  const renderHeaderRight = useCallback(
    () => (
      <View className="flex-row items-center">
        <Link href="/account" asChild>
          <Pressable className="px-2.5">
            <HugeiconsIcon icon={UserCircleIcon} size={20} color={themeColorForeground} />
          </Pressable>
        </Link>
        <ThemeToggle />
      </View>
    ),
    [themeColorForeground],
  );

  return (
    <OrderDraftProvider>
      <Stack
        screenOptions={{
          headerTintColor: themeColorForeground,
          headerStyle: { backgroundColor: themeColorBackground },
          headerTitleStyle: { fontWeight: "600", color: themeColorForeground },
          headerRight: renderHeaderRight,
        }}
      >
        <Stack.Screen name="pickup-dropoff" options={{ title: "Pickup & drop-off" }} />
        <Stack.Screen name="order-details" options={{ title: "Order details" }} />
        <Stack.Screen name="item-details" options={{ title: "Items" }} />
        <Stack.Screen
          name="live-feed"
          options={{ title: "Live feed", headerBackVisible: false, gestureEnabled: false }}
        />
      </Stack>
    </OrderDraftProvider>
  );
}
