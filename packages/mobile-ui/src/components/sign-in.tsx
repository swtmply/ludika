import { useForm } from "@tanstack/react-form";
import { Button } from "heroui-native/button";
import { FieldError } from "heroui-native/field-error";
import { Input } from "heroui-native/input";
import { Label } from "heroui-native/label";
import { Spinner } from "heroui-native/spinner";
import { Surface } from "heroui-native/surface";
import { TextField } from "heroui-native/text-field";
import { useToast } from "heroui-native/toast";
import { useRef } from "react";
import { Text, TextInput, View } from "react-native";
import z from "zod";

import { type AuthSubmitResult, type SignInValues } from "../lib/auth-form";
import { getErrorMessage } from "../lib/form-errors";

const signInSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required").min(8, "Use at least 8 characters"),
});

export type SignInProps = {
  /** Performs the sign-in. Return `{ error }` or throw to surface a failure. */
  onSubmit: (values: SignInValues) => Promise<AuthSubmitResult>;
  /** Runs after a successful sign-in, e.g. to refetch queries. */
  onSuccess?: () => void;
  title?: string;
};

export function SignIn({ onSubmit, onSuccess, title = "Sign In" }: SignInProps) {
  const passwordInputRef = useRef<TextInput>(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const result = await onSubmit({
          email: value.email.trim(),
          password: value.password,
        });

        if (result?.error) {
          toast.show({ variant: "danger", label: result.error });
          return;
        }

        formApi.reset();
        toast.show({ variant: "success", label: "Signed in successfully" });
        onSuccess?.();
      } catch (error) {
        toast.show({
          variant: "danger",
          label: getErrorMessage(error) ?? "Failed to sign in",
        });
      }
    },
  });

  return (
    <Surface variant="secondary" className="p-4 rounded-lg">
      <Text className="text-foreground font-medium mb-4">{title}</Text>

      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          validationError: getErrorMessage(state.errorMap.onSubmit),
        })}
      >
        {({ isSubmitting, validationError }) => {
          const formError = validationError;

          return (
            <>
              <FieldError isInvalid={!!formError} className="mb-3">
                {formError}
              </FieldError>

              <View className="gap-3">
                <form.Field name="email">
                  {(field) => (
                    <TextField>
                      <Label>Email</Label>
                      <Input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="email@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        textContentType="emailAddress"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                          passwordInputRef.current?.focus();
                        }}
                      />
                    </TextField>
                  )}
                </form.Field>

                <form.Field name="password">
                  {(field) => (
                    <TextField>
                      <Label>Password</Label>
                      <Input
                        ref={passwordInputRef}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChangeText={field.handleChange}
                        placeholder="••••••••"
                        secureTextEntry
                        autoComplete="password"
                        textContentType="password"
                        returnKeyType="go"
                        onSubmitEditing={form.handleSubmit}
                      />
                    </TextField>
                  )}
                </form.Field>

                <Button onPress={form.handleSubmit} isDisabled={isSubmitting} className="mt-1">
                  {isSubmitting ? (
                    <Spinner size="sm" color="default" />
                  ) : (
                    <Button.Label>Sign In</Button.Label>
                  )}
                </Button>
              </View>
            </>
          );
        }}
      </form.Subscribe>
    </Surface>
  );
}
