import { MapsLocation01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { useThemeColor } from "heroui-native/hooks";
import { Input } from "heroui-native/input";
import { Label } from "heroui-native/label";
import { Surface } from "heroui-native/surface";
import { TextField } from "heroui-native/text-field";
import { Text } from "react-native";

import { useOrderDraft } from "@/components/order-draft-context";
import { OrderStep } from "@/components/order-step";

export default function PickupDropoffScreen() {
  const { draft, update } = useOrderDraft();
  const mutedColor = useThemeColor("muted");

  return (
    <OrderStep
      step={1}
      title="Where to?"
      description="Drop a Pin for pickup and for drop-off. No map library yet, so type an address."
      onNext={() => router.push("/order/order-details")}
    >
      <Surface variant="secondary" className="h-40 rounded-lg items-center justify-center">
        <HugeiconsIcon icon={MapsLocation01Icon} size={28} color={mutedColor} />
        <Text className="text-muted text-sm mt-2">Map placeholder</Text>
      </Surface>

      <TextField>
        <Label>Pickup</Label>
        <Input
          value={draft.pickup?.label ?? ""}
          onChangeText={(label) => update({ pickup: { label, latitude: null, longitude: null } })}
          placeholder="Where should the Driver collect from?"
        />
      </TextField>

      <TextField>
        <Label>Drop-off</Label>
        <Input
          value={draft.dropoff?.label ?? ""}
          onChangeText={(label) => update({ dropoff: { label, latitude: null, longitude: null } })}
          placeholder="Where is it going?"
        />
      </TextField>
    </OrderStep>
  );
}
