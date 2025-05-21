
import React from 'react';
import { useTranslation } from 'react-i18next';
import HeroSection from '@/components/shop/HeroSection';
import ProductCarousel from '@/components/shop/ProductCarousel';
import CategoryMenu from '@/components/shop/CategoryMenu';
import SearchBar from '@/components/shop/SearchBar';
import { ProductType } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/button';

// Mock products for development
const mockProducts: ProductType[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `product-${i + 1}`,
  name: `Product ${i + 1}`,
  price: 99.99 + i * 10,
  image: '/placeholder.svg',
  storeId: '1',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  category: i % 2 === 0 ? 'electronics' : 'clothing',
  inStock: true
}));

const ShopHome = () => {
  const { t } = useTranslation();

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
          products={mockProducts.slice(0, 8)}
          viewAllLink="/search?featured=true"
        />
        
        {/* Best sellers carousel */}
        <ProductCarousel 
          title={t('store.bestSellers')}
          products={mockProducts.slice(0, 6).reverse()}
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
            {mockProducts.slice(0, 5).map((product) => (
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
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHome;
