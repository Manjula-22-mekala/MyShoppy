import productsData from './products.json';
import categoriesData from './categories.json';

const SIMULATED_DELAY = 450;

function delay(value, ms = SIMULATED_DELAY) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function fetchCategories() {
  return delay(categoriesData);
}

export function fetchProducts({ categoryId, search, priceRange, inStockOnly } = {}) {
  let results = [...productsData];

  if (categoryId) {
    results = results.filter((product) => product.category === categoryId);
  }

  if (search && search.trim()) {
    const query = search.trim().toLowerCase();
    results = results.filter((product) => product.name.toLowerCase().includes(query));
  }

  if (priceRange && priceRange.min !== undefined) {
    results = results.filter((product) => product.price >= priceRange.min && product.price <= priceRange.max);
  }

  if (inStockOnly) {
    results = results.filter((product) => product.inStock);
  }

  return delay(results);
}

export function fetchProductById(productId) {
  const product = productsData.find((item) => item.id === productId) || null;
  return delay(product);
}

export function fetchFeaturedProducts(limit = 6) {
  const sorted = [...productsData].sort((a, b) => b.rating - a.rating);
  return delay(sorted.slice(0, limit));
}
