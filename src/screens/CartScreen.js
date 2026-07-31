import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing, typography, radius } from '../theme/spacing';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import CartItemRow from '../components/CartItemRow';
import PrimaryButton from '../components/PrimaryButton';
import EmptyState from '../components/EmptyState';
import LoadingIndicator from '../components/LoadingIndicator';

export default function CartScreen({ navigation }) {
  const { items, hydrated, itemCount, subtotal, deliveryFee, total, updateQuantity, removeFromCart } = useCart();

  if (!hydrated) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LoadingIndicator label="Loading your cart..." />
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Text style={styles.title}>My Cart</Text>
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          subtitle="Browse our categories and add some household essentials."
          actionLabel="Start Shopping"
          onAction={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={styles.title}>My Cart ({itemCount} item{itemCount === 1 ? '' : 's'})</Text>}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => (
          <CartItemRow
            item={item}
            onIncrement={() => updateQuantity(item.productId, item.quantity + 1)}
            onDecrement={() => updateQuantity(item.productId, item.quantity - 1)}
            onRemove={() => removeFromCart(item.productId)}
          />
        )}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>
        <PrimaryButton label="Proceed to Checkout" onPress={() => navigation.navigate('Checkout')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  title: { ...typography.h1, color: colors.text, paddingHorizontal: spacing.lg, paddingTop: spacing.md, marginBottom: spacing.md },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  summary: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { ...typography.body, color: colors.textMuted },
  summaryValue: { ...typography.body, color: colors.text },
  totalRow: { marginTop: spacing.xs, marginBottom: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  totalLabel: { ...typography.h3, color: colors.text },
  totalValue: { ...typography.h3, color: colors.text },
});
