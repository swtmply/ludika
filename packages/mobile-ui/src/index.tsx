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

// Shared mobile components. Add one line per component; keep it alphabetical.
export { Container } from "./components/container";
export { SignIn, type SignInProps } from "./components/sign-in";
export { SignUp, type SignUpProps } from "./components/sign-up";
export { ThemeToggle } from "./components/theme-toggle";

// Theme
export { AppThemeProvider, useAppTheme } from "./theme/app-theme-context";

// Helpers shared by the components above
export type { AuthSubmitResult, SignInValues, SignUpValues } from "./lib/auth-form";
export { getErrorMessage } from "./lib/form-errors";
