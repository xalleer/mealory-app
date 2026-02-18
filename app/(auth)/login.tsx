import { GlobalStyles } from '@/constants/styles';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";


import { AuthFooterCTA } from '@/components/layout/AuthFooterCTA';
import { AuthScreen } from "@/components/layout/AuthScreen";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { OrDivider } from '@/components/ui/OrDivider';
import { SocialAuthButton } from '@/components/ui/SocialAuthButton';
import apiClient from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";
import { AuthResponse } from '@/types/auth';

const TOKEN_KEY = "auth_token";

const schema = z.object({
  email: z.string().email("Введіть коректний email"),
  password: z.string().min(6, "Мінімум 6 символів"),
});

type FormValues = z.infer<typeof schema>;


export default function LoginScreen() {
  useSafeAreaInsets();
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiClient.post<AuthResponse>("/auth/login", values);
      return res.data;
    },
    onSuccess: async (data) => {
  
      setToken(data.accessToken);
      setUser(data.user);
      await SecureStore.setItemAsync(TOKEN_KEY, data.accessToken);
      router.replace("/(app)" as any);
    },
    onError: (error) => {
      console.warn("[auth/login] request failed", error);
    },
  });

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values);
  });

  return (
    <AuthScreen
      title="Увійти"
      subtitle="Введіть email та пароль щоб продовжити"
      footer={
        <AuthFooterCTA
          text="Немає акаунту?"
          ctaLabel="Зареєструватись"
          href="/(auth)/register/step-1"
        />
      }
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

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Input
              label="Пароль"
              value={value}
              onChangeText={onChange}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              error={error?.message}
              right={
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.passwordToggle}
                >
                  <Text style={styles.passwordToggleText}>
                    {showPassword ? "Сховати" : "Показати"}
                  </Text>
                </Pressable>
              }
            />
          )}
        />

        <Link href="/(auth)/forgot-password">
          <Text style={styles.forgotPassword}>Забули пароль?</Text>
        </Link>

        <Button
          title={loginMutation.isPending ? "Завантаження..." : "Увійти"}
          onPress={onSubmit}
          disabled={loginMutation.isPending}
        />

        {loginMutation.error ? (
          <Text style={styles.error}>
            Не вдалось увійти. Перевірте дані та спробуйте ще раз.
          </Text>
        ) : null}

        <OrDivider />

        <View style={styles.socialButtons}>
          <SocialAuthButton provider="google" onPress={() => console.log("Google login placeholder")} />
          <SocialAuthButton provider="apple" onPress={() => console.log("Apple login placeholder")} />
        </View>

      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.lg,
  },
  passwordToggle: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  passwordToggleText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.primary,
  },
  forgotPassword: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.primary,
  },
  error: {
    ...GlobalStyles.error,
  },
  socialButtons: {
    gap: Spacing.md,
  },
});
