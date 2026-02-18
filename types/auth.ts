// Auth domain types

// Enums
export type Goal = 'weight_loss' | 'weight_gain' | 'healthy_eating' | 'maintain_weight';
export type AuthProvider = 'local' | 'google' | 'apple';
export type MealTime = 'breakfast' | 'lunch' | 'snack' | 'dinner';
export type Allergy =
  | 'dairy' | 'eggs' | 'fish' | 'shellfish' | 'tree_nuts'
  | 'peanuts' | 'wheat' | 'soy' | 'sesame' | 'mustard'
  | 'celery' | 'lupin' | 'sulfites' | 'meat' | 'poultry' | 'honey';
export type SubscriptionTier = 'free' | 'pro' | 'family_pro';

// User entity (exact backend shape)
export type User = {
  id: string;
  email: string;
  name: string;
  height: number | null;
  weight: number | null;
  goal: Goal | null;
  isFamilyHead: boolean;
  familyId: string | null;
  familyMemberId: string | null;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt: string | null;
  trialEndsAt: string | null;
  authProvider: AuthProvider;
  createdAt: string;
  updatedAt: string;
};

// Auth responses
export type AuthResponse = {
  user: User;
  accessToken: string;
  expiresIn: number;
  needsOnboarding?: boolean;
};

export type SuccessResponse = { ok: boolean };

// Registration — POST /auth/register
export type FamilyMemberInput = {
  name: string;
  mealTimes?: MealTime[];
  allergies?: Allergy[];
};

export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
  height?: number;
  weight?: number;
  goal?: Goal;
  mealTimes: MealTime[];
  allergies: Allergy[];
  weeklyBudget?: number;
  familyMembers?: FamilyMemberInput[];
};

// Login — POST /auth/login
export type LoginPayload = {
  email: string;
  password: string;
};

// Password reset — POST /auth/password-reset/request
export type RequestPasswordResetPayload = {
  email: string;
};

// OTP confirm + new password — POST /auth/password-reset/confirm
export type ConfirmPasswordResetPayload = {
  email: string;
  otpCode: string;
  newPassword: string;
};

// Complete profile after OAuth — POST /auth/complete-profile (requires Bearer token)
export type CompleteProfilePayload = {
  height: number;
  weight: number;
  goal: Goal;
  mealTimes: MealTime[];
  allergies: Allergy[];
  weeklyBudget?: number;
  familyMembers?: FamilyMemberInput[];
};

// Register via family invite — POST /auth/register-via-invite/:inviteToken
export type RegisterViaInvitePayload = {
  email: string;
  password: string;
  height: number;
  weight: number;
  goal: Goal;
  mealTimes?: MealTime[];
  allergies?: Allergy[];
};
