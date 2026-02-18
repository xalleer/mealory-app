import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  left?: React.ReactNode;
};

export function Button({
  title,
  onPress,
  disabled = false,
  variant = "primary",
  left,
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          disabled && styles.disabled,
          isPrimary ? styles.primary : styles.secondary,
          !isPrimary && pressed && styles.secondaryPressed,
          isPrimary && pressed && styles.primaryPressed,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <View style={styles.buttonContent}>
          {left ? <View style={styles.left}>{left}</View> : null}
          <Text
            style={[
              styles.text,
              disabled && styles.disabledText,
              isPrimary ? styles.primaryText : styles.secondaryText,
            ]}
          >
            {title}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 52,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Colors.primary,
    ...Shadows.md,
  },
  primaryPressed: {
    opacity: 0.9,
  },
  secondary: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  secondaryPressed: {
    backgroundColor: Colors.primary + '10',
  },
  disabled: {
    backgroundColor: Colors.border.medium,
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  left: {
    marginRight: Spacing.sm,
  },
  text: {
    ...Typography.button,
  },
  primaryText: {
    color: Colors.text.inverse,
  },
  secondaryText: {
    color: Colors.primary,
  },
  disabledText: {
    color: Colors.text.tertiary,
  },
});
