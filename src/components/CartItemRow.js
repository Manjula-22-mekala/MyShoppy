import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { radius, spacing, typography } from '../theme/spacing';
import { formatPrice } from '../utils/formatters';
import QuantityStepper from './QuantityStepper';

export default function CartItemRow({ item, onIncrement, onDecrement, onRemove }) {
  const lineTotal = item.price * item.quantity;
  const atStockLimit = item.quantity >= item.stock;

  return (
    <View style={styles.row}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.price}>{formatPrice(item.price)} each</Text>
        {atStockLimit && <Text style={styles.stockWarning}>Max available quantity reached</Text>}
        <View style={styles.bottomRow}>
          <QuantityStepper quantity={item.quantity} onIncrement={onIncrement} onDecrement={onDecrement} max={item.stock} />
          <Text style={styles.lineTotal}>{formatPrice(lineTotal)}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton} accessibilityLabel={`Remove ${item.name}`}>
        <Ionicons name="trash-outline" size={18} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  image: { width: 72, height: 72, borderRadius: radius.md, backgroundColor: colors.background },
  info: { flex: 1, gap: 4 },
  name: { ...typography.bodyStrong, color: colors.text },
  price: { ...typography.caption, color: colors.textMuted },
  stockWarning: { ...typography.caption, color: colors.warning },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs },
  lineTotal: { ...typography.h3, color: colors.text },
  removeButton: { padding: spacing.xs },
});
