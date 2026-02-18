import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Provider = 'google' | 'apple';

type SocialAuthButtonProps = {
  provider: Provider;
  title?: string;
  onPress: () => void;
};

export function SocialAuthButton({ provider, title, onPress }: SocialAuthButtonProps) {
  const isApple = provider === 'apple';

  const label =
    title ?? (isApple ? 'Продовжити з Apple' : 'Продовжити з Google');

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isApple ? styles.apple : styles.google,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.left}>
        <Ionicons
          name={isApple ? 'logo-apple' : 'logo-google'}
          size={18}
          color={isApple ? '#FFFFFF' : '#111827'}
        />
      </View>
      <Text style={[styles.text, isApple ? styles.appleText : styles.googleText]} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.right} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.sm,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },
  apple: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  google: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  text: {
    ...Typography.button,
    flex: 1,
    textAlign: 'center',
  },
  appleText: {
    color: '#FFFFFF',
  },
  googleText: {
    color: '#111827',
  },
  left: {
    width: 24,
    alignItems: 'flex-start',
  },
  right: {
    width: 24,
  },
});
