import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function RatingStars({ rating, ratingCount, size = 14 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.row}>
      {stars.map((position) => {
        const filled = rating >= position;
        const half = !filled && rating >= position - 0.5;
        const iconName = filled ? 'star' : half ? 'star-half' : 'star-outline';
        return <Ionicons key={position} name={iconName} size={size} color={colors.star} />;
      })}
      {typeof ratingCount === 'number' && (
        <Text style={styles.count}>({ratingCount})</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  count: { marginLeft: 4, fontSize: 12, color: colors.textMuted },
});
