import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { OrDivider } from '@/components/ui/OrDivider';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[Colors.background, Colors.backgroundSecondary]}
      style={[styles.container, { paddingTop: insets.top + 24 }]}
    >
      <View style={styles.center}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryLight]}
            style={styles.iconGradient}
          >
            <Ionicons name="leaf" size={48} color={Colors.text.inverse} />
          </LinearGradient>
        </View>
        <Text style={styles.title}>Kitchen OS</Text>
        <Text style={styles.subtitle}>
          {"Плануйте харчування, бюджет та покупки разом із сім'єю."}
        </Text>
      </View>

      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 24 }]}>
        <Link href="/(auth)/login" asChild>
          <Button title="Увійти" />
        </Link>

        <OrDivider />

        <Link href="/(auth)/register/step-1" asChild>
          <Button title="Зареєструватись" variant="secondary" />
        </Link>

        <Button
          title="Приєднатись до сім'ї"
          onPress={() => {
            alert("Скоро буде доступно");
          }}
          variant="secondary"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: Spacing.xxxl,
  },
  iconGradient: {
    height: 96,
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.xxl,
    ...Shadows.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.bodyLarge,
    textAlign: 'center',
    color: Colors.text.secondary,
    paddingHorizontal: Spacing.xl,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
});
