import { Button } from "@/components/ui/Button";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профіль</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Ім&#39;я</Text>
        <Text style={styles.value}>{user?.name ?? "—"}</Text>
        <View style={styles.row} />
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email ?? "—"}</Text>
      </View>

      <Button
        title="Вийти"
        variant="secondary"
        onPress={async () => {
          await logout();
          router.replace("/(auth)/welcome" as any);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  title: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  card: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 24,
    padding: Spacing.xl,
    gap: Spacing.xs,
  },
  row: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.md,
  },
  label: {
    ...Typography.bodySmall,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  value: {
    ...Typography.body,
    color: Colors.text.primary,
  },
});
