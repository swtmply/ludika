import { Redirect, router } from "expo-router";
import { Button } from "heroui-native/button";
import { Card } from "heroui-native/card";
import { Spinner } from "heroui-native/spinner";
import { Text, View } from "react-native";

import { Container } from "@ludika/mobile-ui";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/trpc";

export default function Account() {
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

  if (!session?.user) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Container className="p-6">
      <Card variant="secondary" className="p-4">
        <Text className="text-foreground text-base font-medium mb-1">{session.user.name}</Text>
        <Text className="text-muted text-sm mb-4">{session.user.email}</Text>
        <Button
          variant="danger"
          size="sm"
          className="self-start"
          onPress={async () => {
            await authClient.signOut();
            queryClient.invalidateQueries();
            // Tear the order flow down too, or Android back re-enters it with no session.
            router.dismissAll();
            router.replace("/sign-in");
          }}
        >
          <Button.Label>Sign out</Button.Label>
        </Button>
      </Card>
    </Container>
  );
}
