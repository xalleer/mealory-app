import * as SecureStore from "expo-secure-store";
import { useCallback } from "react";

import { useAuthStore } from "@/stores/auth.store";

const TOKEN_KEY = "auth_token";

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const logoutStore = useAuthStore((s) => s.logout);

  const logout = useCallback(async () => {
    logoutStore();
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }, [logoutStore]);

  return {
    token,
    user,
    setToken,
    setUser,
    logout,
    TOKEN_KEY,
  };
}
