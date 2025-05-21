
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StoreInfo } from './types';

// Fetch stores from Supabase
export const fetchStores = async (): Promise<StoreInfo[]> => {
  try {
    const { data, error } = await supabase
      .from('stores')
      .select('id, name, domain, subdomain, logo_url, theme_config, slug')
      .eq('is_active', true);

    if (error) {
      throw error;
    }

    return data.map((store) => {
      // Safely extract theme values from theme_config
      let primaryColor = '#0055a5';
      let secondaryColor = '#0088cc';
      let accentColor = '#00cc88';

      if (store.theme_config && typeof store.theme_config === 'object') {
        // Extract theme colors with fallbacks
        primaryColor = (store.theme_config as any)?.primaryColor || primaryColor;
        secondaryColor = (store.theme_config as any)?.secondaryColor || secondaryColor;
        accentColor = (store.theme_config as any)?.accentColor || accentColor;
      }

      return {
        id: store.id,
        name: store.name,
        domain: store.domain,
        subdomain: store.subdomain,
        logo: store.logo_url || '/logo-demo.png',
        theme: {
          primaryColor,
          secondaryColor,
          accentColor
        }
      };
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    toast.error('Failed to load store data');
    return [];
  }
};

export const detectStore = async (): Promise<StoreInfo | null> => {
  // Get all stores from database
  const stores = await fetchStores();
  
  if (stores.length === 0) {
    console.error('No stores found in the database');
    return null;
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
    
    // Check if this is a subdomain (e.g., fashion.plugashop.com)
    if (domainParts.length > 2) {
      const subdomain = domainParts[0];
      storeToUse = stores.find(store => store.subdomain === subdomain);
      console.log(`Looking for subdomain: ${subdomain}`, storeToUse);
    }
    
    // If no subdomain match, check for custom domain match
    if (!storeToUse) {
      storeToUse = stores.find(store => store.domain === hostname);
      console.log(`Looking for domain: ${hostname}`, storeToUse);
    }
  }

  // If no store found, fallback to first store
  if (!storeToUse && stores.length > 0) {
    console.error('No store found for hostname:', hostname);
    storeToUse = stores[0];
  }

  return storeToUse;
};

export const applyStoreTheme = (store: StoreInfo | null) => {
  if (store) {
    document.documentElement.style.setProperty('--shop-primary', store.theme.primaryColor);
    document.documentElement.style.setProperty('--shop-secondary', store.theme.secondaryColor);
    document.documentElement.style.setProperty('--shop-accent', store.theme.accentColor);
    console.log(`Store detected: ${store.name} (${store.id})`);
  }
};
