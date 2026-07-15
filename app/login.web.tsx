/**
 * login.web.tsx — Flujo OAuth para web.
 * Clerk en web usa `useSignIn` / `useSignUp` con `authenticateWithRedirect`.
 * Metro carga este archivo en lugar de login.tsx cuando la plataforma es web.
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';
import Logo from '@/components/Logo';
import { PrimaryButton, SecondaryButton } from '@/components/Buttons';
import { Colors, Spacing, Type } from '@/constants/theme';
import { getClerkRedirectUrls } from '@/utils/clerk-auth';

WebBrowser.maybeCompleteAuthSession();

const CLERK_ENABLED = !!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function LoginScreen() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { redirectUrl, redirectUrlComplete } = getClerkRedirectUrls();

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      router.replace('/(tabs)');
    }
  }, [authLoaded, isSignedIn]);

  const onGooglePress = async () => {
    if (!CLERK_ENABLED) return;

    if (isSignedIn) {
      router.replace('/(tabs)');
      return;
    }

    if (!signInLoaded || !signIn || !signUpLoaded || !signUp) {
      Alert.alert('Cargando', 'Espera un momento e intenta de nuevo.');
      return;
    }

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl,
        redirectUrlComplete,
      });
    } catch (err: any) {
      const isNotFound = err?.errors?.some(
        (e: any) => e.code === 'form_identifier_not_found'
      );
      if (isNotFound) {
        try {
          await signUp.authenticateWithRedirect({
            strategy: 'oauth_google',
            redirectUrl,
            redirectUrlComplete,
          });
          return;
        } catch (signUpErr: any) {
          console.error('[Clerk web OAuth signUp]', signUpErr);
        }
      }
      console.error('[Clerk web OAuth]', err);
      Alert.alert(
        'No se pudo iniciar sesión',
        err?.errors?.[0]?.longMessage ?? err?.message ?? 'Inténtalo de nuevo.'
      );
    }
  };

  const onEmailPress = () => {
    Alert.alert('Próximamente', 'El acceso por email estará disponible pronto.');
  };

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
