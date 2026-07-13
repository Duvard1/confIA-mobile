import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Type } from '@/constants/theme';
import { FeatureScore } from '@/types/analysis';

export function SectionHeader({
  title,
  icon,
}: {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.sectionHeader}>
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={Colors.white}
        />
      ) : null}

      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export function StatCard({
  label,
  value,
  color = Colors.white,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>
        {value}
      </Text>

      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function fmt(value: number) {
  if (value === 0) return '0';

  if (Math.abs(value) < 0.001) {
    return value.toExponential(1);
  }

  return value
    .toFixed(3)
    .replace(/0+$/, '')
    .replace(/\.$/, '');
}

export function BenfordTable({
  rows,
}: {
  rows: FeatureScore[];
}) {
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text
          style={[
            styles.tableCell,
            styles.tableHeaderText,
            styles.featureColumn,
          ]}
        >
          Feature
        </Text>

        <Text style={[styles.tableCell, styles.tableHeaderText]}>
          MAD
        </Text>

        <Text style={[styles.tableCell, styles.tableHeaderText]}>
          KL
        </Text>

        <Text style={[styles.tableCell, styles.tableHeaderText]}>
          JS
        </Text>

        <Text style={[styles.tableCell, styles.tableHeaderText]}>
          Chi²
        </Text>
      </View>

      {rows.map((row, index) => (
        <View
          key={row.feature}
          style={[
            styles.tableRow,
            index % 2 === 1 && styles.tableRowAlternative,
          ]}
        >
          <Text
            style={[
              styles.tableCell,
              styles.tableFeature,
              styles.featureColumn,
            ]}
            numberOfLines={1}
          >
            {row.feature.toUpperCase()}
          </Text>

          <Text style={styles.tableCell}>
            {fmt(row.mad)}
          </Text>

          <Text style={styles.tableCell}>
            {fmt(row.kl)}
          </Text>

          <Text style={styles.tableCell}>
            {fmt(row.js)}
          </Text>

          <Text style={styles.tableCell}>
            {Math.round(row.chi2)}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text
        style={styles.infoValue}
        numberOfLines={3}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },

  sectionTitle: {
    flex: 1,
    fontSize: 17,
    color: Colors.white,
    ...Type.displaySemi,
  },

  statCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
  },

  statValue: {
    fontSize: 18,
    textAlign: 'center',
    ...Type.displaySemi,
  },

  statLabel: {
    fontSize: 11,
    color: Colors.inkMuted,
    marginTop: 4,
    textAlign: 'center',
    ...Type.bodyMedium,
  },

  table: {
    width: '100%',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },

  tableRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
  },

  tableRowAlternative: {
    backgroundColor: Colors.surfaceAlt,
  },

  tableHeader: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  tableHeaderText: {
    color: Colors.white,
    fontSize: 11,
    ...Type.bodySemi,
  },

  tableCell: {
    flex: 1,
    minWidth: 0,
    fontSize: 11,
    color: Colors.white,
    textAlign: 'center',
    ...Type.body,
  },

  featureColumn: {
    flex: 1.45,
    textAlign: 'left',
  },

  tableFeature: {
    color: Colors.white,
    ...Type.bodySemi,
  },

  infoRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  infoLabel: {
    width: '42%',
    paddingRight: 10,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.inkMuted,
    ...Type.body,
  },

  infoValue: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.white,
    textAlign: 'right',
    ...Type.bodySemi,
  },
});