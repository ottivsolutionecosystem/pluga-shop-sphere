
// Store-related types
export interface StoreTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface StoreInfo {
  id: string;
  name: string;
  domain: string;
  subdomain: string | null;
  logo: string;
  theme: StoreTheme;
}

// Cart-related types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  storeId: string;
}

// Store context type
export interface StoreContextType {
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
