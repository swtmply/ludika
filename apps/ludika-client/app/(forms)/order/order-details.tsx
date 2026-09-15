import { router } from "expo-router";
import { Input } from "heroui-native/input";
import { Label } from "heroui-native/label";
import { TextArea } from "heroui-native/text-area";
import { TextField } from "heroui-native/text-field";

import { useOrderDraft } from "@/components/order-draft-context";
import { OrderStep } from "@/components/order-step";

export default function OrderDetailsScreen() {
  const { draft, update } = useOrderDraft();

  return (
    <OrderStep
      step={2}
      title="Order details"
      description="Who the Driver should look for, and anything they need to know."
      onNext={() => router.push("/order/item-details")}
    >
      <TextField>
        <Label>Contact name</Label>
        <Input
          value={draft.contactName}
          onChangeText={(contactName) => update({ contactName })}
          placeholder="Who is handing the Items over?"
          autoComplete="name"
        />
      </TextField>

      <TextField>
        <Label>Contact number</Label>
        <Input
          value={draft.contactPhone}
          onChangeText={(contactPhone) => update({ contactPhone })}
          placeholder="09XX XXX XXXX"
          keyboardType="phone-pad"
          autoComplete="tel"
        />
      </TextField>

      <TextField>
        <Label>Notes for the Driver</Label>
        <TextArea
          value={draft.notes}
          onChangeText={(notes) => update({ notes })}
          placeholder="Gate code, floor, landmarks..."
        />
      </TextField>
    </OrderStep>
  );
}
