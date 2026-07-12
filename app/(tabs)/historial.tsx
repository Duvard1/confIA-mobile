import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { Colors, Radius, Spacing, Type, riskColor, riskSoft, riskLabel } from '@/constants/theme';
import { HistoryEntry } from '@/types/analysis';

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('es', { day: '2-digit', month: 'short' }) +
      ' · ' +
      d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function HistoryRow({ item }: { item: HistoryEntry }) {
  const color = riskColor(item.riskLevel);
  const { setCurrentAnalysis } = useAnalysisStore();
  return (
    <Pressable
      style={styles.row}
      onPress={() => {
        setCurrentAnalysis(item.data, item.fileName);
        router.push('/result');
      }}
    >
      <View style={[styles.badge, { backgroundColor: riskSoft(item.riskLevel) }]}>
        <Text style={[styles.badgeText, { color }]}>{item.riskScore}%</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.fileName} numberOfLines={1}>
          {item.fileName}
        </Text>
        <Text style={styles.meta}>{formatDate(item.createdAt)}</Text>
      </View>
      <View style={[styles.pill, { backgroundColor: riskSoft(item.riskLevel) }]}>
        <Text style={[styles.pillText, { color }]}>{riskLabel(item.riskLevel)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.inkFaint} />
    </Pressable>
  );
}

export default function HistorialScreen() {
  const { history } = useAnalysisStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial</Text>
      {history.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="time-outline" size={40} color={Colors.inkFaint} />
          <Text style={styles.emptyTitle}>Aún no hay análisis</Text>
          <Text style={styles.emptyText}>
            Las llamadas que analices aparecerán aquí para que puedas revisarlas cuando quieras.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryRow item={item} />}
          contentContainerStyle={{ paddingBottom: Spacing.xxl }}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, padding: Spacing.xl },
  title: { fontSize: 24, color: Colors.navy, marginBottom: Spacing.lg, ...Type.display },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  badge: {
    width: 46,
    height: 46,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 13, ...Type.displaySemi },
  fileName: { fontSize: 14, color: Colors.ink, ...Type.bodySemi },
  meta: { fontSize: 12, color: Colors.inkMuted, marginTop: 2, ...Type.body },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill },
  pillText: { fontSize: 11, ...Type.bodySemi },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl },
  emptyTitle: { fontSize: 16, color: Colors.navy, marginTop: Spacing.md, ...Type.bodySemi },
  emptyText: {
    fontSize: 13,
    color: Colors.inkMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
    ...Type.body,
  },
});
