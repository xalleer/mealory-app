import apiClient from "../axios";

export type MealStatus = "pending" | "cooking" | "completed" | "skipped" | "auto_skipped";
export type MealType = "breakfast" | "lunch" | "snack" | "dinner";
export type MeasurementUnit = "kg" | "g" | "l" | "ml" | "piece";

export type RecipeIngredient = {
  id: string;
  productId: string;
  quantity: number;
  unit: MeasurementUnit;
  product?: { id: string; name: string; imageUrl: string | null } | null;
};

export type Recipe = {
  id: string;
  name: string;
  description: string | null;
  cookingTime: number | null;
  servings: number;
  calories: number | null;
  protein: number | null;
  fats: number | null;
  carbs: number | null;
  instructions: unknown;
  imageUrl: string | null;
  ingredients: RecipeIngredient[];
};

export type Meal = {
  id: string;
  dayId: string;
  familyMemberId: string | null;
  mealType: MealType;
  status: MealStatus;
  scheduledTime: string | null;
  completedAt: string | null;
  recipe?: Recipe | null;
};

export type Day = {
  id: string;
  menuId: string;
  date: string;
  dayNumber: number;
  meals: Meal[];
};

export type Menu = {
  id: string;
  familyId: string;
  weekStart: string;
  weekEnd: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  days: Day[];
};

// GET /menu/current
export async function getCurrentMenu(): Promise<Menu> {
  const { data } = await apiClient.get<Menu>("/menu/current");
  return data;
}

// POST /menu/generate
export async function generateMenu(familyId: string): Promise<Menu> {
  const { data } = await apiClient.post<Menu>("/menu/generate", { familyId });
  return data;
}

// PATCH /menu/meals/:mealId/status
export async function updateMealStatus(mealId: string, status: MealStatus): Promise<Meal> {
  const { data } = await apiClient.patch<Meal>(`/menu/meals/${mealId}/status`, { status });
  return data;
}
