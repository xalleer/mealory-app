import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

type MealCheckboxProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
};

export function MealCheckbox({ label, checked, onToggle }: MealCheckboxProps) {
  const scaleAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: checked ? 0 : 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
    onToggle();
  };

  return (
    <Pressable style={styles.container} onPress={handleToggle}>
      <View style={[styles.checkbox, checked ? styles.checkboxChecked : styles.checkboxUnchecked]}>
        {checked ? (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Ionicons name="checkmark" size={16} color={Colors.text.inverse} />
          </Animated.View>
        ) : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  checkbox: {
    marginRight: Spacing.md,
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
  },
  checkboxUnchecked: {
    borderColor: Colors.border.medium,
    backgroundColor: Colors.background,
  },
  checkboxChecked: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  label: {
    ...Typography.body,
    color: Colors.text.primary,
  },
});
