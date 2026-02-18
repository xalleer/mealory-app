import type { Day, Meal, MealType } from "../types/menu";

// Returns which meal type should be shown right now
export function getCurrentMealType(): MealType {
  const hour = new Date().getHours();
  if (hour < 12) return "breakfast";
  if (hour < 16) return "lunch";
  if (hour < 18) return "snack";
  return "dinner";
}

// Finds today's current pending meal from menu days
export function getTodayCurrentMeal(days: Day[]): Meal | null {
  const today = new Date().toISOString().slice(0, 10);
  const todayDay = days.find((d) => d.date.slice(0, 10) === today);
  if (!todayDay) return null;

  const currentType = getCurrentMealType();
  const mealOrder: MealType[] = ["breakfast", "lunch", "snack", "dinner"];
  const currentIndex = mealOrder.indexOf(currentType);

  // Try current slot first, then next pending
  for (let i = currentIndex; i < mealOrder.length; i++) {
    const meal = todayDay.meals.find((m) => m.mealType === mealOrder[i] && m.status === "pending");
    if (meal) return meal;
  }

  return null;
}

// Format date range for budget card
export function formatDateRange(start: string | null, end: string | null): string {
  if (!start || !end) return "";
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`;
  return `${fmt(s)} — ${fmt(e)}.${e.getFullYear()}`;
}

// Meal type label in Ukrainian
export function getMealTypeLabel(type: MealType): string {
  const labels: Record<MealType, string> = {
    breakfast: "Сніданок",
    lunch: "Обід",
    snack: "Перекус",
    dinner: "Вечеря",
  };
  return labels[type];
}
