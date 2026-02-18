import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AuthScreen } from "@/components/layout/AuthScreen";
import { Button } from "@/components/ui/Button";
import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import { api } from "@/lib/axios";

type Params = {
  email?: string;
};

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();

  const email = typeof params.email === "string" ? params.email : "";

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const otp = useMemo(() => digits.join(""), [digits]);

  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/verify-otp", { email, otp });
    },
    onSuccess: () => {
      router.push({ pathname: "/(auth)/reset-password", params: { email, otp } });
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/forgot-password", { email });
    },
    onSuccess: () => {
      setCooldown(60);
    },
  });

  const setDigit = (index: number, value: string) => {
    const v = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });

    if (v && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const onBackspace = (index: number) => {
    if (digits[index]) {
      setDigit(index, "");
      return;
    }

    if (index > 0) {
      inputsRef.current[index - 1]?.focus();
      setDigit(index - 1, "");
    }
  };

  return (
    <AuthScreen
      title="Підтвердження"
      subtitle={`Введіть 6-значний код, надісланий на ${email || "ваш email"}`}
    >
      <View style={styles.otpContainer}>
        {digits.map((d, idx) => (
          <TextInput
            key={idx}
            ref={(r) => {
              inputsRef.current[idx] = r;
            }}
            value={d}
            onChangeText={(v) => setDigit(idx, v)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace") onBackspace(idx);
            }}
            keyboardType="numeric"
            maxLength={1}
            style={styles.otpInput}
          />
        ))}
      </View>

      <View style={styles.form}>
        <Button
          title={verifyMutation.isPending ? "Перевірка..." : "Підтвердити"}
          onPress={() => verifyMutation.mutate()}
          disabled={verifyMutation.isPending || otp.length !== 6}
        />

        {verifyMutation.error ? (
          <Text style={styles.error}>Невірний код. Спробуйте ще раз.</Text>
        ) : null}

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Не отримали код? </Text>
          <Pressable
            disabled={cooldown > 0 || resendMutation.isPending}
            onPress={() => resendMutation.mutate()}
          >
            <Text style={[styles.resendButton, cooldown > 0 && styles.resendButtonDisabled]}>
              Надіслати ще раз{cooldown > 0 ? ` (${cooldown}s)` : ""}
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  otpContainer: {
    marginTop: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpInput: {
    height: 56,
    width: 48,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  form: {
    marginTop: Spacing.xl,
    gap: Spacing.lg,
  },
  error: {
    ...Typography.bodySmall,
    color: Colors.error,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  resendButton: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.primary,
  },
  resendButtonDisabled: {
    color: Colors.text.tertiary,
  },
});
