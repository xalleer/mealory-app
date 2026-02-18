import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as menuApi from "../lib/api/menu.api";
import * as profileApi from "../lib/api/profile.api";

export const QUERY_KEYS = {
  profile: ["profile"] as const,
  family: ["family"] as const,
  currentMenu: ["menu", "current"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: profileApi.getProfile,
  });
}

export function useFamilyInfo() {
  return useQuery({
    queryKey: QUERY_KEYS.family,
    queryFn: profileApi.getFamilyInfo,
  });
}

export function useCurrentMenu() {
  return useQuery({
    queryKey: QUERY_KEYS.currentMenu,
    queryFn: menuApi.getCurrentMenu,
    // 404 means no menu yet — treat as null, not error
    retry: (failureCount, error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 404) return false;
      return failureCount < 2;
    },
  });
}

export function useUpdateMealStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ mealId, status }: { mealId: string; status: menuApi.MealStatus }) =>
      menuApi.updateMealStatus(mealId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.currentMenu });
    },
  });
}
