
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
}

const HeroSection = ({ 
  title, 
  subtitle, 
  imageUrl = '/placeholder.svg', 
  ctaText, 
  ctaLink = '/search' 
}: HeroSectionProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="shop-container py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-shop-dark">
              {title || 'Discover Amazing Products'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {subtitle || 'Shop the latest trends with our curated collection of high-quality products.'}
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-shop-accent hover:bg-shop-accent/90" asChild>
                <a href={ctaLink}>
                  {ctaText || t('store.viewMore')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-96 animate-slide-in">
            <img 
              src={imageUrl} 
              alt="Hero" 
              className="rounded-lg object-cover w-full h-full shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
