import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GaugeRing from './GaugeRing';
import { Colors, Type } from '@/constants/theme';

interface CircleIndicatorProps {
  label: string;
  value: number; // 0..100
  color: string;
}

export default function CircleIndicator({ label, value, color }: CircleIndicatorProps) {
  return (
    <View style={styles.wrap}>
      <GaugeRing size={84} strokeWidth={9} progress={value} color={color}>
        <Text style={[styles.value, { color }]}>{Math.round(value)}%</Text>
      </GaugeRing>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', flex: 1 },
  value: { fontSize: 17, ...Type.displaySemi },
  label: { marginTop: 8, fontSize: 13, color: Colors.inkMuted, ...Type.bodyMedium },
});
