import { Redirect } from "expo-router";
import { Spinner } from "heroui-native/spinner";
import { View } from "react-native";

import { Container } from "@ludika/mobile-ui";
import { authClient } from "@/lib/auth-client";

/** Route gate: sends signed-in users to the app, everyone else to auth. */
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

  return <Redirect href={session?.user ? "/order/pickup-dropoff" : "/sign-in"} />;
}
