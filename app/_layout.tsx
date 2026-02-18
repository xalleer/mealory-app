import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/stores/auth.store";

const TOKEN_KEY = "auth_token";

export default function RootLayout() {
  const setToken = useAuthStore((s) => s.setToken);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Clear the token for testing
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        console.log('SecureStore token after clear:', token);
        if (!cancelled) {
          setToken(token ?? null);
          setHydrated(true);
        }
      } catch (error) {
        console.log('SecureStore error:', error);
        if (!cancelled) {
          setToken(null);
          setHydrated(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setToken]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
