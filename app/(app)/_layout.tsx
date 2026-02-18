import { Colors, Spacing, Typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuthStore } from "@/stores/auth.store";

function AppHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const avatarLetter = useMemo(() => {
    const name = user?.name?.trim();
    if (!name) return "U";
    return name[0]?.toUpperCase() ?? "U";
  }, [user?.name]);

  return (
    <View style={[styles.headerRoot, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Kitchen OS</Text>

        <View style={styles.headerRight}>
          <Pressable
            onPress={() => router.push("/(app)/notifications" as any)}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
            hitSlop={12}
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.text.primary} />
          </Pressable>

          <Pressable
            onPress={() => router.push("/(app)/profile" as any)}
            style={({ pressed }) => [styles.avatarButton, pressed && styles.iconButtonPressed]}
            hitSlop={12}
          >
            <Text style={styles.avatarLetter}>{avatarLetter}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

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

  if (!isHydrated) return null;
  if (!token) return null;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        header: () => <AppHeader />,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.tertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ color, size }) => {
          const name = (() => {
            switch (route.name) {
              case "index":
                return "home";
              case "menu":
                return "calendar";
              case "shopping":
                return "cart";
              case "inventory":
                return "cube";
              default:
                return "home";
            }
          })();
          return <Ionicons name={name as any} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Головна" }} />
      <Tabs.Screen name="menu" options={{ title: "Меню" }} />
      <Tabs.Screen name="shopping" options={{ title: "Покупки" }} />
      <Tabs.Screen name="inventory" options={{ title: "Продукти" }} />

      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerRoot: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  headerContent: {
    height: 56,
    paddingHorizontal: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.backgroundTertiary,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary + "14",
    borderWidth: 1,
    borderColor: Colors.primary + "26",
  },
  iconButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  avatarLetter: {
    ...Typography.button,
    color: Colors.primaryDark,
  },
  tabBar: {
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    height: 80,
    paddingTop: 8,
    paddingBottom: 12,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
});
