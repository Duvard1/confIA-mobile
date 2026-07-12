import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// SecureStore no existe en web — usamos localStorage como fallback.
const webCache: Record<string, string> = {};

export const tokenCache = {
  async getToken(key: string) {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch {
        return webCache[key] ?? null;
      }
    }
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch {
        webCache[key] = value;
      }
      return;
    }
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // ignore
    }
  },
};
