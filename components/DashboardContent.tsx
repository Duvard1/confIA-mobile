import { Colors, Radius, Shadow, Spacing, Type, riskColor } from '@/constants/theme';
import { AnalysisData } from '@/types/analysis';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BenfordBarChart from './BenfordBarChart';
import GaugeRing from './GaugeRing';
import { BenfordTable, InfoRow, SectionHeader, StatCard } from './Misc';
import RadarChart from './RadarChart';

const BENFORD_LABELS: Record<string, string> = {
  rms: 'RMS (energía)',
  pitch: 'Pitch (tono)',
  zcr: 'ZCR (cruces por cero)',
  silences: 'Silencios',
  jitter: 'Jitter',
  shimmer: 'Shimmer',
  fft: 'FFT (espectro)',
};

const BENFORD_DESCRIPTIONS: Record<string, string> = {
  rms: 'Mide la intensidad o energía del audio. Cambios bruscos pueden delatar manipulación.',
  pitch: 'Mide la entonación de la voz (agudo/grave). Las voces artificiales suelen ser más monótonas.',
  zcr: 'Mide la rapidez del cambio de señal. Ayuda a distinguir ruido de voz natural.',
  silences: 'Analiza las pausas en el habla. Las IA suelen hacer silencios inusualmente perfectos.',
  jitter: 'Mide la inestabilidad en el tono. Las voces reales tienen vibraciones naturales que las IA no imitan bien.',
  shimmer: 'Mide la inestabilidad en el volumen. La falta de variaciones de volumen delata una voz sintética.',
  fft: 'Analiza las frecuencias del audio. Permite identificar anomalías espectrales imperceptibles al oído.',
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

  const localPredict = data.local_predict;
  const hasLocalPredict = !!localPredict && (localPredict.prediccion !== undefined || localPredict.score_riesgo !== undefined);
  const localPredictScore = localPredict?.score_riesgo ?? localPredict?.evidencia_neuronal?.score_fake_pct ?? 0;
  const localPredictConfidence = localPredict?.nivel_confianza;
  const localPredictModel = localPredict?.evidencia_neuronal?.nombre_modelo || 'XLS-R-SLS-Llamadas';

  const getRiskColor = (score: number) => {
    if (score >= 70) return Colors.danger;
    if (score >= 40) return Colors.warning;
    return Colors.success;
  };

  console.log('[DashboardContent] dashboard.feature_scores:', JSON.stringify(dashboard?.feature_scores, null, 2));

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.eyebrow}>Análisis forense</Text>
      <Text style={styles.title}>Dashboard técnico</Text>

      {/* Indicador principal y centrado: API local (clonación de voz) */}
      <View style={styles.mainIndicatorCard}>
        <SectionHeader title="Detección de Clonación de Voz (Modelo SLS)" icon="mic-outline" />
        {hasLocalPredict ? (
          <View style={styles.mainIndicatorContent}>
            <GaugeRing
              size={160}
              strokeWidth={15}
              progress={localPredictScore}
              color={getRiskColor(localPredictScore)}
              gradient={true}
            >
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.mainValueText}>{Math.round(localPredictScore)}%</Text>
                <Text style={styles.mainLabelText} numberOfLines={2}>
                  {localPredictConfidence}
                </Text>
              </View>
            </GaugeRing>
            <View style={styles.mainMetaInfo}>
              <Text style={styles.mainMetaLabel}>Modelo:</Text>
              <Text style={styles.mainMetaValue}>{localPredictModel}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.localApiOffline}>
            <Ionicons name="warning-outline" size={24} color={Colors.warning} />
            <Text style={styles.offlineText}>
              API local de clonación de voz no detectada o desconectada.
            </Text>
            <Text style={styles.offlineSubtext}>
              Asegúrate de correr el servicio en: http://localhost:8000
            </Text>
          </View>
        )}
      </View>

      <View style={styles.statsRow}>
        <StatCard label="Riesgo" value={`${overall_assessment.risk_score}%`} color={riskColor(overall_assessment.risk_level)} />
        <StatCard label="Fraude" value={`${Math.round(dashboard.gauges.fraud)}%`} color={Colors.danger} />
        <StatCard label="Voz IA" value={`${Math.round(dashboard.gauges.ai_voice)}%`} color={getRiskColor(dashboard.gauges.ai_voice)} />
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
          {BENFORD_LABELS[activeFeature] || activeFeature} — distribución del primer dígito frente a la ley de Benford.
        </Text>
        {BENFORD_DESCRIPTIONS[activeFeature] && (
          <Text style={styles.descText}>
            {BENFORD_DESCRIPTIONS[activeFeature]}
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <SectionHeader title="Tabla resumida" icon="grid-outline" />
        <BenfordTable rows={dashboard.feature_scores} />
      </View>

      <View style={styles.card}>
        <SectionHeader title="Información del audio" icon="document-text-outline" />
        <InfoRow label="Nombre" value={audio.original_name} />
        <InfoRow label="Duración" value={`${Math.round(audio.duration_seconds)}s`} />
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
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
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
  pillActive: { backgroundColor: Colors.navy },
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
  descText: {
    fontSize: 12,
    color: Colors.ink,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 17,
    width: '100%',
    fontStyle: 'italic',
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
  mainIndicatorCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    width: '100%',
    ...Shadow.card,
  },
  mainIndicatorContent: {
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  mainValueText: {
    fontSize: 32,
    color: Colors.navy,
    ...Type.display,
  },
  mainLabelText: {
    fontSize: 11.5,
    color: Colors.inkMuted,
    marginTop: 2,
    textAlign: 'center',
    paddingHorizontal: 8,
    lineHeight: 15,
    ...Type.bodySemi,
  },
  mainMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.lg,
  },
  mainMetaLabel: {
    fontSize: 12,
    color: Colors.inkMuted,
    ...Type.body,
  },
  mainMetaValue: {
    fontSize: 12,
    color: Colors.navy,
    ...Type.bodySemi,
  },
  localApiOffline: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  offlineText: {
    fontSize: 13.5,
    color: Colors.ink,
    textAlign: 'center',
    marginTop: 8,
    ...Type.bodySemi,
  },
  offlineSubtext: {
    fontSize: 11,
    color: Colors.inkMuted,
    textAlign: 'center',
    marginTop: 4,
    ...Type.body,
  },
});
