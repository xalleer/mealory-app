import { Button } from "@/components/ui/Button";
import { Colors, Spacing, Typography } from "@/constants/theme";
import type { Recipe } from "@/lib/api/menu.api";
import type { UseMutationResult } from "@tanstack/react-query";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import type { RefObject } from "react";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";

function getRecipeInstructions(instructions: unknown): string[] {
  if (!instructions) return [];
  if (Array.isArray(instructions)) {
    return instructions.map((s) => String(s)).filter(Boolean);
  }
  if (typeof instructions === "string") {
    try {
      const parsed = JSON.parse(instructions);
      if (Array.isArray(parsed)) return parsed.map((s) => String(s)).filter(Boolean);
    } catch {
      return [instructions];
    }
  }
  return [];
}

export function RecipeSheet({
  sheetRef,
  snapPoints,
  recipe,
  onComplete,
  updateMealStatus,
  onDismiss,
}: {
  sheetRef: RefObject<BottomSheetModal>;
  snapPoints: (string | number)[];
  recipe: Recipe | null;
  onComplete: () => void;
  updateMealStatus: Pick<UseMutationResult<any, any, any, any>, "isPending">;
  onDismiss: () => void;
}) {
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      onDismiss={onDismiss}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.sheetHandle}
    >
      <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
        <Text style={styles.sheetTitle}>{recipe?.name ?? "Рецепт"}</Text>
        {recipe?.description ? <Text style={styles.sheetDescription}>{recipe.description}</Text> : null}

        <View style={styles.sheetMetaRow}>
          {typeof recipe?.cookingTime === "number" ? (
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>⏱ {recipe.cookingTime} хв</Text>
            </View>
          ) : null}
          {typeof recipe?.servings === "number" ? (
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>🍽 {recipe.servings} порц.</Text>
            </View>
          ) : null}
          {typeof recipe?.calories === "number" ? (
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>🔥 {recipe.calories} ккал</Text>
            </View>
          ) : null}
          {typeof recipe?.protein === "number" ? (
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>P {recipe.protein}г</Text>
            </View>
          ) : null}
          {typeof recipe?.fats === "number" ? (
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>Ж {recipe.fats}г</Text>
            </View>
          ) : null}
          {typeof recipe?.carbs === "number" ? (
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>В {recipe.carbs}г</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Інгредієнти</Text>
          {recipe?.ingredients?.length ? (
            <View style={styles.list}>
              {recipe.ingredients.map((ing) => (
                <View key={ing.id} style={styles.listRow}>
                  <Text style={styles.listRowTitle}>{ing.product?.name ?? "Продукт"}</Text>
                  <Text style={styles.listRowValue}>
                    {ing.quantity} {ing.unit}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Немає інгредієнтів</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Інструкції</Text>
          {getRecipeInstructions(recipe?.instructions).length ? (
            <View style={styles.instructions}>
              {getRecipeInstructions(recipe?.instructions).map((step, idx) => (
                <View key={`${idx}-${step}`} style={styles.instructionRow}>
                  <Text style={styles.instructionIndex}>{idx + 1}.</Text>
                  <Text style={styles.instructionText}>{step}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Немає інструкцій</Text>
          )}
        </View>

        <View style={{ marginTop: Spacing.lg }}>
          <Button
            title={updateMealStatus.isPending ? "Завантаження..." : "Приготувати ✓"}
            onPress={onComplete}
            disabled={updateMealStatus.isPending}
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: Colors.background,
  },
  sheetHandle: {
    backgroundColor: Colors.border.medium,
    width: 44,
  },
  sheetContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  sheetTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  sheetDescription: {
    marginTop: Spacing.sm,
    ...Typography.body,
    color: Colors.text.secondary,
  },
  sheetMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  metaPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  metaPillText: {
    ...Typography.caption,
    color: Colors.text.primary,
    fontWeight: "600",
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  list: {
    gap: Spacing.sm,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  listRowTitle: {
    ...Typography.body,
    color: Colors.text.primary,
    flex: 1,
  },
  listRowValue: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    fontWeight: "600",
  },
  instructions: {
    gap: Spacing.md,
  },
  instructionRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  instructionIndex: {
    ...Typography.bodySmall,
    color: Colors.primaryDark,
    fontWeight: "800",
    width: 20,
  },
  instructionText: {
    ...Typography.body,
    color: Colors.text.primary,
    flex: 1,
  },
  emptyText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
  },
});
