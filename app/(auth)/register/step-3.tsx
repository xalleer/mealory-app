import { GlobalStyles } from '@/constants/styles';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AuthScreen } from "@/components/layout/AuthScreen";
import { BottomSheetModal } from '@/components/ui/BottomSheetModal';
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { MealCheckbox } from "@/components/ui/MealCheckbox";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ALLERGIES } from "@/constants/allergies";
import { MEALS } from "@/constants/meals";
import { FamilyMember, useRegistrationStore } from "@/stores/registration.store";
import type { Allergy } from "@/types/auth";

function toggleInArray<T extends string>(arr: T[], value: T) {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

type EditTab = 'meals' | 'allergies';

export default function RegisterStep3() {
  const router = useRouter();

  const mealTimes = useRegistrationStore((s) => s.mealTimes);
  const allergies = useRegistrationStore((s) => s.allergies);
  const familyMembers = useRegistrationStore((s) => s.familyMembers);
  const setStep3 = useRegistrationStore((s) => s.setStep3);
  const addFamilyMember = useRegistrationStore((s) => s.addFamilyMember);
  const updateFamilyMember = useRegistrationStore((s) => s.updateFamilyMember);
  const deleteFamilyMember = useRegistrationStore((s) => s.deleteFamilyMember);

  const [modalOpen, setModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editTab, setEditTab] = useState<EditTab>('meals');
  const [draftMeals, setDraftMeals] = useState<typeof MEALS[number]['id'][]>(["breakfast", "lunch", "dinner"]);
  const [draftAllergies, setDraftAllergies] = useState<Allergy[]>([]);

  const canContinue = mealTimes.length > 0;

  const openAddModal = () => {
    setEditingMemberId(null);
    setNewMemberName("");
    setEditTab('meals');
    setDraftMeals(["breakfast", "lunch", "dinner"]);
    setDraftAllergies([]);
    setModalOpen(true);
  };

  const openEditModal = (id: string) => {
    const m = familyMembers.find((x) => x.id === id);
    setEditingMemberId(id);
    setNewMemberName(m?.name ?? "");
    setEditTab('meals');
    setDraftMeals(m?.mealTimes ?? ["breakfast", "lunch", "dinner"]);
    setDraftAllergies(m?.allergies ?? []);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const onSaveMember = () => {
    const trimmed = newMemberName.trim();
    if (!trimmed) return;

    if (editingMemberId) {
      updateFamilyMember(editingMemberId, {
        name: trimmed,
        mealTimes: draftMeals,
        allergies: draftAllergies,
      });
      closeModal();
      return;
    }

    const member: FamilyMember = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      name: trimmed,
      mealTimes: draftMeals,
      allergies: draftAllergies,
    };

    addFamilyMember(member);
    closeModal();
  };

  return (
    <AuthScreen
      title="Налаштування"
      subtitle={"Оберіть прийоми їжі, алергії та додайте членів сім'ї"}
    >
      <ProgressBar step={3} total={4} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ваші прийоми їжі</Text>
        <View style={styles.checkboxList}>
          {MEALS.map((m) => (
            <MealCheckbox
              key={m.id}
              label={m.label}
              checked={mealTimes.includes(m.id)}
              onToggle={() =>
                setStep3({
                  mealTimes: toggleInArray(mealTimes, m.id),
                  allergies,
                  familyMembers,
                })
              }
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Алергії</Text>
        <View style={styles.chipList}>
          {ALLERGIES.map((a) => (
            <Chip
              key={a.id}
              label={a.label}
              selected={allergies.includes(a.id as Allergy)}
              onPress={() =>
                setStep3({
                  mealTimes,
                  allergies: toggleInArray(allergies, a.id as Allergy),
                  familyMembers,
                })
              }
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{"Члени сім'ї"}</Text>
          <Pressable onPress={openAddModal}>
            <Text style={styles.addButton}>Додати</Text>
          </Pressable>
        </View>

        {familyMembers.length === 0 ? (
          <Text style={styles.emptyText}>{"Ще немає доданих членів сім'ї"}</Text>
        ) : (
          <View style={styles.memberList}>
            {familyMembers.map((member) => (
              <View key={member.id} style={styles.memberCompactCard}>
                <View style={styles.memberHeader}>
                  <View style={styles.memberIdentity}>
                    <LinearGradient
                      colors={[Colors.primary, Colors.primaryLight]}
                      style={styles.avatar}
                    >
                      <Text style={styles.avatarText}>
                        {member.name.trim().slice(0, 1).toUpperCase()}
                      </Text>
                    </LinearGradient>
                    <View style={styles.memberTextCol}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberMeta}>
                        {member.mealTimes.length} прийом(и) • {member.allergies.length} алергій
                      </Text>
                    </View>
                  </View>
                  <View style={styles.memberActions}>
                    <Pressable
                      onPress={() => openEditModal(member.id)}
                      style={[styles.iconButton, styles.iconButtonEdit]}
                    >
                      <Ionicons name="pencil" size={16} color={Colors.primary} />
                    </Pressable>
                    <Pressable
                      onPress={() => deleteFamilyMember(member.id)}
                      style={[styles.iconButton, styles.iconButtonDelete]}
                    >
                      <Ionicons name="trash" size={16} color={Colors.error} />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.badgesRow}>
                  <View style={styles.badge}>
                    <Ionicons name="restaurant" size={14} color={Colors.primaryDark} />
                    <Text style={styles.badgeText}>Прийомів: {member.mealTimes.length}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Ionicons name="alert-circle" size={14} color={Colors.primaryDark} />
                    <Text style={styles.badgeText}>Алергій: {member.allergies.length}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.buttons}>
        <Button
          title="Далі"
          onPress={() => router.push("/(auth)/register/step-4")}
          disabled={!canContinue}
        />
        <Button title="Назад" variant="secondary" onPress={() => router.back()} />
      </View>

      <BottomSheetModal
        visible={modalOpen}
        onClose={closeModal}
        title={editingMemberId ? "Редагувати" : "Додати члена сім'ї"}
        size={editingMemberId ? 'lg' : 'md'}
        footer={
          <Button title={editingMemberId ? "Зберегти" : "Додати"} onPress={onSaveMember} />
        }
      >
        <Input
          label={"Ім'я"}
          value={newMemberName}
          onChangeText={setNewMemberName}
          placeholder="Марія"
        />

        <View style={styles.tabsWrap}>
          <View style={styles.tabs}>
            <Pressable
              onPress={() => setEditTab('meals')}
              style={[styles.tab, editTab === 'meals' && styles.tabActive]}
            >
              <Text style={[styles.tabText, editTab === 'meals' && styles.tabTextActive]}>Їжа</Text>
            </Pressable>
            <Pressable
              onPress={() => setEditTab('allergies')}
              style={[styles.tab, editTab === 'allergies' && styles.tabActive]}
            >
              <Text style={[styles.tabText, editTab === 'allergies' && styles.tabTextActive]}>Алергії</Text>
            </Pressable>
          </View>

          {editTab === 'meals' ? (
            <View style={styles.editList}>
              {MEALS.map((m) => (
                <MealCheckbox
                  key={m.id}
                  label={m.label}
                  checked={draftMeals.includes(m.id)}
                  onToggle={() => setDraftMeals((prev) => toggleInArray(prev, m.id))}
                />
              ))}
            </View>
          ) : (
            <View style={styles.editList}>
              <View style={styles.chipList}>
                {ALLERGIES.map((a) => (
                  <Chip
                    key={a.id}
                    label={a.label}
                    selected={draftAllergies.includes(a.id as Allergy)}
                    onPress={() =>
                      setDraftAllergies((prev) => toggleInArray(prev, a.id as Allergy))
                    }
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </BottomSheetModal>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
    ...GlobalStyles.rowBetween,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  addButton: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.primary,
  },
  checkboxList: {
    gap: Spacing.md,
  },
  chipList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  emptyText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
  },
  memberList: {
    gap: Spacing.lg,
  },
  memberCompactCard: {
    ...GlobalStyles.card,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  memberHeader: {
    ...GlobalStyles.rowBetween,
  },
  memberIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    ...Shadows.sm,
  },
  avatarText: {
    ...Typography.h4,
    color: Colors.text.inverse,
  },
  memberTextCol: {
    flex: 1,
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  memberName: {
    ...Typography.h4,
    color: Colors.text.primary,
  },
  memberMeta: {
    marginTop: 2,
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconButtonEdit: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary + '25',
  },
  iconButtonDelete: {
    backgroundColor: Colors.error + '10',
    borderColor: Colors.error + '20',
  },
  badgesRow: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + '12',
    borderWidth: 1,
    borderColor: Colors.primary + '28',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  buttons: {
    marginTop: Spacing.xxxl,
    gap: Spacing.md,
  },

  tabsWrap: {
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: BorderRadius.full,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: Colors.background,
    ...Shadows.sm,
  },
  tabText: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.text.secondary,
  },
  tabTextActive: {
    color: Colors.text.primary,
  },
  editList: {
    gap: Spacing.md,
  },
});
