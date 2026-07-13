import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Type } from '@/constants/theme';

interface UploadZoneProps {
  onPress: () => void;
}

export function UploadZone({ onPress }: UploadZoneProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.zone, pressed && styles.pressed]}>
      <View style={styles.iconCircle}>
        <Ionicons name="cloud-upload-outline" size={28} color={Colors.signalDeep} />
      </View>
      <Text style={styles.title}>Subir audio</Text>
      <Text style={styles.subtitle}>Toca para seleccionar una grabación{'\n'}(.mp3, .m4a, .wav, .aac)</Text>
    </Pressable>
  );
}

interface FileCardProps {
  name: string;
  durationLabel?: string;
  sizeLabel?: string;
  onRemove: () => void;
}

export function FileCard({ name, durationLabel, sizeLabel, onRemove }: FileCardProps) {
  return (
    <View style={styles.fileCard}>
      <View style={styles.fileIcon}>
        <Ionicons name="mic-outline" size={20} color={Colors.signalDeep} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.fileName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.fileMeta}>
          {[durationLabel, sizeLabel].filter(Boolean).join(' · ') || 'Archivo listo'}
        </Text>
      </View>
      <Pressable onPress={onRemove} hitSlop={10}>
        <Ionicons name="close-circle" size={22} color={Colors.inkFaint} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  zone: {
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    borderStyle: 'solid',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
    backgroundColor: 'rgba(20,20,20,0.65)'
  },
  pressed: { backgroundColor: Colors.surfaceAlt },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.signalSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: { fontSize: 16, color: Colors.navy, marginBottom: 4, ...Type.bodySemi },
  subtitle: {
    fontSize: 13,
    color: Colors.inkMuted,
    textAlign: 'center',
    lineHeight: 18,
    ...Type.body,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: Spacing.md,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.signalSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: { fontSize: 14, color: Colors.ink, ...Type.bodySemi },
  fileMeta: { fontSize: 12, color: Colors.inkMuted, marginTop: 2, ...Type.body },
});
