import { Button } from "heroui-native/button";
import { cn } from "heroui-native/utils";
import { type ReactNode } from "react";
import { Text, View } from "react-native";

import { Container } from "@ludika/mobile-ui";

export const ORDER_STEP_COUNT = 4;

type Props = {
  /** 1-based position in the Order flow, used for the counter and the dots. */
  step: number;
  title: string;
  description: string;
  children: ReactNode;
  /** Omit on a terminal step and no footer button renders. */
  onNext?: () => void;
  nextLabel?: string;
};

/** Shared chrome for the Order steps: counter, dots, and the footer button. */
export function OrderStep({ step, title, description, children, onNext, nextLabel }: Props) {
  return (
    <Container className="p-6">
      <View className="mb-6">
        <Text className="text-muted text-xs font-medium mb-2">
          Step {step} of {ORDER_STEP_COUNT}
        </Text>
        <View className="flex-row gap-1.5 mb-4">
          {Array.from({ length: ORDER_STEP_COUNT }, (_, index) => (
            <View
              key={index}
              className={cn(
                "h-1 flex-1 rounded-full",
                index < step ? "bg-accent" : "bg-surface-secondary",
              )}
            />
          ))}
        </View>
        <Text className="text-2xl font-bold text-foreground mb-1">{title}</Text>
        <Text className="text-muted text-sm">{description}</Text>
      </View>

      <View className="gap-4">{children}</View>

      {onNext && (
        <Button onPress={onNext} className="mt-8">
          <Button.Label>{nextLabel ?? "Next"}</Button.Label>
        </Button>
      )}
    </Container>
  );
}
