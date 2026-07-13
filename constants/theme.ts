/**
 * GuardIAn — Design tokens
 *
 * Dirección visual:
 * fondo oscuro, superficies profundas, texto blanco y rojo como
 * color principal de acción.
 */

export const Colors = {
  // Brand
  brand: '#E3262E',
  brandDeep: '#B91C24',
  brandSoft: 'rgba(227,38,46,0.18)',

  // Core
  navy: '#FFFFFF',
  navyDeep: '#070A10',

  ink: '#FFFFFF',
  inkMuted: 'rgba(255,255,255,0.70)',
  inkFaint: 'rgba(255,255,255,0.42)',

  // Backgrounds and surfaces
  bg: '#000000',

  surface: 'rgba(13,14,18,0.88)',
  surfaceAlt: 'rgba(255,255,255,0.07)',
  surfaceStrong: '#15161B',

  // Borders
  border: 'rgba(255,255,255,0.14)',
  borderStrong: 'rgba(255,255,255,0.22)',

  // AI accent
  signal: '#E3262E',
  signalSoft: 'rgba(227,38,46,0.16)',
  signalDeep: '#C71F27',

  // Status
  danger: '#EF4444',
  dangerSoft: 'rgba(239,68,68,0.16)',

  warning: '#F59E0B',
  warningSoft: 'rgba(245,158,11,0.16)',

  success: '#22C55E',
  successSoft: 'rgba(34,197,94,0.16)',

  // Utility
  white: '#FFFFFF',
  black: '#000000',

  // Tab bar
  tabBar: '#080C14',
  tabBarActive: '#FFFFFF',
  tabBarInactive: '#7F8A9A',

  // Inputs
  inputBackground: 'rgba(10,11,16,0.82)',
  inputBorder: 'rgba(255,255,255,0.16)',
  placeholder: 'rgba(255,255,255,0.40)',
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
    fontSize: 30,
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
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 5,
  },

  brand: {
    shadowColor: '#E3262E',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};