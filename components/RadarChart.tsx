import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { Colors, Type } from '@/constants/theme';

interface RadarChartProps {
  data: { label: string; value: number }[]; // value 0..100
  size?: number;
}

export default function RadarChart({ data, size = 260 }: RadarChartProps) {
  const center = size / 2;
  const maxRadius = size / 2 - 44;
  const levels = 4;
  const angleStep = (Math.PI * 2) / data.length;

  const pointFor = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const polygonPoints = data
    .map((d, i) => {
      const p = pointFor(i, d.value);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  return (
    <View style={styles.wrap}>
      <Svg width={size} height={size}>
        {/* grid rings */}
        {Array.from({ length: levels }).map((_, ring) => {
          const r = (maxRadius / levels) * (ring + 1);
          const pts = data
            .map((_, i) => {
              const angle = angleStep * i - Math.PI / 2;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            })
            .join(' ');
          return (
            <Polygon
              key={ring}
              points={pts}
              fill="none"
              stroke={Colors.border}
              strokeWidth={1}
            />
          );
        })}
        {/* axes */}
        {data.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const x = center + maxRadius * Math.cos(angle);
          const y = center + maxRadius * Math.sin(angle);
          return (
            <Line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke={Colors.border}
              strokeWidth={1}
            />
          );
        })}
        {/* data polygon */}
        <Polygon
          points={polygonPoints}
          fill={Colors.signal}
          fillOpacity={0.22}
          stroke={Colors.signal}
          strokeWidth={2}
        />
        {data.map((d, i) => {
          const p = pointFor(i, d.value);
          return <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill={Colors.signalDeep} />;
        })}
        {/* labels */}
        {data.map((d, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const lx = center + (maxRadius + 26) * Math.cos(angle);
          const ly = center + (maxRadius + 26) * Math.sin(angle);
          return (
            <SvgText
              key={i}
              x={lx}
              y={ly}
              fontSize={12}
              fill={Colors.inkMuted}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {d.label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
