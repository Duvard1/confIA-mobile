import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { Colors, Type } from '@/constants/theme';

interface BenfordBarChartProps {
  observed: number[]; // fractions 0..1, digits 1..9
  expected: number[];
  width?: number;
  height?: number;
}

export default function BenfordBarChart({
  observed,
  expected,
  width = 320,
  height = 180,
}: BenfordBarChartProps) {
  const padding = { top: 10, bottom: 24, left: 8, right: 8 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const n = Math.max(observed.length, expected.length);
  const groupW = chartW / n;
  const barW = groupW / 2.6;
  const maxVal = Math.max(0.35, ...observed, ...expected);

  const barHeight = (v: number) => (v / maxVal) * chartH;

  return (
    <View>
      <Svg width={width} height={height}>
        <Line
          x1={padding.left}
          y1={padding.top + chartH}
          x2={width - padding.right}
          y2={padding.top + chartH}
          stroke={Colors.border}
          strokeWidth={1}
        />
        {Array.from({ length: n }).map((_, i) => {
          const gx = padding.left + i * groupW;
          const oh = barHeight(observed[i] ?? 0);
          const eh = barHeight(expected[i] ?? 0);
          return (
            <React.Fragment key={i}>
              <Rect
                x={gx + groupW / 2 - barW - 2}
                y={padding.top + chartH - oh}
                width={barW}
                height={oh}
                rx={3}
                fill={Colors.signal}
              />
              <Rect
                x={gx + groupW / 2 + 2}
                y={padding.top + chartH - eh}
                width={barW}
                height={eh}
                rx={3}
                fill={Colors.inkFaint}
              />
              <SvgText
                x={gx + groupW / 2}
                y={height - 6}
                fontSize={11}
                fill={Colors.inkMuted}
                textAnchor="middle"
              >
                {i + 1}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: Colors.signal }]} />
          <Text style={styles.legendLabel}>Observado</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: Colors.inkFaint }]} />
          <Text style={styles.legendLabel}>Esperado (Benford)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 12, color: Colors.inkMuted, ...Type.body },
});
