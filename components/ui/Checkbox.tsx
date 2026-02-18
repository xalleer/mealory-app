import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type CheckboxProps = {
  checked: boolean;
  label: ReactNode;
  onPress: () => void;
};

export function Checkbox({ checked, label, onPress }: CheckboxProps) {
  return (
    <View style={styles.root}>
      <Pressable onPress={onPress} style={styles.boxPressable}>
        <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Ionicons name="checkmark" size={14} color={Colors.text.inverse} /> : null}
        </View>
      </Pressable>
      <View style={styles.labelWrap}>{label}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  boxPressable: {
    padding: 2,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  labelWrap: {
    flex: 1,
  },
});
