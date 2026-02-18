import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { Link, Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AuthFooterCTAProps = {
  text: string;
  ctaLabel: string;
  href: Href;
};

export function AuthFooterCTA({ text, ctaLabel, href }: AuthFooterCTAProps) {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>{text}</Text>
      <Link href={href} asChild>
        <Pressable style={styles.ctaButton}>
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  text: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  ctaButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  ctaText: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
});
