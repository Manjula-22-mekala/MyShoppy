import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, typography } from '../theme/spacing';

export default function EmptyState({ icon = 'cube-outline', title, subtitle, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={colors.disabled} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.action} onPress={onAction}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: 6 },
  title: { ...typography.h3, color: colors.text, marginTop: spacing.sm, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  action: { marginTop: spacing.md, paddingVertical: 10, paddingHorizontal: spacing.lg, backgroundColor: colors.primary, borderRadius: 10 },
  actionText: { color: colors.textInverse, fontWeight: '700' },
});
