import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

import { AuthScreen } from "@/components/layout/AuthScreen";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useRegistrationStore } from "@/stores/registration.store";
import { getErrorMessage, useRegisterMutation } from "../../../hooks/useAuthMutations";
import type { RegisterPayload } from "../../../types/auth";

const schema = z.object({
  weeklyBudgetUah: z
    .string()
    .min(1, "Введіть бюджет")
    .refine((v) => Number(v) > 0, "Бюджет має бути більше 0"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterStep4() {
  useSafeAreaInsets();

  const registration = useRegistrationStore();
  const resetRegistration = useRegistrationStore((s) => s.reset);
  const setStep4 = useRegistrationStore((s) => s.setStep4);

  const registerMutation = useRegisterMutation();

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      weeklyBudgetUah:
        registration.weeklyBudget == null ? "" : String(registration.weeklyBudget),
    },
  });

  const onSubmit = handleSubmit((values) => {
    const weeklyBudgetNumber = Number(values.weeklyBudgetUah);
    setStep4({ weeklyBudget: Number.isNaN(weeklyBudgetNumber) ? null : weeklyBudgetNumber });

    const store = useRegistrationStore.getState();

    if (!store.goal || !store.height || !store.weight) {
      console.error("Missing required fields", store);
      return;
    }


    const payload: RegisterPayload = {
      email: store.email,
      password: store.password,
      name: store.name,
      height: store.height,
      weight: store.weight,
      goal: store.goal,
      mealTimes: store.mealTimes,
      allergies: store.allergies,
      weeklyBudget: store.weeklyBudget ?? undefined,
      familyMembers:
        store.familyMembers.length > 0
          ? store.familyMembers.map((m) => ({
              name: m.name,
              mealTimes: m.mealTimes,
              allergies: m.allergies,
            }))
          : undefined,
    };

    console.log(payload);


    registerMutation.mutate(payload, {
      onSuccess: () => {
        resetRegistration();
      },
    });
  });

  return (
    <AuthScreen
      title="Бюджет"
      subtitle="Бюджет розраховується на всіх членів сім'ї"
    >
      <ProgressBar step={4} total={4} />

      <View style={styles.form}>
        <Controller
          control={control}
          name="weeklyBudgetUah"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Input
              label="Тижневий бюджет (₴)"
              value={value}
              onChangeText={(v) => onChange(v.replace(/[^0-9]/g, ""))}
              placeholder="2000"
              keyboardType="numeric"
              error={error?.message}
            />
          )}
        />

        <Button
          title={registerMutation.isPending ? "Завершення..." : "Завершити реєстрацію"}
          onPress={onSubmit}
          disabled={registerMutation.isPending}
        />

        {registerMutation.error ? (
          <Text style={styles.error}>
            {getErrorMessage(registerMutation.error)}
          </Text>
        ) : null}
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 24, gap: 16 },
  error: { fontSize: 14, color: '#DC2626' },
});
