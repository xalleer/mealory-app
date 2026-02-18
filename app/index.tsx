import { Redirect } from "expo-router";

import { useAuthStore } from "@/stores/auth.store";

export default function Index() {
  const token = useAuthStore((s) => s.token);

  console.log('Index - token:', token);

  if (token) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
