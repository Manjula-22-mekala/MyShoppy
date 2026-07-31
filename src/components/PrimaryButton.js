import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

export default function PrimaryButton({ label, onPress, disabled, loading, variant = 'solid' }) {
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isOutline ? styles.outline : styles.solid,
        disabled && (isOutline ? styles.outlineDisabled : styles.solidDisabled),
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : colors.textInverse} />
      ) : (
        <Text style={[styles.label, isOutline ? styles.outlineLabel : styles.solidLabel, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: { backgroundColor: colors.primary },
  solidDisabled: { backgroundColor: colors.disabled },
  outline: { borderWidth: 1, borderColor: colors.primary, backgroundColor: 'transparent' },
  outlineDisabled: { borderColor: colors.disabled },
  label: { fontSize: 15, fontWeight: '700' },
  solidLabel: { color: colors.textInverse },
  outlineLabel: { color: colors.primary },
  labelDisabled: { color: colors.textInverse },
});
