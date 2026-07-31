import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext(null);
const STORAGE_KEY = '@myshoppy/cart';

const initialState = {
  items: [], // { productId, name, price, image, quantity, stock }
  hydrated: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload || [], hydrated: true };

    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existing = state.items.find((item) => item.productId === product.id);
      const maxQty = product.stock;

      if (existing) {
        const nextQuantity = Math.min(existing.quantity + quantity, maxQty);
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === product.id ? { ...item, quantity: nextQuantity } : item
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            stock: product.stock,
            quantity: Math.min(quantity, maxQty),
          },
        ],
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, items: state.items.filter((item) => item.productId !== productId) };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(quantity, item.stock) }
            : item
        ),
      };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.productId !== action.payload.productId) };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!isMounted) return;
        const parsed = raw ? JSON.parse(raw) : [];
        dispatch({ type: 'HYDRATE', payload: parsed });
      })
      .catch(() => {
        dispatch({ type: 'HYDRATE', payload: [] });
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)).catch(() => {});
  }, [state.items, state.hydrated]);

  const addToCart = (product, quantity = 1) => dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  const updateQuantity = (productId, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  const removeFromCart = (productId) => dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totals = useMemo(() => {
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const deliveryFee = subtotal > 0 && subtotal < 999 ? 49 : 0;
    const total = subtotal + deliveryFee;
    return { itemCount, subtotal, deliveryFee, total };
  }, [state.items]);

  const value = {
    items: state.items,
    hydrated: state.hydrated,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    ...totals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
