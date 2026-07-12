import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from './ProgressBar';
import { Colors, Radius, Shadow, Spacing, Type } from '@/constants/theme';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  urgencia: 'time-outline',
  urgency: 'time-outline',
  'presión emocional': 'heart-dislike-outline',
  'presión temporal': 'hourglass-outline',
  suplantación: 'person-remove-outline',
  amenaza: 'warning-outline',
  'falsa autoridad': 'shield-half-outline',
  autoridad: 'shield-half-outline',
  aislamiento: 'people-outline',
  culpa: 'sad-outline',
  miedo: 'alert-circle-outline',
};

function iconFor(name: string) {
  return ICONS[name.trim().toLowerCase()] || 'analytics-outline';
}

interface Props {
  name: string;
  confidence: number; // 0..1 or 0..100
}

export default function SocialEngineeringCard({ name, confidence }: Props) {
  const pct = confidence <= 1 ? confidence * 100 : confidence;
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name={iconFor(name)} size={18} color={Colors.signalDeep} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.row}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.pct}>{Math.round(pct)}%</Text>
        </View>
        <ProgressBar progress={pct} color={Colors.signal} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.signalSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: { fontSize: 14, color: Colors.ink, ...Type.bodySemi },
  pct: { fontSize: 13, color: Colors.inkMuted, ...Type.bodyMedium },
});
