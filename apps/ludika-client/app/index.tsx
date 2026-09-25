import { ArrowRight01Icon, PinLocation01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { Avatar } from "heroui-native/avatar";
import { Button } from "heroui-native/button";

import { useThemeColor } from "heroui-native/hooks";
import { Spinner } from "heroui-native/spinner";
import { Pressable, Text, View } from "react-native";

import { Container } from "@ludika/mobile-ui";
import { useOrderDraft } from "@/components/order-draft-context";
import { authClient } from "@/lib/auth-client";

export default function HomeScreen() {
  const { data: session, isPending } = authClient.useSession();
  const { draft } = useOrderDraft();

  const _accentColor = useThemeColor("accent");

  if (isPending) {
    return (
      <Container isScrollable={false}>
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </Container>
    );
  }

  const isAuthenticated = Boolean(session?.user);
  const userName = session?.user?.name?.trim() || "User";
  const userInitials =
    userName
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const hasPickup = Boolean(draft.pickup?.label);
  const hasDropoff = Boolean(draft.dropoff?.label);
  const hasBothLocations = hasPickup && hasDropoff;

  const handleContinue = () => {
    if (!isAuthenticated) {
      router.push({
        pathname: "/sign-in",
        params: { redirectTo: "/order/order-details" },
      });
      return;
    }

    router.push("/order/order-details");
  };

  return (
    <Container className="flex-1 bg-white p-5">
      {/* Top Section: Greeting Title, Subtitle, Circular Avatar */}
      <View className="flex-row items-center justify-between mt-2 mb-8">
        <View className="flex-1 pr-3">
          <Text className="text-2xl font-bold text-slate-900 tracking-tight">
            {isAuthenticated ? `Hello, ${userName}` : "Hello, Guest"} 👋
          </Text>
          <Text className="text-sm text-slate-400 mt-0.5">Ano papadala mo?</Text>
        </View>
        <Pressable
          onPress={() => (isAuthenticated ? router.push("/account") : router.push("/sign-in"))}
          className="active:opacity-80"
          hitSlop={8}
          accessibilityLabel={isAuthenticated ? "Account" : "Sign in"}
          accessibilityRole="button"
        >
          <Avatar size="md" className="w-12 h-12 rounded-full">
            {session?.user?.image ? <Avatar.Image source={{ uri: session.user.image }} /> : null}
            <Avatar.Fallback className="bg-amber-100 text-amber-800">
              {isAuthenticated ? userInitials : "G"}
            </Avatar.Fallback>
          </Avatar>
        </Pressable>
      </View>

      {/* Hero Title */}
      <View className="items-center my-6">
        <Text className="text-3xl font-bold text-slate-900 text-center tracking-tight">
          Get it delivered <Text className="text-indigo-600">now.</Text>
        </Text>
      </View>

      {/* Location Selection Card */}
      <View
        className="bg-white rounded-2xl p-4 border border-slate-100/80 my-2"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        {/* Pick-up Field */}
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/location-search",
              params: { type: "pickup" },
            })
          }
          className="flex-row items-center py-2 px-1 active:opacity-70"
        >
          <HugeiconsIcon icon={PinLocation01Icon} size={20} color="#000000" />
          <Text
            className={`ml-4 flex-1 text-sm ${
              hasPickup ? "text-slate-900 font-medium" : "text-slate-400"
            }`}
            numberOfLines={1}
          >
            {draft.pickup?.label || "Pick-up Location"}
          </Text>
        </Pressable>

        {/* Dotted Vertical Connector & Horizontal Divider */}
        <View className="flex-row items-center my-1">
          <View className="w-5 items-center justify-center">
            <View className="w-0.5 h-1 bg-indigo-500 rounded-full my-0.5" />
            <View className="w-0.5 h-1 bg-indigo-500 rounded-full my-0.5" />
            <View className="w-0.5 h-1 bg-indigo-500 rounded-full my-0.5" />
          </View>
          <View className="flex-1 ml-4 border-b border-dashed border-slate-200" />
        </View>

        {/* Drop-off Field */}
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/location-search",
              params: { type: "dropoff" },
            })
          }
          className="flex-row items-center py-2 px-1 active:opacity-70"
        >
          <HugeiconsIcon icon={PinLocation01Icon} size={20} color="#000000" />
          <Text
            className={`ml-4 flex-1 text-sm ${
              hasDropoff ? "text-slate-900 font-medium" : "text-slate-400"
            }`}
            numberOfLines={1}
          >
            {draft.dropoff?.label || "Drop-off Location"}
          </Text>
        </Pressable>
      </View>

      {/* Action Button */}
      <View className="flex-1 justify-end pb-4">
        {hasBothLocations && (
          <Button
            size="lg"
            className="w-full bg-indigo-600 rounded-xl py-4 flex-row items-center justify-center active:opacity-90"
            onPress={handleContinue}
          >
            <Button.Label className="font-semibold text-base text-white mr-2">
              {isAuthenticated ? "Continue Delivery Request" : "Sign In to Continue"}
            </Button.Label>
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} color="#ffffff" />
          </Button>
        )}
      </View>
    </Container>
  );
}
