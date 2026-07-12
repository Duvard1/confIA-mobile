import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import Logo from '@/components/Logo';
import { Colors, Type } from '@/constants/theme';

export default function SplashScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(12)).current;
  const ringPulse = useRef(new Animated.Value(1)).current;

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

    Animated.loop(
      Animated.sequence([
        Animated.timing(ringPulse, {
          toValue: 1.06,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(ringPulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    const t = setTimeout(() => {
      router.replace('/login');
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }} />
      <Animated.View
        style={{
          opacity: fade,
          transform: [{ translateY: rise }, { scale: ringPulse }],
          alignItems: 'center',
        }}
      >
        <Logo size={92} />
        <Text style={styles.title}>ConfIA</Text>
        <Text style={styles.subtitle}>
          Analiza llamadas. Detecta riesgos.{'\n'}Decide con confianza.
        </Text>
      </Animated.View>
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 40 }}>
        <Animated.Text style={[styles.powered, { opacity: fade }]}>
          Powered by AI
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: Colors.navy,
    marginTop: 18,
    ...Type.display,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.inkMuted,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    ...Type.body,
  },
  powered: {
    fontSize: 12,
    color: Colors.inkFaint,
    textAlign: 'center',
    letterSpacing: 0.6,
    ...Type.bodyMedium,
  },
});
