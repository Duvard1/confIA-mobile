import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Rect,
  Line,
  Text as SvgText,
} from 'react-native-svg';
import { Colors, Type } from '@/constants/theme';

interface BenfordBarChartProps {
  observed: number[];
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
  const padding = {
    top: 12,
    bottom: 26,
    left: 10,
    right: 10,
  };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const itemCount = Math.max(
    observed.length,
    expected.length,
    1,
  );

  const groupWidth = chartWidth / itemCount;
  const barWidth = Math.max(6, groupWidth / 2.8);

  const maxValue = Math.max(
    0.35,
    ...observed,
    ...expected,
  );

  const getBarHeight = (value: number) => {
    return (value / maxValue) * chartHeight;
  };

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={width - padding.right}
          y2={padding.top + chartHeight}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1}
        />

        {Array.from({ length: itemCount }).map((_, index) => {
          const groupX =
            padding.left + index * groupWidth;

          const observedHeight = getBarHeight(
            observed[index] ?? 0,
          );

          const expectedHeight = getBarHeight(
            expected[index] ?? 0,
          );

          return (
            <React.Fragment key={index}>
              <Rect
                x={
                  groupX +
                  groupWidth / 2 -
                  barWidth -
                  2
                }
                y={
                  padding.top +
                  chartHeight -
                  observedHeight
                }
                width={barWidth}
                height={observedHeight}
                rx={3}
                fill={Colors.brand}
              />

              <Rect
                x={groupX + groupWidth / 2 + 2}
                y={
                  padding.top +
                  chartHeight -
                  expectedHeight
                }
                width={barWidth}
                height={expectedHeight}
                rx={3}
                fill="rgba(255,255,255,0.42)"
              />

              <SvgText
                x={groupX + groupWidth / 2}
                y={height - 6}
                fontSize={11}
                fill="rgba(255,255,255,0.72)"
                textAnchor="middle"
                fontFamily="Inter_500Medium"
              >
                {index + 1}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.dot,
              { backgroundColor: Colors.brand },
            ]}
          />
          <Text style={styles.legendLabel}>
            Observado
          </Text>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor:
                  'rgba(255,255,255,0.42)',
              },
            ]}
          />
          <Text style={styles.legendLabel}>
            Esperado (Benford)
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 18,
    marginTop: 6,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },

  legendLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.72)',
    ...Type.body,
  },
});