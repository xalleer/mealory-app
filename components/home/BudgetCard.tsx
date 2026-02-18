import { Button } from "@/components/ui/Button";
import { Colors, Shadows, Spacing, Typography } from "@/constants/theme";
import { formatDateRange } from "@/utils/meal-time";
import { StyleSheet, Text, View } from "react-native";

export function BudgetCard({
  weeklyBudget,
  budgetUsed,
  periodStart,
  periodEnd,
  onSetBudget,
}: {
  weeklyBudget: number | null;
  budgetUsed: number;
  periodStart: string | null;
  periodEnd: string | null;
  onSetBudget: () => void;
}) {
  if (!weeklyBudget) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Бюджет тижня</Text>
        </View>
        <Text style={styles.cardSubtitle}>Бюджет не встановлено</Text>
        <View style={{ marginTop: Spacing.md }}>
          <Button title="Встановити бюджет" onPress={onSetBudget} />
        </View>
      </View>
    );
  }

  const progress = Math.min(1, weeklyBudget > 0 ? budgetUsed / weeklyBudget : 0);

  const badge = (() => {
    if (budgetUsed >= weeklyBudget) {
      return { label: "Перевикористано", bg: Colors.error + "1A", fg: Colors.error };
    }
    if (budgetUsed >= weeklyBudget * 0.8) {
      return { label: "Закінчується", bg: Colors.warning + "1A", fg: Colors.warning };
    }
    return { label: "В межах норми", bg: Colors.success + "1A", fg: Colors.success };
  })();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>Бюджет тижня</Text>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.fg }]}>{badge.label}</Text>
        </View>
      </View>
      <Text style={styles.cardSubtitle}>{formatDateRange(periodStart, periodEnd)}</Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>

      <Text style={styles.budgetText}>
        Використано: ₴{budgetUsed} з ₴{weeklyBudget}
      </Text>
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
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
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
  progressTrack: {
    marginTop: Spacing.lg,
    height: 10,
    borderRadius: 999,
    backgroundColor: Colors.border.light,
    overflow: "hidden",
  },
  progressFill: {
    height: 10,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  budgetText: {
    marginTop: Spacing.md,
    ...Typography.body,
    color: Colors.text.primary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    ...Typography.caption,
    fontWeight: "700",
  },
});
