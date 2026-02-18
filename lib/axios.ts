import axios from "axios";
import { useAuthStore } from "../stores/auth.store";

const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL;
const baseURL = rawBaseUrl
  ? rawBaseUrl.trim().replace(/^['"]|['"]$/g, "")
  : undefined;

if (!baseURL) {
  console.warn(
    "[api] EXPO_PUBLIC_API_URL is not set. Requests may fail. Check your .env and restart the Expo dev server.",
  );
}

const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
