import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  // Fetch stores from Supabase
  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('id, name, domain, subdomain, logo_url, theme_config, slug')
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      return data.map((store) => ({
        id: store.id,
        name: store.name,
        domain: store.domain,
        subdomain: store.subdomain,
        logo: store.logo_url || '/logo-demo.png',
        theme: {
          primaryColor: typeof store.theme_config === 'object' && store.theme_config ? 
            (store.theme_config.primaryColor as string) || '#0055a5' : '#0055a5',
          secondaryColor: typeof store.theme_config === 'object' && store.theme_config ? 
            (store.theme_config.secondaryColor as string) || '#0088cc' : '#0088cc',
          accentColor: typeof store.theme_config === 'object' && store.theme_config ? 
            (store.theme_config.accentColor as string) || '#00cc88' : '#00cc88'
        }
      }));
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to load store data');
      return [];
    }
  };

  // Determine current store based on hostname/subdomain
  useEffect(() => {
    const detectStore = async () => {
      try {
        setIsLoading(true);
        
        // Get all stores from database
        const stores = await fetchStores();
        
        if (stores.length === 0) {
          console.error('No stores found in the database');
          setIsLoading(false);
          return;
        }
        
        // Get the current hostname
        const hostname = window.location.hostname;
        console.log('Current hostname:', hostname);
        
        // Check if we're running locally
        const isLocalhost = hostname === 'localhost' || hostname.includes('lovableproject.com');
        
        let storeToUse: StoreInfo | null = null;
        
        if (isLocalhost) {
          // For local/preview environments, use the first store by default
          storeToUse = stores[0];
          
          // Check URL parameters for store simulation (e.g., ?store=tech)
          const urlParams = new URLSearchParams(window.location.search);
          const storeParam = urlParams.get('store');
          
          if (storeParam) {
            // Find store by subdomain parameter or slug
            const foundStore = stores.find(
              store => store.subdomain === storeParam || store.domain?.split('.')[0] === storeParam
            );
            
            if (foundStore) {
              storeToUse = foundStore;
            }
          }
        } else {
          // Production environment - check for actual domain/subdomain
          const domainParts = hostname.split('.');
          
          // Check for custom domain match first
          storeToUse = stores.find(store => store.domain === hostname);
          
          // If no direct domain match, check for subdomain
          if (!storeToUse && domainParts.length > 2) {
            const subdomain = domainParts[0];
            storeToUse = stores.find(store => store.subdomain === subdomain);
          }
        }
        
        // Apply theme variables if store is found
        if (storeToUse) {
          document.documentElement.style.setProperty('--shop-primary', storeToUse.theme.primaryColor);
          document.documentElement.style.setProperty('--shop-secondary', storeToUse.theme.secondaryColor);
          document.documentElement.style.setProperty('--shop-accent', storeToUse.theme.accentColor);
          
          console.log(`Store detected: ${storeToUse.name} (${storeToUse.id})`);
        } else {
          console.error('No store found for hostname:', hostname);
          // Fallback to first store
          storeToUse = stores[0];
          document.documentElement.style.setProperty('--shop-primary', storeToUse.theme.primaryColor);
          document.documentElement.style.setProperty('--shop-secondary', storeToUse.theme.secondaryColor);
          document.documentElement.style.setProperty('--shop-accent', storeToUse.theme.accentColor);
        }
        
        setCurrentStore(storeToUse);
      } catch (error) {
        console.error('Error detecting store:', error);
        toast.error('Failed to load store configuration');
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
