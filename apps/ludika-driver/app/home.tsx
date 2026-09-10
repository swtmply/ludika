import { Redirect } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "heroui-native/card";
import { Chip } from "heroui-native/chip";
import { Spinner } from "heroui-native/spinner";
import { Pressable, Text, View } from "react-native";

import { Container } from "@ludika/mobile-ui";
import { authClient } from "@/lib/auth-client";
import { queryClient, trpc } from "@/utils/trpc";

/** Temporary signed-in landing screen until the real driver shell lands. */
export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());
  const privateData = useQuery(trpc.privateData.queryOptions());
  const isConnected = healthCheck.data === "OK";

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
      <Card variant="secondary" className="mb-6 p-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-foreground text-base">
            Welcome, <Text className="font-medium">{session.user.name}</Text>
          </Text>
          <Chip variant="secondary" color={isConnected ? "success" : "danger"} size="sm">
            <Chip.Label>{isConnected ? "LIVE" : "OFFLINE"}</Chip.Label>
          </Chip>
        </View>
        <Text className="text-muted text-sm mb-4">{session.user.email}</Text>
        <Pressable
          className="bg-danger py-3 px-4 rounded-lg self-start active:opacity-70"
          onPress={async () => {
            await authClient.signOut();
            queryClient.invalidateQueries();
          }}
        >
          <Text className="text-danger-foreground font-medium">Sign Out</Text>
        </Pressable>
      </Card>

      <Card variant="secondary" className="p-4">
        <Card.Title className="mb-3">Private Data</Card.Title>
        <Card.Description>
          {privateData.isLoading ? "Loading..." : (privateData.data?.message ?? "No data")}
        </Card.Description>
      </Card>
    </Container>
  );
}
