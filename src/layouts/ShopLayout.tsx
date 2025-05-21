
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Search, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';

const ShopLayout = () => {
  const { t } = useTranslation();
  const { currentStore, cartItemCount } = useStore();
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b shadow-sm">
        <div className="shop-container py-4">
          <div className="flex items-center justify-between">
            {/* Mobile menu trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col gap-4 mt-8">
                  <a href="/" className="text-lg font-medium">
                    {t('nav.home')}
                  </a>
                  <a href="/search" className="text-lg font-medium">
                    {t('nav.search')}
                  </a>
                  <a href="/categories" className="text-lg font-medium">
                    {t('nav.categories')}
                  </a>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="flex-1 md:flex-initial">
              <a href="/" className="flex items-center">
                <span className="text-xl font-bold text-shop-primary">
                  {currentStore?.name || 'PlugaShop'}
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/" className="font-medium hover:text-shop-primary transition-colors">
                {t('nav.home')}
              </a>
              <a href="/search" className="font-medium hover:text-shop-primary transition-colors">
                {t('nav.search')}
              </a>
              <a href="/categories" className="font-medium hover:text-shop-primary transition-colors">
                {t('nav.categories')}
              </a>
            </nav>

            {/* Search, Cart & User */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="/search">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">{t('nav.search')}</span>
                </a>
              </Button>

              <Button variant="ghost" size="icon" className="relative" asChild>
                <a href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-shop-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                  <span className="sr-only">{t('nav.cart')}</span>
                </a>
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">{t('nav.account')}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="py-4">
                    <h3 className="font-semibold text-lg mb-4">{t('nav.account')}</h3>
                    {user ? (
                      <div className="space-y-4">
                        <p>{user.name}</p>
                        <Button 
                          asChild 
                          variant="outline" 
                          className="w-full"
                        >
                          <a href="/me">{t('nav.account')}</a>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => logout()}
                        >
                          {t('auth.logout')}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button asChild variant="default" className="w-full">
                          <a href="/login">{t('auth.login')}</a>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                          <a href="/signup">{t('auth.signup')}</a>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-slate-50 border-t mt-auto">
        <div className="shop-container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3">
                {currentStore?.name || 'PlugaShop'}
              </h3>
              <p className="text-muted-foreground">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Links</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-muted-foreground hover:text-foreground">About</a></li>
                <li><a href="/contact" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                <li><a href="/terms" className="text-muted-foreground hover:text-foreground">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Help</h4>
              <ul className="space-y-2">
                <li><a href="/faq" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
                <li><a href="/shipping" className="text-muted-foreground hover:text-foreground">Shipping</a></li>
                <li><a href="/returns" className="text-muted-foreground hover:text-foreground">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Social</h4>
              <div className="flex space-x-3">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Instagram</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Twitter</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Facebook</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShopLayout;
