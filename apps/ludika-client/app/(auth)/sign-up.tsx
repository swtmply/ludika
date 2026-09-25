import { Link, router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { Container, SignUp } from "@ludika/mobile-ui";
import { useOrderDraft } from "@/components/order-draft-context";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/trpc";

export default function SignUpScreen() {
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
        <Text className="text-muted text-sm">Create an account to get started.</Text>
      </View>

      <SignUp
        onSubmit={async ({ name, email, password }) => {
          const { error } = await authClient.signUp.email({ name, email, password });
          return { error: error?.message ?? null };
        }}
        onSuccess={handleSuccess}
      />

      <View className="flex-row justify-center items-center gap-1 mt-6">
        <Text className="text-muted text-sm">Already have an account?</Text>
        <Link
          href={{
            pathname: "/sign-in",
            params: redirectTo ? { redirectTo } : undefined,
          }}
          replace
          asChild
        >
          <Text className="text-link text-sm font-medium">Sign in</Text>
        </Link>
      </View>
    </Container>
  );
}
