import { create } from "zustand";
import type { Allergy, Goal, MealTime } from "../types/auth";

export type FamilyMember = {
  id: string;
  name: string;
  mealTimes: MealTime[];
  allergies: Allergy[];
};

type RegistrationState = {
  // Step 1
  name: string;
  email: string;
  password: string;

  // Step 2
  height: number | null;
  weight: number | null;
  goal: Goal | null;

  // Step 3 — current user
  mealTimes: MealTime[];
  allergies: Allergy[];
  familyMembers: FamilyMember[];

  // Step 4
  weeklyBudget: number | null;

  // Actions
  setStep1: (data: { name: string; email: string; password: string }) => void;
  setStep2: (data: { height: number; weight: number; goal: Goal }) => void;
  setStep3: (data: {
    mealTimes: MealTime[];
    allergies: Allergy[];
    familyMembers: FamilyMember[];
  }) => void;

  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (id: string, data: Omit<FamilyMember, "id">) => void;
  deleteFamilyMember: (id: string) => void;
  setStep4: (data: { weeklyBudget: number | null }) => void;
  reset: () => void;
};

const initialState = {
  name: "",
  email: "",
  password: "",
  height: null,
  weight: null,
  goal: null,
  mealTimes: ["breakfast", "lunch", "dinner"] as MealTime[],
  allergies: [] as Allergy[],
  familyMembers: [] as FamilyMember[],
  weeklyBudget: null,
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  ...initialState,
  setStep1: (data) => set(data),
  setStep2: (data) => set(data),
  setStep3: (data) => set(data),
  addFamilyMember: (member) =>
    set((state) => ({
      familyMembers: [...state.familyMembers, member],
    })),
  updateFamilyMember: (id, data) =>
    set((state) => ({
      familyMembers: state.familyMembers.map((m) => (m.id === id ? { ...m, ...data } : m)),
    })),
  deleteFamilyMember: (id) =>
    set((state) => ({
      familyMembers: state.familyMembers.filter((m) => m.id !== id),
    })),
  setStep4: (data) => set(data),
  reset: () => set(initialState),
}));
