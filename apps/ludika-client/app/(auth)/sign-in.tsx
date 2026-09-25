import { Link, router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { Container, SignIn } from "@ludika/mobile-ui";
import { useOrderDraft } from "@/components/order-draft-context";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/trpc";

export default function SignInScreen() {
  const { redirectTo } = useLocalSearchParams<{ redirectTo?: string }>();
  const { draft } = useOrderDraft();

  const hasBothLocations = Boolean(draft.pickup?.label && draft.dropoff?.label);

  const handleSuccess = () => {
    queryClient.refetchQueries();
    if (redirectTo) {
      router.replace(redirectTo as any);
    } else if (hasBothLocations) {
      router.replace("/order/order-details");
    } else {
      router.replace("/");
    }
  };

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
        onSuccess={handleSuccess}
      />

      <View className="flex-row justify-center items-center gap-1 mt-6">
        <Text className="text-muted text-sm">No account yet?</Text>
        <Link
          href={{
            pathname: "/sign-up",
            params: redirectTo ? { redirectTo } : undefined,
          }}
          replace
          asChild
        >
          <Text className="text-link text-sm font-medium">Create one</Text>
        </Link>
      </View>
    </Container>
  );
}
