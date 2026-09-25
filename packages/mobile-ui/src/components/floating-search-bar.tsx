import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useThemeColor } from "heroui-native/hooks";
import { Input } from "heroui-native/input";
import { Spinner } from "heroui-native/spinner";
import { cn } from "heroui-native/utils";
import { forwardRef, type ReactNode } from "react";
import {
  Pressable,
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from "react-native";

export interface FloatingSearchBarProps extends Omit<
  TextInputProps,
  "style" | "value" | "onChangeText"
> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  onClear?: () => void;
  className?: string;
  barClassName?: string;
  barStyle?: ViewStyle;
  inputClassName?: string;
}

export const FloatingSearchBar = forwardRef<TextInput, FloatingSearchBarProps>(
  function FloatingSearchBar(
    {
      value,
      onChangeText,
      placeholder,
      placeholderTextColor,
      isLoading = false,
      leftIcon,
      onClear,
      className,
      barClassName,
      barStyle,
      inputClassName,
      autoFocus,
      returnKeyType = "search",
      ...props
    },
    ref,
  ) {
    const mutedColor = useThemeColor("muted");
    const foregroundColor = useThemeColor("foreground");

    const handleClear = () => {
      onChangeText("");
      onClear?.();
    };

    return (
      <View className={cn("px-5 mb-4", className)}>
        <View
          className={cn(
            "flex-row items-center rounded-xl bg-background px-4 border border-border/10",
            barClassName,
          )}
          style={[
            {
              height: 56,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 12,
              elevation: 4,
            },
            barStyle,
          ]}
        >
          {leftIcon !== undefined ? (
            leftIcon
          ) : (
            <HugeiconsIcon
              icon={Search01Icon}
              size={21}
              color={foregroundColor}
              strokeWidth={1.8}
            />
          )}

          <Input
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor ?? mutedColor}
            autoFocus={autoFocus}
            returnKeyType={returnKeyType}
            className={cn(
              "flex-1 ml-4 bg-transparent border-0 text-[15px] text-foreground focus:border-0",
              inputClassName,
            )}
            {...props}
          />

          {isLoading ? (
            <Spinner size="sm" color="default" />
          ) : value.length > 0 ? (
            <Pressable
              onPress={handleClear}
              hitSlop={10}
              className="ml-2"
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Text className="text-lg leading-none text-muted">×</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  },
);
