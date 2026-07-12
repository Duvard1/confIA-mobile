import { Colors, Radius, Spacing, Type, riskColor, riskLabel, riskSoft } from '@/constants/theme';
import { fetchUserHistory } from '@/services/api';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { HistoryEntry } from '@/types/analysis';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

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
  const { history, setHistory } = useAnalysisStore();
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'family' | 'friend' | 'company' | 'unknown'>('todos');

  const loadHistory = async (showLoading = true) => {
    if (!userId) return;
    if (showLoading) setLoading(true);
    try {
      const response = await fetchUserHistory(userId);
      setHistory(response.data);
    } catch (err) {
      console.error('[HistorialScreen] Error cargando historial:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory(false);
  };

  const filteredHistory = history.filter((item) => {
    if (filter === 'todos') return true;
    const itemType = item.data?.audio?.contact_type;
    return itemType?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial</Text>
      {loading && history.length === 0 ? (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color={Colors.navy} />
          <Text style={[styles.emptyText, { marginTop: Spacing.md }]}>
            Cargando historial...
          </Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="time-outline" size={40} color={Colors.inkFaint} />
          <Text style={styles.emptyTitle}>Aún no hay análisis</Text>
          <Text style={styles.emptyText}>
            Las llamadas que analices aparecerán aquí para que puedas revisarlas cuando quieras.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'family', label: 'Familiar' },
                { id: 'friend', label: 'Amigo' },
                { id: 'company', label: 'Empresa' },
                { id: 'unknown', label: 'Desconocido' },
              ].map((opt) => {
                const active = filter === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setFilter(opt.id as any)}
                    style={[styles.filterBtn, active && styles.filterBtnActive]}
                  >
                    <Text style={[styles.filterText, active && styles.filterTextActive]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {filteredHistory.length === 0 ? (
            <View style={styles.emptyFilter}>
              <Ionicons name="funnel-outline" size={36} color={Colors.inkFaint} />
              <Text style={styles.emptyTitle}>Sin resultados</Text>
              <Text style={styles.emptyText}>No hay llamadas registradas en esta categoría.</Text>
            </View>
          ) : (
            <FlatList
              data={filteredHistory}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <HistoryRow item={item} />}
              contentContainerStyle={{ paddingBottom: Spacing.xxl }}
              ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.navy]}
                  tintColor={Colors.navy}
                />
              }
            />
          )}
        </>
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
  filterContainer: {
    marginBottom: Spacing.md,
    height: 40,
  },
  filterScroll: {
    gap: 8,
    paddingRight: Spacing.md,
  },
  filterBtn: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  filterText: {
    fontSize: 13,
    color: Colors.inkMuted,
    ...Type.bodySemi,
  },
  filterTextActive: {
    color: Colors.white,
  },
  emptyFilter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: 80,
  },
});
