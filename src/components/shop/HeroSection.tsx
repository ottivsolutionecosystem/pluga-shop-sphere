
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/contexts/store';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
}

const HeroSection = (props: HeroSectionProps) => {
  const { t } = useTranslation();
  const { currentStore } = useStore();
  const [heroData, setHeroData] = useState<HeroSectionProps>({
    title: props.title || '',
    subtitle: props.subtitle || '',
    imageUrl: props.imageUrl || '/placeholder.svg',
    ctaText: props.ctaText || '',
    ctaLink: props.ctaLink || '/search'
  });

  // Helper function to extract text from JSON field
  const extractText = (field: Json | null): string => {
    if (!field) return '';
    
    // If field is an object with language keys
    if (typeof field === 'object' && field !== null && !Array.isArray(field)) {
      // Try to get English or Portuguese text, default to first available key
      return (field as Record<string, string>).en || 
             (field as Record<string, string>).pt || 
             Object.values(field)[0] || '';
    }
    
    // If it's a direct string
    if (typeof field === 'string') {
      return field;
    }
    
    return '';
  };
  
  useEffect(() => {
    const fetchHeroSection = async () => {
      if (!currentStore) return;
      
      try {
        // Fetch hero section data from store_sections table
        const { data, error } = await supabase
          .from('store_sections')
          .select('*')
          .eq('store_id', currentStore.id)
          .eq('section_type', 'hero')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          // Not found is okay, we'll use default values
          console.error('Error fetching hero section:', error);
          return;
        }

        if (data) {
          const title = extractText(data.title);
          const subtitle = extractText(data.subtitle);
          let imageUrl = '';
          let ctaText = '';
          let ctaLink = '';
          
          // Extract content values
          if (data.content && typeof data.content === 'object' && !Array.isArray(data.content)) {
            const content = data.content as Record<string, any>;
            imageUrl = content.imageUrl || heroData.imageUrl;
            ctaText = content.ctaText || heroData.ctaText;
            ctaLink = content.ctaLink || heroData.ctaLink;
          }
          
          setHeroData({
            title: title || heroData.title,
            subtitle: subtitle || heroData.subtitle,
            imageUrl: imageUrl || heroData.imageUrl,
            ctaText: ctaText || heroData.ctaText || t('store.viewMore'),
            ctaLink: ctaLink || heroData.ctaLink
          });
        }
      } catch (error) {
        console.error('Error in hero section:', error);
      }
    };

    fetchHeroSection();
  }, [currentStore, t]);
  
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="shop-container py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-shop-dark">
              {heroData.title || 'Discover Amazing Products'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {heroData.subtitle || 'Shop the latest trends with our curated collection of high-quality products.'}
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-shop-accent hover:bg-shop-accent/90" asChild>
                <a href={heroData.ctaLink}>
                  {heroData.ctaText || t('store.viewMore')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-96 animate-slide-in">
            <img 
              src={heroData.imageUrl} 
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
