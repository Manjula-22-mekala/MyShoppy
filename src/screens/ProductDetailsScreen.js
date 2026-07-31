import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fetchProductById } from '../data/api';
import { colors } from '../theme/colors';
import { spacing, typography, radius } from '../theme/spacing';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import RatingStars from '../components/RatingStars';
import Badge from '../components/Badge';
import QuantityStepper from '../components/QuantityStepper';
import PrimaryButton from '../components/PrimaryButton';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';

export default function ProductDetailsScreen({ route, navigation }) {
  const { productId } = route.params;
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [confirmation, setConfirmation] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchProductById(productId).then((result) => {
      if (isMounted) {
        setProduct(result);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [productId]);

  useEffect(() => {
    if (!confirmation) return;
    const timeout = setTimeout(() => setConfirmation(false), 1800);
    return () => clearTimeout(timeout);
  }, [confirmation]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <LoadingIndicator label="Loading product..." />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <EmptyState icon="alert-circle-outline" title="Product not found" subtitle="This product may no longer be available." actionLabel="Go Back" onAction={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setConfirmation(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{product.name}</Text>
            {product.inStock ? (
              <Badge label={product.stock <= 10 ? `Only ${product.stock} left` : 'In Stock'} tone={product.stock <= 10 ? 'warning' : 'success'} />
            ) : (
              <Badge label="Out of Stock" tone="danger" />
            )}
          </View>

          <RatingStars rating={product.rating} ratingCount={product.ratingCount} size={16} />
          <Text style={styles.price}>{formatPrice(product.price)}</Text>

          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {product.inStock && (
            <View style={styles.quantitySection}>
              <Text style={styles.sectionLabel}>Quantity</Text>
              <QuantityStepper quantity={quantity} onIncrement={() => setQuantity((q) => Math.min(q + 1, product.stock))} onDecrement={() => setQuantity((q) => Math.max(q - 1, 1))} max={product.stock} />
            </View>
          )}

          {confirmation && (
            <View style={styles.confirmationBanner}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.confirmationText}>Added to cart</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cartLink} onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' })}>
          <Ionicons name="cart-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.footerButton}>
          <PrimaryButton label={product.inStock ? 'Add to Cart' : 'Unavailable'} onPress={handleAddToCart} disabled={!product.inStock} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  image: { width: '100%', aspectRatio: 1, backgroundColor: colors.surface },
  body: { padding: spacing.lg, gap: spacing.xs },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm },
  name: { ...typography.h2, color: colors.text, flex: 1 },
  price: { ...typography.h1, color: colors.text, marginTop: spacing.sm },
  sectionLabel: { ...typography.bodyStrong, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.xs },
  description: { ...typography.body, color: colors.textMuted, lineHeight: 20 },
  quantitySection: { marginTop: spacing.sm },
  confirmationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    backgroundColor: colors.successLight,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  confirmationText: { color: colors.success, fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  cartLink: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButton: { flex: 1 },
});
