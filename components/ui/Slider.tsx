import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import RNSlider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SliderProps = {
  label: string;
  value: number | null;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  unit?: string;
};

export function Slider({
  label,
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step = 1,
  unit = '',
}: SliderProps) {
  const [localValue, setLocalValue] = useState(value ?? minimumValue);

  useEffect(() => {
    if (value == null) return;
    setLocalValue(value);
  }, [value]);

  const handleValueChange = (newValue: number) => {
    setLocalValue(newValue);
    onValueChange(newValue);
  };

  const handleSlidingComplete = (newValue: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const displayValue = localValue;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{displayValue}</Text>
          {unit ? <Text style={styles.unit}>{unit}</Text> : null}
        </View>
      </View>
      
      <View style={styles.sliderContainer}>
        <Text style={styles.minMax}>{minimumValue}</Text>
        <RNSlider
          style={styles.slider}
          value={displayValue}
          onValueChange={handleValueChange}
          onSlidingComplete={handleSlidingComplete}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={step}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.backgroundTertiary}
          thumbTintColor={Colors.primary}
        />
        <Text style={styles.minMax}>{maximumValue}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  value: {
    ...Typography.h4,
    color: Colors.primary,
    fontWeight: '700',
  },
  unit: {
    ...Typography.bodySmall,
    color: Colors.primary,
    marginLeft: Spacing.xs,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  minMax: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    width: 32,
    textAlign: 'center',
  },
});
