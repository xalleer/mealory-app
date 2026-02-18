import apiClient from "../axios";
import type { User } from "../../types/auth";

export type FamilyMember = {
  id: string;
  name: string;
  isRegistered: boolean;
  userId: string | null;
  mealTimes: string[];
  allergies: string[];
  inviteToken?: string;
};

export type Family = {
  id: string;
  weeklyBudget: number | null;
  budgetUsed: number;
  budgetPeriodStart: string | null;
  budgetPeriodEnd: string | null;
  createdAt: string;
  members: FamilyMember[];
};

export type FamilyInfoResponse = { family: Family | null };

// GET /profile
export async function getProfile(): Promise<User> {
  const { data } = await apiClient.get<User>("/profile");
  return data;
}

// GET /profile/family
export async function getFamilyInfo(): Promise<FamilyInfoResponse> {
  const { data } = await apiClient.get<FamilyInfoResponse>("/profile/family");
  return data;
}
