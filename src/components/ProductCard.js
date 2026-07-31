import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { radius, spacing, typography } from '../theme/spacing';
import { formatPrice } from '../utils/formatters';
import RatingStars from './RatingStars';
import Badge from './Badge';

export default function ProductCard({ product, onPress, onAddToCart }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        {!product.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Badge label="Out of stock" tone="danger" />
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <RatingStars rating={product.rating} ratingCount={product.ratingCount} />
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <TouchableOpacity
          style={[styles.addButton, !product.inStock && styles.addButtonDisabled]}
          onPress={() => onAddToCart(product)}
          disabled={!product.inStock}
        >
          <Text style={[styles.addButtonText, !product.inStock && styles.addButtonTextDisabled]}>
            {product.inStock ? 'Add to Cart' : 'Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageWrapper: { width: '100%', aspectRatio: 1, backgroundColor: colors.background },
  image: { width: '100%', height: '100%' },
  outOfStockOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  body: { padding: spacing.md, gap: 4 },
  name: { ...typography.bodyStrong, color: colors.text, minHeight: 34 },
  price: { ...typography.h3, color: colors.text, marginTop: 2 },
  addButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addButtonDisabled: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  addButtonText: { color: colors.textInverse, fontSize: 13, fontWeight: '700' },
  addButtonTextDisabled: { color: colors.textMuted },
});
