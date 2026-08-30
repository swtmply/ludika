import type { ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HeroUINativeProvider } from "heroui-native/provider";
import type { HeroUINativeProviderProps } from "heroui-native/provider";

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
