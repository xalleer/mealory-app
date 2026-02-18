import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AuthScreen } from "@/components/layout/AuthScreen";
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';

import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Slider } from "@/components/ui/Slider";
import { GOALS } from "@/constants/goals";
import { useRegistrationStore } from "@/stores/registration.store";

export default function RegisterStep2() {
  const router = useRouter();

  const height = useRegistrationStore((s) => s.height);
  const weight = useRegistrationStore((s) => s.weight);
  const goal = useRegistrationStore((s) => s.goal);
  const setStep2 = useRegistrationStore((s) => s.setStep2);

  const canContinue = !!goal && height != null && weight != null;

  return (
    <AuthScreen
      title="Про вас"
      subtitle="Додайте параметри та ціль"
    >
      <ProgressBar step={2} total={4} />

      <View style={styles.form}>
        <Slider
          label="Зріст"
          value={height ?? 0}
          onValueChange={(v) => setStep2({ height: v, weight: weight ?? 0, goal: goal ?? "weight_loss" })}
          minimumValue={120}
          maximumValue={220}
          step={1}
          unit="см"
        />

        <Slider
          label="Вага"
          value={weight ?? 0}
          onValueChange={(v) => setStep2({ height: height ?? 0, weight: v, goal: goal ?? "weight_loss" })}
          minimumValue={30}
          maximumValue={200}
          step={0.5}
          unit="кг"
        />

        <Text style={styles.goalLabel}>Ціль</Text>
        <View style={styles.goalList}>
          {GOALS.map((g) => {
            const selected = goal === g.id;
            return (
              <Pressable
                key={g.id}
                onPress={() => setStep2({ height: height ?? 0, weight: weight ?? 0, goal: g.id })}
                style={[styles.goalItem, selected ? styles.goalItemSelected : styles.goalItemDefault]}
              >
                <View style={styles.goalRow}>
                  <View style={[styles.goalIconWrap, selected && styles.goalIconWrapSelected]}>
                    <Ionicons
                      name={g.icon as any}
                      size={18}
                      color={selected ? Colors.text.inverse : Colors.primary}
                    />
                  </View>
                  <Text style={[styles.goalText, selected && styles.goalTextSelected]}>
                    {g.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.buttons}>
          <Button
            title="Далі"
            onPress={() => router.push("/(auth)/register/step-3")}
            disabled={!canContinue}
          />
          <Button title="Назад" variant="secondary" onPress={() => router.back()} />
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: Spacing.xl,
    gap: Spacing.xl,
  },
  goalLabel: {
    marginTop: Spacing.md,
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  goalList: {
    gap: Spacing.md,
  },
  goalItem: {
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    padding: Spacing.lg,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIconWrap: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '12',
    marginRight: Spacing.md,
  },
  goalIconWrapSelected: {
    backgroundColor: Colors.primary,
  },
  goalItemDefault: {
    borderColor: Colors.border.light,
    backgroundColor: Colors.background,
  },
  goalItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  goalText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  goalTextSelected: {
    color: Colors.primary,
  },
  buttons: {
    marginTop: Spacing.xxl,
    gap: Spacing.md,
  },
});
