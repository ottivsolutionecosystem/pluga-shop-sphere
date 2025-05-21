
import React, { useEffect, useState } from 'react';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useStore } from '@/contexts/store';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories?: {
    id: string;
    name: string;
    slug: string;
  }[];
}

interface CategoryMenuProps {
  categories?: Category[];
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ categories: propCategories }) => {
  const { currentStore } = useStore();
  const [categories, setCategories] = useState<Category[]>(propCategories || []);
  const [loading, setLoading] = useState<boolean>(false);

  // Helper function to extract name from JSON field
  const extractName = (nameField: Json | null): string => {
    if (!nameField) return '';
    
    // If nameField is an object with language keys
    if (typeof nameField === 'object' && nameField !== null && !Array.isArray(nameField)) {
      // Try to get English or Portuguese name, default to first available key
      return (nameField as Record<string, string>).en || 
             (nameField as Record<string, string>).pt || 
             Object.values(nameField)[0] || '';
    }
    
    // If it's a direct string
    if (typeof nameField === 'string') {
      return nameField;
    }
    
    return '';
  };

  useEffect(() => {
    const fetchCategories = async () => {
      if (!currentStore || propCategories) return;
      
      setLoading(true);
      try {
        // Fetch parent categories
        const { data: parentCategories, error: parentError } = await supabase
          .from('categories')
          .select('id, name, slug, parent_id')
          .eq('store_id', currentStore.id)
          .eq('is_active', true)
          .is('parent_id', null)
          .order('sort_order', { ascending: true });

        if (parentError) throw parentError;

        // Fetch all subcategories in a single query
        const { data: subcategories, error: subError } = await supabase
          .from('categories')
          .select('id, name, slug, parent_id')
          .eq('store_id', currentStore.id)
          .eq('is_active', true)
          .not('parent_id', 'is', null)
          .order('sort_order', { ascending: true });

        if (subError) throw subError;

        // Group subcategories by parent_id
        const subcategoryMap = subcategories.reduce((acc, sub) => {
          if (!acc[sub.parent_id]) acc[sub.parent_id] = [];
          acc[sub.parent_id].push({
            id: sub.id,
            name: extractName(sub.name),
            slug: sub.slug
          });
          return acc;
        }, {});

        // Build category tree
        const formattedCategories = parentCategories.map(parent => ({
          id: parent.id,
          name: extractName(parent.name),
          slug: parent.slug,
          subcategories: subcategoryMap[parent.id] || []
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentStore, propCategories]);

  if (loading || categories.length === 0) {
    // Return empty navigation menu while loading or if no categories
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink 
              className={navigationMenuTriggerStyle()}
              href="/search"
            >
              All Products
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {categories.map((category) => (
          <NavigationMenuItem key={category.id}>
            {category.subcategories && category.subcategories.length > 0 ? (
              <>
                <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {category.subcategories.map((subcategory) => (
                      <ListItem
                        key={subcategory.id}
                        title={subcategory.name}
                        href={`/search?category=${subcategory.slug}`}
                      />
                    ))}
                    <ListItem
                      title={`All ${category.name}`}
                      href={`/search?category=${category.slug}`}
                      className="md:col-span-2"
                    />
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink 
                className={navigationMenuTriggerStyle()}
                href={`/search?category=${category.slug}`}
              >
                {category.name}
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <NavigationMenuLink 
            className={navigationMenuTriggerStyle()}
            href="/search"
          >
            All Categories
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default CategoryMenu;
