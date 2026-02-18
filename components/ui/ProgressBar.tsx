import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from "react-native";

type ProgressBarProps = {
  step: number;
  total: number;
};

export function ProgressBar({ step, total }: ProgressBarProps) {
  const progress = total > 0 ? Math.min(1, Math.max(0, step / total)) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepText}>
          Step {step} of {total}
        </Text>
        <Text style={styles.percentText}>{Math.round(progress * 100)}%</Text>
      </View>
      <View style={styles.track}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${progress * 100}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  percentText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.primary,
  },
  track: {
    height: 6,
    width: '100%',
    overflow: 'hidden',
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundTertiary,
  },
  fill: {
    height: 6,
    borderRadius: BorderRadius.full,
  },
});
