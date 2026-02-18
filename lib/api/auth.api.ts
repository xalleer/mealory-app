import apiClient from '../axios';
import type {
  AuthResponse,
  SuccessResponse,
  LoginPayload,
  RegisterPayload,
  RequestPasswordResetPayload,
  ConfirmPasswordResetPayload,
  CompleteProfilePayload,
  RegisterViaInvitePayload,
} from '../../types/auth';

// POST /auth/register
// Creates user + family + family members in one request
// Returns needsOnboarding: false (all data provided at once)
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
}

// POST /auth/login
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
  return data;
}

// POST /auth/logout  (requires Bearer token)
export async function logout(): Promise<SuccessResponse> {
  const { data } = await apiClient.post<SuccessResponse>('/auth/logout');
  return data;
}

// POST /auth/password-reset/request
// Sends OTP to email. Always returns { ok: true } even if email not found (security)
export async function requestPasswordReset(
  payload: RequestPasswordResetPayload,
): Promise<SuccessResponse> {
  const { data } = await apiClient.post<SuccessResponse>(
    '/auth/password-reset/request',
    payload,
  );
  return data;
}

// POST /auth/password-reset/confirm
// otpCode must be exactly 6 digits as string
// On success returns { ok: true }, then user must login again
export async function confirmPasswordReset(
  payload: ConfirmPasswordResetPayload,
): Promise<SuccessResponse> {
  const { data } = await apiClient.post<SuccessResponse>(
    '/auth/password-reset/confirm',
    payload,
  );
  return data;
}

// POST /auth/complete-profile  (requires Bearer token)
// Used after Google/Apple OAuth when needsOnboarding === true
// Returns updated AuthResponse with needsOnboarding: false
export async function completeProfile(
  payload: CompleteProfilePayload,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/complete-profile', payload);
  return data;
}

// POST /auth/register-via-invite/:inviteToken
// Used when family member clicks invite link
// inviteToken is UUID from the invite URL
export async function registerViaInvite(
  inviteToken: string,
  payload: RegisterViaInvitePayload,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    `/auth/register-via-invite/${inviteToken}`,
    payload,
  );
  return data;
}
