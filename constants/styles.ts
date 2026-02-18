import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from './theme';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  containerPadded: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  },
  cardBordered: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
    padding: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Typography
  h1: {
    ...Typography.h1,
    color: Colors.text.primary,
  },
  h2: {
    ...Typography.h2,
    color: Colors.text.primary,
  },
  h3: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  h4: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  body: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  bodySecondary: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  caption: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  error: {
    ...Typography.bodySmall,
    color: Colors.error,
  },
});
