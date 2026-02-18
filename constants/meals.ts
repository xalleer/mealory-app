export type MealId = "breakfast" | "lunch" | "snack" | "dinner";

export const MEALS: { id: MealId; label: string }[] = [
  { id: "breakfast", label: "Сніданок" },
  { id: "lunch", label: "Обід" },
  { id: "snack", label: "Перекус" },
  { id: "dinner", label: "Вечеря" },
];
