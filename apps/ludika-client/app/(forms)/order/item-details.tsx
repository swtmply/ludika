import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { Button } from "heroui-native/button";
import { useThemeColor } from "heroui-native/hooks";
import { Input } from "heroui-native/input";
import { Label } from "heroui-native/label";
import { Surface } from "heroui-native/surface";
import { TextField } from "heroui-native/text-field";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { useOrderDraft } from "@/components/order-draft-context";
import { OrderStep } from "@/components/order-step";

export default function ItemDetailsScreen() {
  const { draft, update } = useOrderDraft();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");
  const dangerColor = useThemeColor("danger");

  const canAdd = name.trim().length > 0;

  function addItem() {
    if (!canAdd) return;

    update({
      items: [
        ...draft.items,
        {
          id: `${Date.now()}`,
          name: name.trim(),
          quantity: Number(quantity) || 1,
          note: note.trim(),
        },
      ],
    });

    setName("");
    setQuantity("1");
    setNote("");
  }

  function removeItem(id: string) {
    update({ items: draft.items.filter((item) => item.id !== id) });
  }

  return (
    <OrderStep
      step={3}
      title="Item details"
      description="What the Driver is carrying. An Order can hold more than one Item."
      nextLabel="Place order"
      onNext={() => {
        // Clear the form steps first so the live feed cannot be backed into and edited.
        router.dismissAll();
        router.replace("/order/live-feed");
      }}
    >
      <TextField>
        <Label>Item</Label>
        <Input value={name} onChangeText={setName} placeholder="What is it?" />
      </TextField>

      <View className="flex-row gap-3">
        <TextField className="w-24">
          <Label>Qty</Label>
          <Input value={quantity} onChangeText={setQuantity} keyboardType="number-pad" />
        </TextField>

        <TextField className="flex-1">
          <Label>Note</Label>
          <Input value={note} onChangeText={setNote} placeholder="Fragile, keep upright..." />
        </TextField>
      </View>

      <Button variant="tertiary" onPress={addItem} isDisabled={!canAdd}>
        <Button.Label>Add item</Button.Label>
      </Button>

      {draft.items.length > 0 && (
        <Surface variant="secondary" className="rounded-lg p-4 gap-3">
          {draft.items.map((item) => (
            <View key={item.id} className="flex-row items-center gap-3">
              <View className="flex-1">
                <Text className="text-foreground font-medium">
                  {item.quantity}x {item.name}
                </Text>
                {item.note.length > 0 && <Text className="text-muted text-sm">{item.note}</Text>}
              </View>
              <Pressable
                onPress={() => removeItem(item.id)}
                hitSlop={8}
                className="active:opacity-70"
              >
                <HugeiconsIcon icon={Delete02Icon} size={18} color={dangerColor} />
              </Pressable>
            </View>
          ))}
        </Surface>
      )}
    </OrderStep>
  );
}
