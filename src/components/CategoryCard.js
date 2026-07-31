import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { radius, spacing, typography } from '../theme/spacing';

export default function CategoryCard({ category, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.iconWrapper, { backgroundColor: `${category.color}22` }]}>
        <Ionicons name={category.icon} size={26} color={category.color} />
      </View>
      <Text style={styles.name}>{category.name}</Text>
      <Text style={styles.description} numberOfLines={1}>{category.description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'flex-start',
    gap: 4,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  name: { ...typography.h3, color: colors.text },
  description: { ...typography.caption, color: colors.textMuted },
});
