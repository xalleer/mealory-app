import { Button } from "@/components/ui/Button";
import { Colors, Shadows, Spacing, Typography } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

export function EmptyCard({
  title,
  description,
  actionLabel,
  onPress,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={[styles.cardSubtitle, { marginTop: Spacing.sm }]}>{description}</Text>
      {actionLabel && onPress ? (
        <View style={{ marginTop: Spacing.md }}>
          <Button title={actionLabel} onPress={onPress} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 24,
    padding: Spacing.xl,
    ...Shadows.lg,
  },
  cardTitle: {
    ...Typography.h4,
    color: Colors.text.primary,
    flex: 1,
  },
  cardSubtitle: {
    marginTop: Spacing.xs,
    ...Typography.bodySmall,
    color: Colors.text.secondary,
  },
});
