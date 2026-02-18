import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { z } from "zod";

import { AuthFooterCTA } from '@/components/layout/AuthFooterCTA';
import { AuthScreen } from "@/components/layout/AuthScreen";
import { BottomSheetModal } from '@/components/ui/BottomSheetModal';
import { Button } from "@/components/ui/Button";
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from "@/components/ui/Input";
import { OrDivider } from '@/components/ui/OrDivider';
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SocialAuthButton } from '@/components/ui/SocialAuthButton';
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useRegistrationStore } from "@/stores/registration.store";

const schema = z
  .object({
    name: z.string().min(2, "Введіть ім'я"),
    email: z.string().email("Введіть коректний email"),
    password: z.string().min(6, "Мінімум 6 символів"),
    confirmPassword: z.string().min(6, "Мінімум 6 символів"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Паролі не співпадають",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterStep1() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const name = useRegistrationStore((s) => s.name);
  const email = useRegistrationStore((s) => s.email);
  const password = useRegistrationStore((s) => s.password);
  const setStep1 = useRegistrationStore((s) => s.setStep1);

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name,
      email,
      password,
      confirmPassword: password,
    },
  });

  const onSubmit = handleSubmit((values) => {
    setStep1({ name: values.name, email: values.email, password: values.password });
    router.push("/(auth)/register/step-2");
  });

  return (
    <AuthScreen
      title="Створіть акаунт"
      subtitle="Заповніть основні дані"
      footer={
        <>
          <AuthFooterCTA text="Вже є акаунт?" ctaLabel="Увійти" href="/(auth)/login" />

          <Pressable onPress={() => router.back()}>
            <Text style={styles.backButton}>Назад</Text>
          </Pressable>
        </>
      }
    >
      <ProgressBar step={1} total={4} />

      <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Input
              label="Ім'я"
              value={value}
              onChangeText={onChange}
              placeholder="Іван"
              error={error?.message}
            />
          )}
        />

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
              right={
                <Pressable onPress={() => setShowPassword((v: boolean) => !v)}>
                  <Text style={styles.passwordToggleText}>
                    {showPassword ? "Сховати" : "Показати"}
                  </Text>
                </Pressable>
              }
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
              secureTextEntry={!showConfirmPassword}
              right={
                <Pressable onPress={() => setShowConfirmPassword((v: boolean) => !v)}>
                  <Text style={styles.passwordToggleText}>
                    {showConfirmPassword ? "Сховати" : "Показати"}
                  </Text>
                </Pressable>
              }
              error={error?.message}
            />
          )}
        />

        <View style={styles.termsRow}>
          <Checkbox
            checked={acceptedTerms}
            label={
              <Text style={styles.termsLabelText}>
                Я приймаю{' '}
                <Text style={styles.termsLinkInline} onPress={() => setTermsOpen(true)}>
                  умови користування
                </Text>
              </Text>
            }
            onPress={() => setAcceptedTerms((v) => !v)}
          />
        </View>

        <Button title="Далі" onPress={onSubmit} disabled={!acceptedTerms} />

        <OrDivider />

        <View style={styles.socialButtons}>
          <SocialAuthButton provider="google" onPress={() => console.log('Google register placeholder')} />
          <SocialAuthButton provider="apple" onPress={() => console.log('Apple register placeholder')} />
        </View>

      </View>

      <BottomSheetModal
        visible={termsOpen}
        onClose={() => setTermsOpen(false)}
        title="Умови користування"
        size="lg"
        footer={<Button title="Зрозуміло" onPress={() => setTermsOpen(false)} />}
      >
        <Text style={styles.termsText}>
          Тут буде текст умов користування. Додай свій текст або підключимо його з бекенду/файлу.
        </Text>
      </BottomSheetModal>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: Spacing.xl,
    gap: Spacing.lg,
  },
  backButton: {
    textAlign: 'center',
    ...Typography.bodySmall,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)',
  },
  passwordToggleText: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primary,
  },
  termsRow: {
    marginTop: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: Spacing.md,
  },
  termsLabelText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
  },
  termsLinkInline: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  termsText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  socialButtons: {
    gap: Spacing.md,
  },
});
