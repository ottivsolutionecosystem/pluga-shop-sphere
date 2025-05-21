
import React, { createContext, useContext, useState, useEffect } from 'react';

// Store info type
interface StoreInfo {
  id: string;
  name: string;
  domain: string;
  subdomain: string | null;
  logo: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

// Cart item type
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  storeId: string;
}

// Store context type
interface StoreContextType {
  currentStore: StoreInfo | null;
  isLoading: boolean;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  cartTotal: number;
  cartItemCount: number;
  clearCart: () => void;
}

// Mock store data
const mockStores = [
  {
    id: '1',
    name: 'Loja Demo',
    domain: 'lojademo.com',
    subdomain: 'lojademo',
    logo: '/logo-demo.png',
    theme: {
      primaryColor: '#0055a5',
      secondaryColor: '#0088cc',
      accentColor: '#00cc88'
    }
  }
];

// Create the context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Store provider component
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStore, setCurrentStore] = useState<StoreInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('plugashop_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('plugashop_cart', JSON.stringify(cart));
  }, [cart]);

  // Determine current store based on hostname/subdomain
  useEffect(() => {
    const detectStore = async () => {
      try {
        // For development purposes, we'll use a mock store
        // In production, this would check the hostname and look up the store
        setCurrentStore(mockStores[0]);
      } catch (error) {
        console.error('Error detecting store:', error);
      } finally {
        setIsLoading(false);
      }
    };

    detectStore();
  }, []);

  // Cart methods
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.id === item.id);
      
      if (existingItem) {
        return prevCart.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate cart totals
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
