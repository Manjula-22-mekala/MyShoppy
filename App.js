import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <View style={styles.windowBackdrop}>
      <View style={styles.phoneFrame}>
        <SafeAreaProvider>
          <CartProvider>
            <StatusBar style="dark" />
            <AppNavigator />
          </CartProvider>
        </SafeAreaProvider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  windowBackdrop: Platform.select({
    web: {
      flex: 1,
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#DCE1E5',
    },
    default: { flex: 1 },
  }),
  phoneFrame: Platform.select({
    web: {
      width: '100%',
      maxWidth: 430,
      height: '100vh',
      maxHeight: 932,
      overflow: 'hidden',
      boxShadow: '0 0 0 10px #111827, 0 20px 60px rgba(0,0,0,0.35)',
      borderRadius: 40,
    },
    default: { flex: 1 },
  }),
});
