import { Redirect } from "expo-router";
import { Spinner } from "heroui-native/spinner";
import { View } from "react-native";

import { Container } from "@ludika/mobile-ui";
import { authClient } from "@/lib/auth-client";

/** Route gate: sends drivers to the app when signed in, to auth when not. */
export default function Index() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <Container isScrollable={false}>
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </Container>
    );
  }

  return <Redirect href={session?.user ? "/home" : "/sign-in"} />;
}
