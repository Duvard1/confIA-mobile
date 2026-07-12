/**
 * sso-callback.tsx
 * Ruta de callback SSO para web. Clerk redirige aquí tras completar el OAuth.
 * Clerk completa la sesión automáticamente al cargar esta página.
 */
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Colors } from '@/constants/theme';

export default function SSOCallback() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    // Una vez que Clerk procesó el callback y actualizó el estado, navegamos.
    if (isSignedIn) {
      router.replace('/(tabs)');
    } else {
      // Si algo salió mal, volvemos al login.
      router.replace('/login');
    }
  }, [isLoaded, isSignedIn]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.signalDeep} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
