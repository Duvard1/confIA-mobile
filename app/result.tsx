import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import GaugeRing from '@/components/GaugeRing';
import CircleIndicator from '@/components/CircleIndicator';
import SocialEngineeringCard from '@/components/SocialEngineeringCard';
import QuoteCard from '@/components/QuoteCard';
import RecommendationItem from '@/components/RecommendationItem';
import { SecondaryButton } from '@/components/Buttons';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { Colors, Radius, Shadow, Spacing, Type, riskColor, riskSoft, riskLabel } from '@/constants/theme';

export default function ResultScreen() {
  const { current } = useAnalysisStore();

  if (!current) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-outline" size={40} color={Colors.inkFaint} />
        <Text style={styles.emptyTitle}>Sin resultado disponible</Text>
        <SecondaryButton
          label="Volver a Inicio"
          onPress={() => router.replace('/(tabs)')}
          style={{ marginTop: Spacing.lg }}
        />
      </View>
    );
  }

  const { semantic_analysis, overall_assessment, dashboard, acoustic_analysis } = current;
  const color = riskColor(overall_assessment.risk_level);
  const soft = riskSoft(overall_assessment.risk_level);

  const quotes = semantic_analysis.evidence.slice(0, 3);

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.white} />
        </Pressable>
        <Text style={styles.topBarTitle}>Resultado del análisis</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero risk card */}
        <View style={[styles.heroCard, { backgroundColor: soft }]}>
          <Text style={[styles.heroLabel, { color }]}>RIESGO</Text>
          <GaugeRing size={132} strokeWidth={13} progress={overall_assessment.risk_score} color={color}>
            <Text style={[styles.heroValue, { color }]}>{overall_assessment.risk_score}%</Text>
          </GaugeRing>
          <View style={[styles.levelPill, { backgroundColor: color }]}>
            <Text style={styles.levelPillText}>Nivel {riskLabel(overall_assessment.risk_level)}</Text>
          </View>
          <Text style={styles.heroMessage}>{overall_assessment.final_message}</Text>
        </View>

        {/* Three circular indicators */}
        <View style={styles.indicatorsRow}>
          <CircleIndicator
            label="Fraude"
            value={dashboard.gauges.fraud}
            color={Colors.danger}
          />
          <CircleIndicator
            label="Voz IA"
            value={dashboard.gauges.ai_voice}
            color={Colors.success}
          />
          <CircleIndicator
            label="Manipulación"
            value={dashboard.gauges.manipulation}
            color={Colors.warning}
          />
        </View>

        {/* Summary */}
        <Section title="Resumen" icon="document-text-outline">
          <Text style={styles.summaryText}>{semantic_analysis.summary.description}</Text>
        </Section>

        {/* Social engineering techniques */}
        <Section title="Ingeniería social detectada" icon="warning-outline">
          {semantic_analysis.social_engineering.techniques.map((t) => (
            <SocialEngineeringCard key={t.name} name={t.name} confidence={t.confidence} />
          ))}
        </Section>

        {/* Relevant quotes */}
        {quotes.length > 0 && (
          <Section title="Frases relevantes" icon="chatbox-ellipses-outline">
            {quotes.map((q, i) => (
              <QuoteCard key={i} text={q.text} />
            ))}
          </Section>
        )}

        {/* Recommendations */}
        <Section title="Recomendaciones" icon="checkmark-circle-outline">
          {semantic_analysis.recommendations.map((r, i) => (
            <RecommendationItem key={i} text={r} />
          ))}
        </Section>

        <SecondaryButton
          label="Ver dashboard técnico"
          icon="stats-chart-outline"
          onPress={() => router.push('/(tabs)/dashboard')}
          style={{ marginTop: Spacing.sm, marginBottom: Spacing.xxl }}
        />
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={18} color={Colors.white} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  topBar: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: Spacing.lg,
  paddingTop: 56,
  paddingBottom: Spacing.md,
  backgroundColor: Colors.black,
  borderBottomWidth: 1,
  borderBottomColor: Colors.border,
},
  backBtn: {
  width: 34,
  height: 34,
  borderRadius: 17,
  backgroundColor: Colors.surfaceAlt,
  borderWidth: 1,
  borderColor: Colors.border,
  alignItems: 'center',
  justifyContent: 'center',
},
  topBarTitle: { fontSize: 15, color: Colors.white, ...Type.bodySemi },

  content: { padding: Spacing.xl, paddingBottom: Spacing.xxl },

  heroCard: {
    borderRadius: Radius.xl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  heroLabel: {
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
    ...Type.bodySemi,
  },
  heroValue: { fontSize: 28, ...Type.display },
  levelPill: {
    marginTop: Spacing.md,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  levelPillText: { color: Colors.white, fontSize: 13, ...Type.bodySemi },
  heroMessage: {
  marginTop: Spacing.md,
  paddingHorizontal: Spacing.xl,
  fontSize: 13,
  lineHeight: 19,
  color: Colors.white,
  textAlign: 'center',
  ...Type.body,
},

  indicatorsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadow.card,
  },

  section: { marginBottom: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: 17, color: Colors.white, ...Type.displaySemi },
 summaryText: {
  fontSize: 14,
  lineHeight: 21,
  color: Colors.white,
  backgroundColor: Colors.surface,
  borderWidth: 1,
  borderColor: Colors.border,
  borderRadius: Radius.md,
  padding: Spacing.lg,
  ...Type.body,
},

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg,
    padding: Spacing.xl,
  },
  emptyTitle: { fontSize: 16, color: Colors.white, marginTop: Spacing.md, ...Type.bodySemi },
});
