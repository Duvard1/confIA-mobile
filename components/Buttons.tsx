import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  Radius,
  Spacing,
  Type,
  Shadow,
} from '@/constants/theme';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  icon,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.primary,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.primaryPressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <>
          {icon ? (
            <Ionicons
              name={icon}
              size={20}
              color={Colors.white}
              style={styles.icon}
            />
          ) : null}

          <Text style={styles.primaryLabel}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  icon,
  style,
  disabled,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.secondary,
        disabled && styles.disabled,
        pressed && !disabled && styles.secondaryPressed,
        style,
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={Colors.white}
          style={styles.icon}
        />
      ) : null}

      <Text style={styles.secondaryLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    minHeight: 58,
    backgroundColor: Colors.brand,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.brand,
  },

  primaryPressed: {
    backgroundColor: Colors.brandDeep,
    transform: [{ scale: 0.99 }],
  },

  primaryLabel: {
    color: Colors.white,
    fontSize: 17,
    ...Type.bodySemi,
  },

  secondary: {
    minHeight: 56,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.lg,
    paddingVertical: 15,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryPressed: {
    backgroundColor: Colors.surface,
  },

  secondaryLabel: {
    color: Colors.white,
    fontSize: 16,
    ...Type.bodySemi,
  },

  icon: {
    marginRight: 8,
  },

  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
});