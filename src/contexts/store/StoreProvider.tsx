
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { StoreContextType, StoreInfo } from './types';
import { useCart } from './useCart';
import { detectStore, applyStoreTheme } from './storeUtils';

// Create the context
export const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Store provider component
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStore, setCurrentStore] = useState<StoreInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartItemCount
  } = useCart();

  // Determine current store based on hostname/subdomain
  useEffect(() => {
    const loadStore = async () => {
      try {
        setIsLoading(true);
        
        const storeToUse = await detectStore();
        
        // Apply theme variables if store is found
        applyStoreTheme(storeToUse);
        
        setCurrentStore(storeToUse);
      } catch (error) {
        console.error('Error detecting store:', error);
        toast.error('Failed to load store configuration');
      } finally {
        setIsLoading(false);
      }
    };

    loadStore();
  }, []);

  const value = {
    currentStore,
    isLoading,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartItemCount,
    clearCart
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
