import { TruckDeliveryIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { Button } from "heroui-native/button";
import { Chip } from "heroui-native/chip";
import { useThemeColor } from "heroui-native/hooks";
import { Separator } from "heroui-native/separator";
import { Surface } from "heroui-native/surface";
import { Text, View } from "react-native";

import { useOrderDraft } from "@/components/order-draft-context";
import { OrderStep } from "@/components/order-step";

export default function LiveFeedScreen() {
  const { draft, reset } = useOrderDraft();
  const mutedColor = useThemeColor("muted");

  const itemCount = draft.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <OrderStep
      step={4}
      title="Order placed"
      description="Read-only from here. This is where the Driver's position and status land."
    >
      <Surface variant="secondary" className="rounded-lg p-4 gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground font-medium">Status</Text>
          <Chip variant="secondary" color="warning" size="sm">
            <Chip.Label>Looking for a Driver</Chip.Label>
          </Chip>
        </View>
      </Surface>

      <Surface variant="secondary" className="h-40 rounded-lg items-center justify-center">
        <HugeiconsIcon icon={TruckDeliveryIcon} size={28} color={mutedColor} />
        <Text className="text-muted text-sm mt-2">Live map placeholder</Text>
      </Surface>

      <Surface variant="secondary" className="rounded-lg p-4 gap-3">
        <View>
          <Text className="text-muted text-xs mb-1">Pickup</Text>
          <Text className="text-foreground">{draft.pickup?.label || "Not set"}</Text>
        </View>
        <Separator />
        <View>
          <Text className="text-muted text-xs mb-1">Drop-off</Text>
          <Text className="text-foreground">{draft.dropoff?.label || "Not set"}</Text>
        </View>
        <Separator />
        <View>
          <Text className="text-muted text-xs mb-1">Items</Text>
          <Text className="text-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </Text>
        </View>
      </Surface>

      <Button
        variant="tertiary"
        className="mt-2"
        onPress={() => {
          reset();
          router.replace("/order/pickup-dropoff");
        }}
      >
        <Button.Label>Place another order</Button.Label>
      </Button>
    </OrderStep>
  );
}
