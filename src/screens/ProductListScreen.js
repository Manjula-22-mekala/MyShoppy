import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchCategories, fetchProducts } from '../data/api';
import { colors } from '../theme/colors';
import { spacing, typography } from '../theme/spacing';
import { useCart } from '../context/CartContext';
import SearchBar from '../components/SearchBar';
import FilterSheet, { PRICE_RANGES } from '../components/FilterSheet';
import ProductCard from '../components/ProductCard';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';

export default function ProductListScreen({ route, navigation }) {
  const { addToCart } = useCart();
  const initialCategoryId = route.params?.categoryId ?? null;
  const initialSearchQuery = route.params?.searchQuery ?? '';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const categoryMeta = categories.find((category) => category.id === selectedCategory);

  useEffect(() => {
    navigation.setOptions({ title: categoryMeta ? categoryMeta.name : 'All Products' });
  }, [categoryMeta, navigation]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const priceRange = PRICE_RANGES.find((range) => range.id === selectedPriceRange);
      const result = await fetchProducts({
        categoryId: selectedCategory,
        search: searchQuery,
        priceRange: priceRange?.id === 'all' ? null : priceRange,
        inStockOnly,
      });
      setProducts(result);
    } catch (e) {
      setError('Unable to load products right now.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, selectedPriceRange, inStockOnly]);

  useEffect(() => {
    const timeout = setTimeout(loadProducts, 200);
    return () => clearTimeout(timeout);
  }, [loadProducts]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count += 1;
    if (selectedPriceRange !== 'all') count += 1;
    if (inStockOnly) count += 1;
    return count;
  }, [selectedCategory, selectedPriceRange, inStockOnly]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedPriceRange('all');
    setInStockOnly(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.searchWrapper}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => setFilterVisible(true)}
          filterActive={activeFilterCount > 0}
          onSubmit={() => {
            Keyboard.dismiss();
            loadProducts();
          }}
          placeholder="Search household products..."
        />
      </View>

      {loading ? (
        <LoadingIndicator label="Finding products..." />
      ) : error ? (
        <EmptyState icon="cloud-offline-outline" title="Something went wrong" subtitle={error} actionLabel="Retry" onAction={loadProducts} />
      ) : products.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No products found"
          subtitle="Try a different search term or adjust your filters."
          actionLabel={activeFilterCount > 0 ? 'Clear Filters' : undefined}
          onAction={activeFilterCount > 0 ? resetFilters : undefined}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={<Text style={styles.resultCount}>{products.length} product{products.length === 1 ? '' : 's'} found</Text>}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ProductCard
                product={item}
                onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
                onAddToCart={addToCart}
              />
            </View>
          )}
        />
      )}

      <FilterSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedPriceRange={selectedPriceRange}
        onSelectPriceRange={setSelectedPriceRange}
        inStockOnly={inStockOnly}
        onToggleInStockOnly={setInStockOnly}
        onReset={resetFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  searchWrapper: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  resultCount: { ...typography.caption, color: colors.textMuted, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  listContent: { paddingBottom: spacing.xxl },
  columnWrapper: { paddingHorizontal: spacing.lg, gap: spacing.md },
  cardWrapper: { flex: 1, marginBottom: spacing.md },
});
