import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RadarChart from './RadarChart';
import BenfordBarChart from './BenfordBarChart';
import { SectionHeader, StatCard, BenfordTable, InfoRow } from './Misc';
import { AnalysisData } from '@/types/analysis';
import { Colors, Radius, Shadow, Spacing, Type, riskColor } from '@/constants/theme';

const BENFORD_LABELS: Record<string, string> = {
  rms: 'RMS (energía)',
  pitch: 'Pitch (tono)',
  zcr: 'ZCR (cruces por cero)',
  silences: 'Silencios',
  jitter: 'Jitter',
  shimmer: 'Shimmer',
  fft: 'FFT (espectro)',
};

export default function DashboardContent({ data }: { data: AnalysisData }) {
  const { overall_assessment, dashboard, audio, transcription, metadata } = data;
  const featureKeys = Object.keys(dashboard.benford || {});
  const [activeFeature, setActiveFeature] = useState(featureKeys[0]);

  const radarData = [
    { label: 'Urgencia', value: dashboard.radar.urgency },
    { label: 'Miedo', value: dashboard.radar.fear },
    { label: 'Autoridad', value: dashboard.radar.authority },
    { label: 'Presión', value: dashboard.radar.pressure },
  ];

  const activeBenford = activeFeature ? dashboard.benford[activeFeature] : null;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.eyebrow}>Análisis forense</Text>
      <Text style={styles.title}>Dashboard técnico</Text>

      <View style={styles.statsRow}>
        <StatCard label="Riesgo" value={`${overall_assessment.risk_score}%`} color={riskColor(overall_assessment.risk_level)} />
        <StatCard label="Fraude" value={`${Math.round(dashboard.gauges.fraud)}%`} color={Colors.danger} />
        <StatCard label="Voz IA" value={`${Math.round(dashboard.gauges.ai_voice)}%`} color={Colors.success} />
        <StatCard label="Tiempo" value={`${(metadata.processing_time_ms / 1000).toFixed(1)}s`} color={Colors.navy} />
      </View>

      <View style={styles.card}>
        <SectionHeader title="Indicadores de manipulación" icon="pulse-outline" />
        <RadarChart data={radarData} size={250} />
      </View>

      <View style={styles.card}>
        <SectionHeader title="Comparación Benford" icon="bar-chart-outline" />
        <View style={styles.featurePills}>
          {featureKeys.map((key) => {
            const active = key === activeFeature;
            return (
              <Pressable
                key={key}
                onPress={() => setActiveFeature(key)}
                style={[styles.pill, active && styles.pillActive]}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>
                  {key.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {activeBenford ? (
          <BenfordBarChart
            observed={activeBenford.observed}
            expected={activeBenford.expected}
            width={280}
            height={170}
          />
        ) : null}
        <Text style={styles.caption}>
          {BENFORD_LABELS[activeFeature] || activeFeature} — distribución del primer dígito
          frente a la ley de Benford. Mayor desviación puede indicar procesamiento artificial.
        </Text>
      </View>

      <View style={styles.card}>
        <SectionHeader title="Tabla resumida" icon="grid-outline" />
        <BenfordTable rows={dashboard.feature_scores} />
      </View>

      <View style={styles.card}>
        <SectionHeader title="Información del audio" icon="document-text-outline" />
        <InfoRow label="Nombre" value={audio.original_name} />
        <InfoRow label="Duración" value={`${Math.round(audio.duration_seconds)}s`} />
        <InfoRow label="Idioma" value={transcription.language} />
        <InfoRow
          label="Confianza de transcripción"
          value={`${Math.round(transcription.confidence * 100)}%`}
        />
        <InfoRow label="Modelo LLM" value={metadata.models.llm} />
        <InfoRow label="Modelo de transcripción" value={metadata.models.transcription} />
        <InfoRow
          label="Tiempo de procesamiento"
          value={`${(metadata.processing_time_ms / 1000).toFixed(2)} s`}
        />
      </View>
    </ScrollView>
  );
}

export function DashboardEmptyState() {
  return (
    <View style={styles.empty}>
      <Ionicons name="stats-chart-outline" size={40} color={Colors.inkFaint} />
      <Text style={styles.emptyTitle}>Sin análisis disponible</Text>
      <Text style={styles.emptyText}>
        Analiza una llamada desde la pestaña Inicio para ver aquí el dashboard técnico completo.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  eyebrow: {
    fontSize: 12,
    color: Colors.signalDeep,
    letterSpacing: 1,
    textTransform: 'uppercase',
    ...Type.bodySemi,
  },
  title: { fontSize: 24, color: Colors.navy, marginTop: 4, marginBottom: Spacing.lg, ...Type.display },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.lg },
  card: {
  width: '100%',
  backgroundColor: Colors.surface,
  borderRadius: Radius.lg,
  borderWidth: 1,
  borderColor: Colors.border,
  padding: Spacing.lg,
  marginBottom: Spacing.lg,
  alignItems: 'stretch',
  overflow: 'hidden',
  ...Shadow.card,
},
  featurePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.md,
    justifyContent: 'center',
    width: '100%',
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surfaceAlt,
  },
  pillActive: { backgroundColor: Colors.brand },
  pillText: { fontSize: 11, color: Colors.inkMuted, ...Type.bodySemi },
  pillTextActive: { color: Colors.white },
  caption: {
    fontSize: 12,
    color: Colors.inkMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 17,
    width: '100%',
    ...Type.body,
  },
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
