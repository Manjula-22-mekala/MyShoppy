# myShoppy

A mobile-first e-commerce app for household products (kitchen, cleaning, home décor, storage, and utility items), built with React Native + Expo.

## Setup

Requirements: Node.js 18+, npm, and either the **Expo Go** app on your phone or an Android/iOS simulator.

```bash
npm install
npm start
```

This opens the Expo developer tools. From there:
- Press `i` to open the iOS simulator (macOS only)
- Press `a` to open an Android emulator
- Press `w` to run in a browser
- Or scan the QR code with the Expo Go app on your phone

## Application Flow

```
Home (tab)  ──search/category──▶  Product List ──▶ Product Details ──▶ (add to cart)
Categories (tab) ──category──▶     Product List ──▶ Product Details ──▶ (add to cart)
Cart (tab) ──▶ Checkout ──▶ Order Confirmation ──▶ back to Home
```

- **Home**: hero header, search bar, horizontal category rail, and a "Popular Products" grid sorted by rating.
- **Categories**: full grid of all product categories.
- **Product List**: shared browse screen used by both Home and Categories. Supports text search, category/price/availability filters (via a bottom filter sheet), and shows result counts, empty states, and loading states.
- **Product Details**: full description, rating, stock badge, quantity selector (capped at available stock), and add-to-cart with an inline confirmation.
- **Cart**: editable quantities, remove items, live subtotal/delivery fee/total, and an empty-cart state. Cart persists across app restarts (AsyncStorage).
- **Checkout**: delivery form (name, phone, address, city, ZIP, optional notes) with inline validation, plus an order summary. Blocks checkout if the cart is empty.
- **Order Confirmation**: transaction ID, delivery summary, itemized order, and a "Continue Shopping" button that resets navigation back to Home.

## Key Features

- Product catalog of 25 household products across 5 categories, each with images, description, price, rating, review count, and stock status.
- Search by name, and filter by category, price range, and availability.
- Cart and checkout with quantity limits enforced by per-product stock.
- Input validation for the checkout form (name format, 10-digit phone, address length, required city, ZIP format) with per-field error messages.
- Loading, empty, error, and out-of-stock states throughout (product lists, product details, cart, checkout).
- Cart state persisted locally via AsyncStorage so it survives app reloads.

## Architecture

```
src/
  components/   Reusable UI: ProductCard, CategoryCard, CartItemRow, FilterSheet,
                SearchBar, RatingStars, QuantityStepper, FormField, PrimaryButton,
                Badge, EmptyState, LoadingIndicator
  context/      CartContext — cart state (add/update/remove/clear), totals, AsyncStorage persistence
  data/         products.json, categories.json (sample dataset) + api.js (mock async data layer)
  navigation/   Bottom tabs (Home/Categories/Cart) nested in a root stack
                (ProductList, ProductDetails, Checkout, OrderConfirmation)
  screens/      HomeScreen, CategoryScreen, ProductListScreen, ProductDetailsScreen,
                CartScreen, CheckoutScreen, OrderConfirmationScreen
  theme/        Shared colors, spacing, and typography
  utils/        formatters.js (price/order ID), validators.js (checkout form rules)
```

`src/data/api.js` simulates a backend with `setTimeout`-based delayed promises over the local JSON dataset, so the app can be pointed at a real API or Firebase later just by swapping this one file.

## Assumptions

- No user authentication — this is a single-session shopping experience per the assignment scope (the data layer is structured so auth, order history, and a real backend can be added later without touching the UI).
- No real payment gateway; checkout collects delivery details and simulates order placement.
- Product images are royalty-free Unsplash photos chosen to match each product, swappable for real product photos.
- Prices are in Indian Rupees (₹). Delivery fee is a flat ₹49, waived on subtotals of ₹999 or more.
