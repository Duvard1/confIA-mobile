import { Colors, Radius, Spacing, Type } from '@/constants/theme';
import { FeatureScore } from '@/types/analysis';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function SectionHeader({
  title,
  icon,
}: {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.sectionHeader}>
      {icon ? <Ionicons name={icon} size={16} color={Colors.navy} /> : null}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export function StatCard({
  label,
  value,
  color = Colors.navy,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function fmt(n: number | null | undefined) {
  if (n === null || n === undefined) return '-';
  if (n === 0) return '0';
  if (Math.abs(n) < 0.001) return n.toExponential(1);
  return n.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
}

export function BenfordTable({ rows = [] }: { rows?: FeatureScore[] }) {
  console.log('[BenfordTable] received rows:', JSON.stringify(rows, null, 2));
  return (
    <View style={styles.table}>
      <View style={[styles.tRow, styles.tHead]}>
        <Text style={[styles.tCell, styles.tHeadText, { flex: 1.3 }]}>Feature</Text>
        <Text style={[styles.tCell, styles.tHeadText]}>MAD</Text>
        <Text style={[styles.tCell, styles.tHeadText]}>KL</Text>
        <Text style={[styles.tCell, styles.tHeadText]}>JS</Text>
        <Text style={[styles.tCell, styles.tHeadText]}>Chi²</Text>
      </View>
      {rows.map((r, i) => (
        <View key={r.feature} style={[styles.tRow, i % 2 === 1 && styles.tRowAlt]}>
          <Text style={[styles.tCell, styles.tFeature, { flex: 1.3 }]}>
            {r.feature.toUpperCase()}
          </Text>
          <Text style={styles.tCell}>{fmt(r.mad)}</Text>
          <Text style={styles.tCell}>{fmt(r.kl)}</Text>
          <Text style={styles.tCell}>{fmt(r.js)}</Text>
          <Text style={styles.tCell}>
            {r.chi2 !== undefined && r.chi2 !== null ? Math.round(r.chi2) : '-'}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: 16, color: Colors.navy, ...Type.displaySemi },

  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: { fontSize: 21, ...Type.displaySemi },
  statLabel: { fontSize: 11.5, color: Colors.inkMuted, marginTop: 4, ...Type.bodyMedium },

  table: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    width: '100%',
  },
  tRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: Spacing.md },
  tRowAlt: { backgroundColor: Colors.surfaceAlt },
  tHead: { backgroundColor: Colors.navy },
  tHeadText: { color: Colors.white, ...Type.bodySemi, fontSize: 12 },
  tCell: { flex: 1, fontSize: 12, color: Colors.ink, ...Type.body },
  tFeature: { ...Type.bodySemi },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: { fontSize: 13, color: Colors.inkMuted, ...Type.body },
  infoValue: { fontSize: 13, color: Colors.ink, ...Type.bodySemi },
});
