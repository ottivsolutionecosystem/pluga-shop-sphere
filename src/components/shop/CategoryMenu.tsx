
import React from 'react';
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
  categories: Category[];
}

// Mock categories for development
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    subcategories: [
      { id: '101', name: 'Smartphones', slug: 'smartphones' },
      { id: '102', name: 'Laptops', slug: 'laptops' },
      { id: '103', name: 'Tablets', slug: 'tablets' },
      { id: '104', name: 'Accessories', slug: 'electronics-accessories' }
    ]
  },
  {
    id: '2',
    name: 'Clothing',
    slug: 'clothing',
    subcategories: [
      { id: '201', name: 'Men', slug: 'men-clothing' },
      { id: '202', name: 'Women', slug: 'women-clothing' },
      { id: '203', name: 'Kids', slug: 'kids-clothing' }
    ]
  },
  {
    id: '3',
    name: 'Home & Garden',
    slug: 'home-garden',
    subcategories: [
      { id: '301', name: 'Furniture', slug: 'furniture' },
      { id: '302', name: 'Decor', slug: 'home-decor' },
      { id: '303', name: 'Kitchen', slug: 'kitchen' },
      { id: '304', name: 'Garden', slug: 'garden' }
    ]
  }
];

const CategoryMenu: React.FC<CategoryMenuProps> = ({ categories = mockCategories }) => {
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
