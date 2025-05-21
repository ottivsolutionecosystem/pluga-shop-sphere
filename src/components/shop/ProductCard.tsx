
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export interface ProductType {
  id: string;
  name: string;
  price: number;
  image: string;
  storeId: string;
  description?: string;
  category?: string;
  inStock?: boolean;
}

interface ProductCardProps {
  product: ProductType;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product);
    
    toast.success('Product added to cart');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <a 
      href={`/product/${product.id}`} 
      className="group rounded-lg border overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 group-hover:text-shop-primary transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-lg font-semibold text-shop-primary">
            {formatPrice(product.price)}
          </p>
          <Button 
            size="sm" 
            variant="ghost" 
            className="rounded-full h-8 w-8 p-0 bg-shop-accent/10 hover:bg-shop-accent/20" 
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 text-shop-accent" />
            <span className="sr-only">{t('store.addToCart')}</span>
          </Button>
        </div>
      </div>
    </a>
  );
};

export default ProductCard;
