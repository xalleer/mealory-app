import { BudgetCard } from "@/components/home/BudgetCard";
import { CurrentMealCard } from "@/components/home/CurrentMealCard";
import { EmptyCard } from "@/components/home/EmptyCard";
import { RecipeSheet } from "@/components/home/RecipeSheet";
import { SkipMealSheet } from "@/components/home/SkipMealSheet";
import { Colors, Spacing } from "@/constants/theme";
import { useCurrentMenu, useFamilyInfo, useUpdateMealStatus } from "@/hooks/useHomeData";
import type { Meal, Recipe } from "@/lib/api/menu.api";
import { getTodayCurrentMeal } from "@/utils/meal-time";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  const familyQuery = useFamilyInfo();
  const menuQuery = useCurrentMenu();
  const updateMealStatus = useUpdateMealStatus();

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [skipMeal, setSkipMeal] = useState<Meal | null>(null);

  const recipeSheetRef = useRef<BottomSheetModal>(null);
  const skipSheetRef = useRef<BottomSheetModal>(null);
  const recipeSnapPoints = useMemo(() => ["60%", "92%"], []);
  const skipSnapPoints = useMemo(() => ["35%"], []);

  const family = familyQuery.data?.family ?? null;

  const noMenu = useMemo(() => {
    const status = (menuQuery.error as { response?: { status?: number } })?.response?.status;
    return status === 404;
  }, [menuQuery.error]);

  const currentMeal = useMemo(() => {
    if (!menuQuery.data?.days?.length) return null;
    return getTodayCurrentMeal(menuQuery.data.days);
  }, [menuQuery.data]);

  const isRefreshing = familyQuery.isRefetching || menuQuery.isRefetching;
  const onRefresh = useCallback(() => {
    familyQuery.refetch();
    menuQuery.refetch();
  }, [familyQuery, menuQuery]);

  const openRecipe = useCallback(
    (meal: Meal) => {
      setSelectedMeal(meal);
      recipeSheetRef.current?.present();
    },
    []
  );

  const openSkip = useCallback(
    (meal: Meal) => {
      setSkipMeal(meal);
      skipSheetRef.current?.present();
    },
    []
  );

  const closeRecipe = useCallback(() => {
    recipeSheetRef.current?.dismiss();
  }, []);

  const closeSkip = useCallback(() => {
    skipSheetRef.current?.dismiss();
  }, []);

  const recipe: Recipe | null = selectedMeal?.recipe ?? null;

  const onCompleteMeal = useCallback(async () => {
    if (!selectedMeal) return;
    updateMealStatus.mutate(
      { mealId: selectedMeal.id, status: "completed" },
      {
        onSuccess: () => {
          closeRecipe();
        },
      }
    );
  }, [selectedMeal, updateMealStatus, closeRecipe]);

  const onSkipMealConfirm = useCallback(async () => {
    if (!skipMeal) return;
    updateMealStatus.mutate(
      { mealId: skipMeal.id, status: "skipped" },
      {
        onSuccess: () => {
          closeSkip();
        },
      }
    );
  }, [skipMeal, updateMealStatus, closeSkip]);

  const isInitialLoading = familyQuery.isLoading || menuQuery.isLoading;
  if (isInitialLoading) {
    return (
      <View style={styles.loadingRoot}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <BudgetCard
          weeklyBudget={family?.weeklyBudget ?? null}
          budgetUsed={family?.budgetUsed ?? 0}
          periodStart={family?.budgetPeriodStart ?? null}
          periodEnd={family?.budgetPeriodEnd ?? null}
          onSetBudget={() => {
            alert("Скоро буде доступно");
          }}
        />

        {noMenu ? (
          <EmptyCard
            title="Поточне меню"
            description="Меню ще не згенеровано."
            actionLabel="Згенерувати меню"
            onPress={() => router.push("/(app)/menu" as any)}
          />
        ) : menuQuery.error ? (
          <EmptyCard
            title="Поточне меню"
            description="Не вдалося завантажити меню. Спробуйте ще раз."
            actionLabel="Оновити"
            onPress={() => menuQuery.refetch()}
          />
        ) : !menuQuery.data ? (
          <EmptyCard
            title="Поточне меню"
            description="Меню ще не згенеровано."
            actionLabel="Згенерувати меню"
            onPress={() => router.push("/(app)/menu" as any)}
          />
        ) : currentMeal ? (
          <CurrentMealCard meal={currentMeal} onCookNow={openRecipe} onSkip={openSkip} />
        ) : (
          <EmptyCard
            title="Поточний прийом їжі"
            description="Всі прийоми їжі виконано сьогодні 🎉"
          />
        )}
      </ScrollView>

      <RecipeSheet
        sheetRef={recipeSheetRef}
        snapPoints={recipeSnapPoints}
        recipe={recipe}
        updateMealStatus={updateMealStatus}
        onComplete={onCompleteMeal}
        onDismiss={() => setSelectedMeal(null)}
      />

      <SkipMealSheet
        sheetRef={skipSheetRef}
        snapPoints={skipSnapPoints}
        updateMealStatus={updateMealStatus}
        onConfirm={onSkipMealConfirm}
        onCancel={closeSkip}
        onDismiss={() => setSkipMeal(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  loadingRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
});
