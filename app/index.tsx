import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Type } from '@/constants/theme';
import BackgroundAuth from '@/components/BackgroundAuth';

export default function SplashScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(12)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(rise, {
        toValue: 0,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, {
          toValue: 1.05,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(logoPulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();

    const timer = setTimeout(() => {
      router.replace('/login');
    }, 1800);

    return () => {
      clearTimeout(timer);
      pulseAnimation.stop();
    };
  }, [fade, rise, logoPulse]);

  return (
    <BackgroundAuth>
      <View style={styles.container}>
        <View style={styles.spacer} />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fade,
              transform: [
                { translateY: rise },
                { scale: logoPulse },
              ],
            },
          ]}
        >
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
          />

          <Text style={styles.title}>
            Guard<Text style={styles.titleIA}>IA</Text>n
          </Text>

          <Text style={styles.subtitle}>
            Analiza llamadas. Detecta riesgos.{'\n'}
            Decide con confianza.
          </Text>
        </Animated.View>

        <View style={styles.footer}>
          <Animated.Text
            style={[
              styles.powered,
              {
                opacity: fade,
              },
            ]}
          >
            Powered by AI
          </Animated.Text>
        </View>
      </View>
    </BackgroundAuth>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  spacer: {
    flex: 1,
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  logo: {
    width: 210,
    height: 210,
    resizeMode: 'contain',
  },

  title: {
    marginTop: 18,
    fontSize: 40,
    color: Colors.white,
    ...Type.display,
  },

  titleIA: {
    color: '#FF1744',
    textShadowColor: '#FF1744',
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 16,
  },

  subtitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 23,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    ...Type.body,
  },

  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },

  powered: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    letterSpacing: 0.6,
    ...Type.bodyMedium,
  },
});