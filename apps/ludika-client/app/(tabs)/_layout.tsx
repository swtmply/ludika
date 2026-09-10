import { Add01Icon, CheckmarkSquare01Icon, Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Link, Tabs } from "expo-router";
import { useThemeColor } from "heroui-native/hooks";
import { useCallback } from "react";
import { Pressable, View } from "react-native";

import { ThemeToggle } from "@ludika/mobile-ui";

export default function TabsLayout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

  const renderHomeHeaderRight = useCallback(
    () => (
      <View className="flex-row items-center">
        <Link href="/modal" asChild>
          <Pressable className="px-2.5">
            <HugeiconsIcon icon={Add01Icon} size={20} color={themeColorForeground} />
          </Pressable>
        </Link>
        <ThemeToggle />
      </View>
    ),
    [themeColorForeground],
  );

  return (
    <Tabs
      screenOptions={{
        headerTintColor: themeColorForeground,
        headerStyle: { backgroundColor: themeColorBackground },
        headerTitleStyle: {
          fontWeight: "600",
          color: themeColorForeground,
        },
        headerRight: renderThemeToggle,
        tabBarStyle: { backgroundColor: themeColorBackground },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerRight: renderHomeHeaderRight,
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon icon={Home01Icon} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="todos"
        options={{
          title: "Todos",
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon icon={CheckmarkSquare01Icon} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
