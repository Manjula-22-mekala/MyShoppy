import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing, typography, radius } from '../theme/spacing';
import { formatPrice } from '../utils/formatters';
import PrimaryButton from '../components/PrimaryButton';
import EmptyState from '../components/EmptyState';

export default function OrderConfirmationScreen({ route, navigation }) {
  const order = route.params?.order;

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <EmptyState icon="alert-circle-outline" title="Order not found" subtitle="We couldn't find details for this order." actionLabel="Back to Home" onAction={() => navigation.navigate('MainTabs', { screen: 'Home' })} />
      </SafeAreaView>
    );
  }

  const goHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs', params: { screen: 'Home' } }],
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={72} color={colors.success} />
        </View>
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>Your order has been accepted and is being prepared.</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Transaction ID</Text>
            <Text style={styles.value}>{order.orderId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Items</Text>
            <Text style={styles.value}>{order.itemCount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Deliver To</Text>
            <Text style={[styles.value, styles.valueRight]}>{order.delivery.fullName}{'\n'}{order.delivery.addressLine}, {order.delivery.city} {order.delivery.zipCode}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Order Summary</Text>
          {order.items.map((item) => (
            <View key={item.productId} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name} x{item.quantity}</Text>
              <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.itemRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Continue Shopping" onPress={goHome} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, alignItems: 'center', paddingBottom: spacing.xxl },
  successIcon: { marginTop: spacing.lg, marginBottom: spacing.sm },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: 4, marginBottom: spacing.lg },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionLabel: { ...typography.bodyStrong, color: colors.text, marginBottom: spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  label: { ...typography.body, color: colors.textMuted },
  value: { ...typography.bodyStrong, color: colors.text },
  valueRight: { textAlign: 'right', flex: 1 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  itemName: { ...typography.body, color: colors.text, flex: 1 },
  itemPrice: { ...typography.body, color: colors.text },
  totalLabel: { ...typography.h3, color: colors.text },
  totalValue: { ...typography.h3, color: colors.text },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
});
