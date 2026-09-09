import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as Haptics from "expo-haptics";
import { useThemeColor } from "heroui-native/hooks";
import { Platform, Pressable } from "react-native";
import Animated, { FadeOut, ZoomIn } from "react-native-reanimated";

import { useAppTheme } from "../theme/app-theme-context";

export function ThemeToggle() {
  const { toggleTheme, isLight } = useAppTheme();
  const foregroundColor = useThemeColor("foreground");

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        toggleTheme();
      }}
      className="px-2.5"
    >
      {isLight ? (
        <Animated.View key="moon" entering={ZoomIn} exiting={FadeOut}>
          <HugeiconsIcon icon={Moon01Icon} size={20} color={foregroundColor} />
        </Animated.View>
      ) : (
        <Animated.View key="sun" entering={ZoomIn} exiting={FadeOut}>
          <HugeiconsIcon icon={Sun01Icon} size={20} color={foregroundColor} />
        </Animated.View>
      )}
    </Pressable>
  );
}
