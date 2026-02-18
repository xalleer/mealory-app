import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as authApi from '../lib/api/auth.api';
import { useAuthStore } from '../stores/auth.store';
import { useRegistrationStore } from '../stores/registration.store';

// Helper: extract error message from axios error
function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: unknown } } }).response;
    const message = response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(', ');
  }
  return 'Щось пішло не так. Спробуйте ще раз.';
}

export function useLoginMutation() {
  const { setToken, setUser } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      await setToken(data.accessToken);
      setUser(data.user);
      router.replace('/(app)');
    },
  });
}

export function useRegisterMutation() {
  const { setToken, setUser } = useAuthStore();
  const resetRegistration = useRegistrationStore((s) => s.reset);

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      await setToken(data.accessToken);
      setUser(data.user);
      resetRegistration();
      router.replace('/(app)');
    },
  });
}

export function useRequestPasswordResetMutation() {
  return useMutation({
    mutationFn: authApi.requestPasswordReset,
  });
}

export function useConfirmPasswordResetMutation() {
  return useMutation({
    mutationFn: authApi.confirmPasswordReset,
    onSuccess: () => {
      router.replace('/(auth)/login');
    },
  });
}

export function useCompleteProfileMutation() {
  const { setToken, setUser } = useAuthStore();

  return useMutation({
    mutationFn: authApi.completeProfile,
    onSuccess: async (data) => {
      await setToken(data.accessToken);
      setUser(data.user);
      router.replace('/(app)');
    },
  });
}

export function useRegisterViaInviteMutation(inviteToken: string) {
  const { setToken, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (payload: Parameters<typeof authApi.registerViaInvite>[1]) =>
      authApi.registerViaInvite(inviteToken, payload),
    onSuccess: async (data) => {
      await setToken(data.accessToken);
      setUser(data.user);
      router.replace('/(app)');
    },
  });
}

export { getErrorMessage };
