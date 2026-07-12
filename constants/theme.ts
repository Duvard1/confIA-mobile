/**
 * ConfIA — Design tokens
 *
 * Direction: "forensic calm". A cybersecurity / AI-analysis product that must
 * never feel alarming. Deep navy for trust + authority, a single cyan accent
 * that reads as "AI signal", and risk colors that appear ONLY on status
 * elements (chips, gauges) — never as backgrounds or page-wide mood.
 *
 * Signature motif: the "confidence ring" — a segmented radial ring used for
 * the splash logo, the main risk score, and every gauge in the dashboard.
 * One shape, reused everywhere, ties the whole app together.
 */

export const Colors = {
  // Core
  navy: '#0B1E3D', // primary — headers, key text, primary buttons
  navyDeep: '#071630', // splash background variant / pressed states
  ink: '#101828', // body text
  inkMuted: '#5B6472', // secondary text
  inkFaint: '#94A0B3', // placeholders / captions

  // Surfaces
  bg: '#F6F8FB', // app background
  surface: '#FFFFFF', // cards
  surfaceAlt: '#EEF2F8', // subtle fills (chips, inputs)
  border: '#E4E9F1',
  borderStrong: '#D3DAE6',

  // AI / brand accent
  signal: '#0EA5E9', // cyan — "AI is looking at this"
  signalSoft: '#E0F3FC',
  signalDeep: '#0A78AC',

  // Status — used narrowly, on badges/gauges/bars only
  danger: '#DC2626',
  dangerSoft: '#FDEAEA',
  warning: '#D97706',
  warningSoft: '#FEF3E2',
  success: '#16A34A',
  successSoft: '#E7F7EC',

  white: '#FFFFFF',
  black: '#000000',
};

export const riskColor = (level?: string) => {
  switch ((level || '').toUpperCase()) {
    case 'CRITICAL':
    case 'HIGH':
    case 'ALTO':
    case 'CRÍTICO':
      return Colors.danger;
    case 'MEDIUM':
    case 'MEDIO':
      return Colors.warning;
    case 'LOW':
    case 'BAJO':
      return Colors.success;
    default:
      return Colors.inkMuted;
  }
};

export const riskSoft = (level?: string) => {
  switch ((level || '').toUpperCase()) {
    case 'CRITICAL':
    case 'HIGH':
    case 'ALTO':
    case 'CRÍTICO':
      return Colors.dangerSoft;
    case 'MEDIUM':
    case 'MEDIO':
      return Colors.warningSoft;
    case 'LOW':
    case 'BAJO':
      return Colors.successSoft;
    default:
      return Colors.surfaceAlt;
  }
};

export const riskLabel = (level?: string) => {
  switch ((level || '').toUpperCase()) {
    case 'CRITICAL':
      return 'Crítico';
    case 'HIGH':
      return 'Alto';
    case 'MEDIUM':
      return 'Medio';
    case 'LOW':
      return 'Bajo';
    default:
      return level || '—';
  }
};

export const Type = {
  display: {
    fontFamily: 'Sora_700Bold',
    letterSpacing: -0.5,
  },
  displaySemi: {
    fontFamily: 'Sora_600SemiBold',
    letterSpacing: -0.3,
  },
  body: {
    fontFamily: 'Inter_400Regular',
  },
  bodyMedium: {
    fontFamily: 'Inter_500Medium',
  },
  bodySemi: {
    fontFamily: 'Inter_600SemiBold',
  },
  mono: {
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.2,
  },
};

export const Radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const Shadow = {
  card: {
    shadowColor: '#0B1E3D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
};
