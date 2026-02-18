import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";

import { AuthScreen } from "@/components/layout/AuthScreen";
import { Colors, Spacing, Typography } from "@/constants/theme";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/axios";

const schema = z.object({
  email: z.string().email("Введіть коректний email"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      await api.post("/auth/forgot-password", values);
    },
    onSuccess: (_, values) => {
      router.push({ pathname: "/(auth)/verify-otp", params: { email: values.email } });
    },
  });

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(values);
  });

  return (
    <AuthScreen
      title="Відновлення паролю"
      subtitle="Вкажіть email — ми надішлемо код підтвердження"
    >
      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Input
              label="Email"
              value={value}
              onChangeText={onChange}
              placeholder="name@email.com"
              keyboardType="email-address"
              error={error?.message}
            />
          )}
        />

        <Button
          title={mutation.isPending ? "Надсилання..." : "Надіслати код"}
          onPress={onSubmit}
          disabled={mutation.isPending}
        />

        {mutation.error ? (
          <Text style={styles.error}>
            Не вдалось надіслати код. Спробуйте ще раз.
          </Text>
        ) : null}
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.lg },
  error: { ...Typography.bodySmall, color: Colors.error },
});
