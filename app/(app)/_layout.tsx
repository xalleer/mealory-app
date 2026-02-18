import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";

import { useAuthStore } from "@/stores/auth.store";

export default function AppLayout() {
  const { token, isHydrated, hydrate } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!token) {
      router.replace("/(auth)/welcome");
    }
  }, [isHydrated, token, router]);

  if (!isHydrated) {
    return null;
  }

  if (!token) {
    return null;
  }

  return <Slot />;
}
