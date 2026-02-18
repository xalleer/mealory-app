import { Button } from "@/components/ui/Button";
import { Colors, Shadows, Spacing, Typography } from "@/constants/theme";
import type { Meal } from "@/lib/api/menu.api";
import { getMealTypeLabel } from "@/utils/meal-time";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function CurrentMealCard({
  meal,
  onCookNow,
  onSkip,
}: {
  meal: Meal;
  onCookNow: (meal: Meal) => void;
  onSkip: (meal: Meal) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.mealHeaderRow}>
        <Text style={styles.mealType}>{getMealTypeLabel(meal.mealType)}</Text>
        <View style={[styles.badge, { backgroundColor: Colors.primary + "14" }]}>
          <Text style={[styles.badgeText, { color: Colors.primaryDark }]}>Очікує</Text>
        </View>
      </View>

      <Text style={styles.mealTitle} numberOfLines={2}>
        {meal.recipe?.name ?? "Рецепт"}
      </Text>

      <View style={styles.mealMetaRow}>
        {typeof meal.recipe?.cookingTime === "number" ? (
          <Text style={styles.mealMeta}>⏱ {meal.recipe.cookingTime} хв</Text>
        ) : null}
        {typeof meal.recipe?.calories === "number" ? (
          <Text style={styles.mealMeta}>🔥 {meal.recipe.calories} ккал</Text>
        ) : null}
      </View>

      <View style={styles.mealButtons}>
        <Button title="Приготувати зараз" onPress={() => onCookNow(meal)} />
        <Pressable
          onPress={() => onSkip(meal)}
          style={({ pressed }) => [styles.outlineDanger, pressed && styles.outlinePressed]}
        >
          <Text style={styles.outlineDangerText}>Пропустити</Text>
        </Pressable>
      </View>
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
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    ...Typography.caption,
    fontWeight: "700",
  },
  mealHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  mealType: {
    ...Typography.bodySmall,
    fontWeight: "700",
    color: Colors.text.secondary,
  },
  mealTitle: {
    marginTop: Spacing.md,
    ...Typography.h3,
    color: Colors.text.primary,
  },
  mealMetaRow: {
    marginTop: Spacing.sm,
    flexDirection: "row",
    gap: Spacing.md,
    flexWrap: "wrap",
  },
  mealMeta: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    fontWeight: "600",
  },
  mealButtons: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  outlineDanger: {
    width: "100%",
    height: 52,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.error,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  outlinePressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  outlineDangerText: {
    ...Typography.button,
    color: Colors.error,
  },
});
