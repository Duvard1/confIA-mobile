/**
 * login.tsx — Flujo OAuth para iOS / Android.
 * En web, Metro carga login.web.tsx en su lugar.
 */
import { Image } from 'react-native';
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
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/(tabs)');
    }
  }, [isLoaded, isSignedIn]);

  const onGooglePress = useCallback(async () => {
    if (!CLERK_ENABLED) {
      router.replace('/(tabs)');
      return;
    }
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
        <Image
  source={require('@/assets/images/logo.png')}
  style={{
    width: 210,
    height: 210,
    resizeMode: 'contain',
  }}
/>
        <Text style={styles.title}>
  Bienvenido a{"\n"}
  Guard<Text style={styles.ia}>IA</Text>n
</Text>
        <Text style={styles.subtitle}>
          Protege tus llamadas de fraudes y voces generadas por inteligencia artificial.
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
  ia: {
  color: '#FF4040',
  textShadowColor: '#FF1744',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 16,
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
