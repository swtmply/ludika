import { Link, router } from "expo-router";
import { Text, View } from "react-native";

import { Container, SignUp } from "@ludika/mobile-ui";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/trpc";

export default function SignUpScreen() {
  return (
    <Container className="p-6">
      <View className="py-4 mb-6">
        <Text className="text-4xl font-bold text-foreground mb-2">DRIVER APP</Text>
        <Text className="text-muted text-sm">Create an account to get started.</Text>
      </View>

      <SignUp
        onSubmit={async ({ name, email, password }) => {
          const { error } = await authClient.signUp.email({ name, email, password });
          return { error: error?.message ?? null };
        }}
        onSuccess={() => {
          queryClient.refetchQueries();
          router.replace("/home");
        }}
      />

      <View className="flex-row justify-center items-center gap-1 mt-6">
        <Text className="text-muted text-sm">Already have an account?</Text>
        <Link href="/sign-in" replace asChild>
          <Text className="text-link text-sm font-medium">Sign in</Text>
        </Link>
      </View>
    </Container>
  );
}
