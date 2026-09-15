import { Link, router } from "expo-router";
import { Text, View } from "react-native";

import { Container, SignIn } from "@ludika/mobile-ui";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/trpc";

export default function SignInScreen() {
  return (
    <Container className="p-6">
      <View className="py-4 mb-6">
        <Text className="text-4xl font-bold text-foreground mb-2">CLIENT APP</Text>
        <Text className="text-muted text-sm">Sign in to continue.</Text>
      </View>

      <SignIn
        onSubmit={async ({ email, password }) => {
          const { error } = await authClient.signIn.email({ email, password });
          return { error: error?.message ?? null };
        }}
        onSuccess={() => {
          queryClient.refetchQueries();
          router.replace("/order/pickup-dropoff");
        }}
      />

      <View className="flex-row justify-center items-center gap-1 mt-6">
        <Text className="text-muted text-sm">No account yet?</Text>
        <Link href="/sign-up" replace asChild>
          <Text className="text-link text-sm font-medium">Create one</Text>
        </Link>
      </View>
    </Container>
  );
}
