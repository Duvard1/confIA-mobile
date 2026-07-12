import React from 'react';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '@/constants/theme';

interface LogoProps {
  size?: number;
}

/** ConfIA mark: a scanning ring around a checkmark — "verified by AI". */
export default function Logo({ size = 88 }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={Colors.signal} />
          <Stop offset="100%" stopColor={Colors.navy} />
        </LinearGradient>
      </Defs>
      <Circle
        cx="50"
        cy="50"
        r="42"
        stroke="url(#logoGrad)"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="215 264"
      />
      <Circle cx="50" cy="50" r="30" fill={Colors.navy} opacity={0.05} />
      <Path
        d="M35 51 L45 61 L67 38"
        stroke={Colors.navy}
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
