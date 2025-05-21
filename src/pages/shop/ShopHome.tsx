
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HeroSection from '@/components/shop/HeroSection';
import ProductCarousel from '@/components/shop/ProductCarousel';
import CategoryMenu from '@/components/shop/CategoryMenu';
import SearchBar from '@/components/shop/SearchBar';
import { ProductType } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/store';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ShopHome = () => {
  const { t } = useTranslation();
  const { currentStore } = useStore();
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductType[]>([]);
  const [bestSellers, setBestSellers] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentStore) return;

      setLoading(true);
      try {
        // Featured products
        const { data: featuredData, error: featuredError } = await supabase
          .from('products')
          .select('id, name, price, store_id, slug, description')
          .eq('store_id', currentStore.id)
          .eq('is_active', true)
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (featuredError) throw featuredError;

        // New arrivals
        const { data: newArrivalsData, error: newArrivalsError } = await supabase
          .from('products')
          .select('id, name, price, store_id, slug, description')
          .eq('store_id', currentStore.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(5);

        if (newArrivalsError) throw newArrivalsError;

        // Best sellers - this would normally be based on sales data
        // For now, we'll use a random selection of products
        const { data: bestSellersData, error: bestSellersError } = await supabase
          .from('products')
          .select('id, name, price, store_id, slug, description')
          .eq('store_id', currentStore.id)
          .eq('is_active', true)
          .limit(6);

        if (bestSellersError) throw bestSellersError;

        // Get product images
        const productIds = [
          ...featuredData.map(p => p.id), 
          ...newArrivalsData.map(p => p.id),
          ...bestSellersData.map(p => p.id)
        ];

        const { data: imagesData, error: imagesError } = await supabase
          .from('product_images')
          .select('product_id, url')
          .in('product_id', productIds)
          .order('sort_order', { ascending: true });

        if (imagesError) throw imagesError;

        // Create a map of product_id to first image
        const productImages = new Map();
        imagesData.forEach(img => {
          if (!productImages.has(img.product_id)) {
            productImages.set(img.product_id, img.url);
          }
        });

        // Process product data with images
        const processProducts = (products) => {
          return products.map(product => ({
            id: product.id,
            name: typeof product.name === 'object' ? product.name.en || product.name.pt : product.name,
            price: product.price,
            storeId: product.store_id,
            description: typeof product.description === 'object' ? product.description.en || product.description.pt : product.description,
            image: productImages.get(product.id) || '/placeholder.svg'
          }));
        };

        setFeaturedProducts(processProducts(featuredData));
        setNewArrivals(processProducts(newArrivalsData));
        setBestSellers(processProducts(bestSellersData));
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentStore]);

  return (
    <div>
      <HeroSection />
      
      <div className="shop-container py-8">
        {/* Category navigation */}
        <div className="hidden md:flex justify-center my-8">
          <CategoryMenu categories={[]} />
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden mb-6">
          <SearchBar />
        </div>
        
        {/* Featured products carousel */}
        <ProductCarousel 
          title={t('store.featuredProducts')}
          products={featuredProducts}
          viewAllLink="/search?featured=true"
        />
        
        {/* Best sellers carousel */}
        <ProductCarousel 
          title={t('store.bestSellers')}
          products={bestSellers}
          viewAllLink="/search?bestseller=true"
        />
        
        {/* New arrivals */}
        <div className="py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">{t('store.newArrivals')}</h2>
            <Button asChild variant="link">
              <a href="/search?sort=newest">{t('store.viewMore')}</a>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {newArrivals.map((product) => (
              <div key={product.id} className="animate-fade-in">
                <a 
                  href={`/product/${product.id}`} 
                  className="group block rounded-lg overflow-hidden bg-white border hover:shadow-md transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 group-hover:text-shop-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-shop-primary font-semibold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(product.price)}
                    </p>
                  </div>
                </a>
              </div>
            ))}

            {loading && Array(5).fill(0).map((_, i) => (
              <div key={`skeleton-${i}`} className="rounded-lg overflow-hidden bg-white border">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-3">
                  <div className="h-5 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                  <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>
            ))}

            {!loading && newArrivals.length === 0 && (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                {t('store.noProductsFound')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHome;
