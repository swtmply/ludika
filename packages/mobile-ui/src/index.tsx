import type { ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HeroUINativeProvider } from "heroui-native";
import type { HeroUINativeProviderProps } from "heroui-native";

export interface MobileUIProviderProps extends Omit<HeroUINativeProviderProps, "children"> {
  children: ReactNode;
}

export function MobileUIProvider({ children, ...providerProps }: MobileUIProviderProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider {...providerProps}>{children}</HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}

export * from "heroui-native";
