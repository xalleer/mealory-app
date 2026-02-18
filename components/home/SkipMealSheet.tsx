import { Colors, Spacing, Typography } from "@/constants/theme";
import type { UseMutationResult } from "@tanstack/react-query";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import type { RefObject } from "react";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function SkipMealSheet({
  sheetRef,
  snapPoints,
  onConfirm,
  onCancel,
  updateMealStatus,
  onDismiss,
}: {
  sheetRef: RefObject<BottomSheetModal>;
  snapPoints: (string | number)[];
  onConfirm: () => void;
  onCancel: () => void;
  updateMealStatus: Pick<UseMutationResult<any, any, any, any>, "isPending">;
  onDismiss: () => void;
}) {
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      onDismiss={onDismiss}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.sheetHandle}
    >
      <View style={styles.sheetContent}>
        <Text style={styles.sheetTitle}>Пропустити прийом їжі</Text>
        <Text style={styles.sheetDescription}>Ви впевнені що хочете пропустити цей прийом їжі?</Text>

        <Pressable
          onPress={onConfirm}
          disabled={updateMealStatus.isPending}
          style={({ pressed }) => [
            styles.dangerButton,
            pressed && styles.iconButtonPressed,
            updateMealStatus.isPending && { opacity: 0.6 },
          ]}
        >
          <Text style={styles.dangerButtonText}>
            {updateMealStatus.isPending ? "Завантаження..." : "Пропустити"}
          </Text>
        </Pressable>

        <Pressable onPress={onCancel} style={({ pressed }) => [styles.cancelButton, pressed && styles.outlinePressed]}>
          <Text style={styles.cancelButtonText}>Скасувати</Text>
        </Pressable>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: Colors.background,
  },
  sheetHandle: {
    backgroundColor: Colors.border.medium,
    width: 44,
  },
  sheetContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  sheetTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  sheetDescription: {
    marginTop: Spacing.sm,
    ...Typography.body,
    color: Colors.text.secondary,
  },
  dangerButton: {
    width: "100%",
    height: 52,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.error,
    marginTop: Spacing.lg,
  },
  dangerButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
  },
  cancelButton: {
    width: "100%",
    height: 52,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border.light,
    marginTop: Spacing.md,
  },
  cancelButtonText: {
    ...Typography.button,
    color: Colors.text.primary,
  },
  iconButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  outlinePressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});
