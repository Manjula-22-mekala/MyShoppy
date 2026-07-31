import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

export default function QuantityStepper({ quantity, onIncrement, onDecrement, max, min = 1 }) {
  const atMax = typeof max === 'number' && quantity >= max;
  const atMin = quantity <= min;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, atMin && styles.buttonDisabled]}
        onPress={onDecrement}
        disabled={atMin}
        accessibilityLabel="Decrease quantity"
      >
        <Ionicons name="remove" size={16} color={atMin ? colors.disabled : colors.primary} />
      </TouchableOpacity>
      <Text style={styles.value}>{quantity}</Text>
      <TouchableOpacity
        style={[styles.button, atMax && styles.buttonDisabled]}
        onPress={onIncrement}
        disabled={atMax}
        accessibilityLabel="Increase quantity"
      >
        <Ionicons name="add" size={16} color={atMax ? colors.disabled : colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  button: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  buttonDisabled: { backgroundColor: colors.background },
  value: {
    minWidth: 32,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: spacing.sm,
  },
});
