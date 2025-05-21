
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard, { ProductType } from './ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCarouselProps {
  title: string;
  products: ProductType[];
  viewAllLink?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ 
  title, 
  products, 
  viewAllLink = '/search' 
}) => {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current: container } = scrollContainerRef;
      const scrollAmount = container.clientWidth * 0.75;
      
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">{title}</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="hidden md:flex"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="hidden md:flex"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button asChild variant="link">
            <a href={viewAllLink}>{t('store.viewMore')}</a>
          </Button>
        </div>
      </div>

      <div 
        className="flex gap-4 overflow-x-auto pb-4 snap-x" 
        ref={scrollContainerRef}
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        {products.map((product) => (
          <div 
            key={product.id} 
            className="min-w-[250px] max-w-[250px] snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}

        {products.length === 0 && (
          <div className="min-w-full flex items-center justify-center py-12 text-muted-foreground">
            No products available
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;
