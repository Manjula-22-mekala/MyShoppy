import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchCategories, fetchFeaturedProducts } from '../data/api';
import { colors } from '../theme/colors';
import { spacing, typography } from '../theme/spacing';
import { useCart } from '../context/CartContext';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';

export default function HomeScreen({ navigation }) {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [categoryList, products] = await Promise.all([fetchCategories(), fetchFeaturedProducts(6)]);
      setCategories(categoryList);
      setFeaturedProducts(products);
    } catch (e) {
      setError('Something went wrong while loading the store. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const submitSearch = () => {
    navigation.navigate('ProductList', { searchQuery });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LoadingIndicator label="Loading myShoppy..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <EmptyState icon="cloud-offline-outline" title="Unable to load store" subtitle={error} actionLabel="Retry" onAction={loadData} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={featuredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />}
        ListHeaderComponent={
          <View>
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>myShoppy</Text>
              <Text style={styles.heroSubtitle}>Everything for your home, delivered simply.</Text>
            </View>

            <View style={styles.searchWrapper}>
              <SearchBar value={searchQuery} onChangeText={setSearchQuery} onFilterPress={submitSearch} placeholder="Search household products..." />
            </View>

            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
              renderItem={({ item }) => (
                <View style={styles.categoryCardWrapper}>
                  <CategoryCard category={item} onPress={() => navigation.navigate('ProductList', { categoryId: item.id })} />
                </View>
              )}
            />

            <Text style={styles.sectionTitle}>Popular Products</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.productCardWrapper}>
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
              onAddToCart={addToCart}
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  listContent: { paddingBottom: spacing.xxl },
  hero: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  heroTitle: { ...typography.h1, color: colors.primaryDark },
  heroSubtitle: { ...typography.body, color: colors.textMuted, marginTop: 2, marginBottom: spacing.md },
  searchWrapper: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionTitle: { ...typography.h2, color: colors.text, paddingHorizontal: spacing.lg, marginBottom: spacing.sm, marginTop: spacing.sm },
  categoryList: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  categoryCardWrapper: { width: 130, marginRight: spacing.sm },
  columnWrapper: { paddingHorizontal: spacing.lg, gap: spacing.md },
  productCardWrapper: { flex: 1, marginBottom: spacing.md },
});
