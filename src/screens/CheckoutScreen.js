import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing, typography, radius } from '../theme/spacing';
import { formatPrice, generateOrderId } from '../utils/formatters';
import { validateCheckoutForm, hasErrors } from '../utils/validators';
import { useCart } from '../context/CartContext';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import EmptyState from '../components/EmptyState';

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  addressLine: '',
  city: '',
  zipCode: '',
  notes: '',
};

export default function CheckoutScreen({ navigation }) {
  const { items, itemCount, subtotal, deliveryFee, total, clearCart } = useCart();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          subtitle="Add products to your cart before checking out."
          actionLabel="Back to Shopping"
          onAction={() => navigation.navigate('MainTabs', { screen: 'Home' })}
        />
      </SafeAreaView>
    );
  }

  const updateField = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePlaceOrder = () => {
    const validationErrors = validateCheckoutForm(form);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setSubmitting(true);
    setTimeout(() => {
      const order = {
        orderId: generateOrderId(),
        items,
        itemCount,
        subtotal,
        deliveryFee,
        total,
        delivery: form,
      };
      setSubmitting(false);
      clearCart();
      navigation.replace('OrderConfirmation', { order });
    }, 700);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <FormField label="Full Name" value={form.fullName} onChangeText={updateField('fullName')} error={errors.fullName} placeholder="Jane Doe" />
          <FormField label="Phone Number" value={form.phone} onChangeText={updateField('phone')} error={errors.phone} placeholder="9876543210" keyboardType="phone-pad" maxLength={10} />
          <FormField label="Address" value={form.addressLine} onChangeText={updateField('addressLine')} error={errors.addressLine} placeholder="Street, apartment, area" multiline />
          <FormField label="City" value={form.city} onChangeText={updateField('city')} error={errors.city} placeholder="City" />
          <FormField label="ZIP / Postal Code" value={form.zipCode} onChangeText={updateField('zipCode')} error={errors.zipCode} placeholder="560001" keyboardType="number-pad" maxLength={6} />
          <FormField label="Delivery Notes (optional)" value={form.notes} onChangeText={updateField('notes')} placeholder="Leave at the front door, call on arrival, etc." multiline />

          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            {items.map((item) => (
              <View key={item.productId} style={styles.summaryItemRow}>
                <Text style={styles.summaryItemName} numberOfLines={1}>{item.name} x{item.quantity}</Text>
                <Text style={styles.summaryItemPrice}>{formatPrice(item.price * item.quantity)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.summaryItemRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.summaryItemRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItemRow}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton label={`Place Order · ${formatPrice(total)}`} onPress={handlePlaceOrder} loading={submitting} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  sectionTitle: { ...typography.h2, color: colors.text, marginBottom: spacing.md, marginTop: spacing.sm },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  summaryItemRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  summaryItemName: { ...typography.body, color: colors.text, flex: 1 },
  summaryItemPrice: { ...typography.body, color: colors.text },
  summaryLabel: { ...typography.body, color: colors.textMuted },
  summaryValue: { ...typography.body, color: colors.text },
  totalLabel: { ...typography.h3, color: colors.text },
  totalValue: { ...typography.h3, color: colors.text },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
});
