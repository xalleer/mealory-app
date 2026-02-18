import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";

import { AuthScreen } from "@/components/layout/AuthScreen";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { api } from "@/lib/axios";

type Params = {
  email?: string;
  otp?: string;
};

const schema = z
  .object({
    password: z.string().min(6, "Мінімум 6 символів"),
    confirmPassword: z.string().min(6, "Мінімум 6 символів"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Паролі не співпадають",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();

  const email = typeof params.email === "string" ? params.email : "";
  const otp = typeof params.otp === "string" ? params.otp : "";

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      await api.post("/auth/reset-password", {
        email,
        otp,
        password: values.password,
      });
    },
    onSuccess: () => {
      router.replace("/(auth)/login");
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <AuthScreen
      title="Новий пароль"
      subtitle="Створіть новий пароль"
    >
      <View style={styles.form}>
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Input
              label="Пароль"
              value={value}
              onChangeText={onChange}
              placeholder="••••••••"
              secureTextEntry
              error={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Input
              label="Підтвердіть пароль"
              value={value}
              onChangeText={onChange}
              placeholder="••••••••"
              secureTextEntry
              error={error?.message}
            />
          )}
        />

        <Button
          title={mutation.isPending ? "Збереження..." : "Скинути пароль"}
          onPress={onSubmit}
          disabled={mutation.isPending}
        />

        {mutation.error ? (
          <Text style={styles.error}>Не вдалось змінити пароль.</Text>
        ) : null}
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.lg },
  error: { ...Typography.bodySmall, color: Colors.error },
});
