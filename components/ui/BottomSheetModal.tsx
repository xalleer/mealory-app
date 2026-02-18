import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { ReactNode } from 'react';
import {
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomSheetSize = 'sm' | 'md' | 'lg';

type BottomSheetModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: BottomSheetSize;
};

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

const SIZE_TO_MAX_HEIGHT: Record<BottomSheetSize, number> = {
  sm: Math.round(WINDOW_HEIGHT * 0.45),
  md: Math.round(WINDOW_HEIGHT * 0.7),
  lg: Math.round(WINDOW_HEIGHT * 0.92),
};

export function BottomSheetModal({
  visible,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: BottomSheetModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={[
                styles.content,
                { paddingBottom: insets.bottom + Spacing.lg, maxHeight: SIZE_TO_MAX_HEIGHT[size] },
              ]}
            >
              {title ? (
                <View style={styles.header}>
                  <Text style={styles.title}>{title}</Text>
                  <Pressable onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </Pressable>
                </View>
              ) : null}

              <View style={styles.body}>{children}</View>

              {footer ? <View style={styles.footer}>{footer}</View> : null}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
  },
  container: {
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    ...Shadows.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  title: {
    ...Typography.h3,
    color: Colors.text.primary,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: Colors.text.secondary,
  },
  body: {
    gap: Spacing.lg,
  },
  footer: {
    marginTop: Spacing.lg,
  },
});
