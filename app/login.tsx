/**
 * login.tsx — Flujo OAuth para iOS / Android.
 * En web, Metro carga login.web.tsx en su lugar.
 */
import Background from '@/components/BackgroundAuth';
import { PrimaryButton, SecondaryButton } from '@/components/Buttons';
import Logo from '@/components/Logo';
import { Colors, Spacing, Type } from '@/constants/theme';
import { useAuth, useOAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const CLERK_ENABLED = !!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function LoginScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  // useOAuth usa deep links nativos; solo funciona en iOS/Android.
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  // Si ya hay sesión activa, ir directo a las tabs.
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/(tabs)');
    }
  }, [isLoaded, isSignedIn]);

  const onGooglePress = useCallback(async () => {
    if (!CLERK_ENABLED) {
      // Modo vista previa sin clave Clerk
      router.replace('/(tabs)');
      return;
    }
    // Si ya está autenticado, simplemente navegar.
    if (isSignedIn) {
      router.replace('/(tabs)');
      return;
    }
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
      router.replace('/(tabs)');
    } catch (err) {
      console.error('[Clerk mobile OAuth]', err);
      Alert.alert('No se pudo iniciar sesión', 'Inténtalo de nuevo en unos segundos.');
    }
  }, [startOAuthFlow, isSignedIn]);

  const onEmailPress = () => {
    if (!CLERK_ENABLED) {
      router.replace('/(tabs)');
      return;
    }
    Alert.alert('Próximamente', 'El acceso por email estará disponible pronto.');
  };

  return (
  <Background>
    <View style={styles.container}>
      <View style={{ flex: 1 }} />

      <View style={styles.header}>
        <Logo size={64} />
        <Text style={styles.title}>Bienvenido a ConfIA</Text>
        <Text style={styles.subtitle}>
          Protege tus llamadas frente a fraudes e inteligencia artificial.
        </Text>
      </View>

      <View style={{ flex: 1 }} />

      <View style={styles.actions}>
        <PrimaryButton
          label="Continuar con Google"
          icon="logo-google"
          onPress={onGooglePress}
        />
        <SecondaryButton
          label="Continuar con Email"
          icon="mail-outline"
          onPress={onEmailPress}
          style={{ marginTop: Spacing.md }}
        />
        <Text style={styles.footer}>
          ¿Ya tienes cuenta?{' '}
          <Text style={styles.link} onPress={onEmailPress}>
            Iniciar sesión
          </Text>
        </Text>
      </View>
    </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'transaparent',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: { alignItems: 'center' },
  title: {
    fontSize: 24,
    color: Colors.navy,
    marginTop: Spacing.lg,
    textAlign: 'center',
    ...Type.display,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.inkMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
    ...Type.body,
  },
  actions: { width: '100%' },
  footer: {
    textAlign: 'center',
    marginTop: Spacing.lg,
    color: Colors.inkMuted,
    fontSize: 13,
    ...Type.body,
  },
  link: { color: Colors.signalDeep, ...Type.bodySemi },
});
