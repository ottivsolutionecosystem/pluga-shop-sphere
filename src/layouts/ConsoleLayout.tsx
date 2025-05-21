
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import { 
  Home, 
  Store, 
  Users, 
  Settings, 
  LogOut,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const ConsoleLayout = () => {
  const { t } = useTranslation();
  const { user, hasRole, logout } = useAuth();

  // Check if user has console role
  if (!hasRole('console')) {
    return <Navigate to="/login" replace />;
  }

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/console' },
    { icon: Store, label: 'Stores', href: '/console/stores' },
    { icon: Users, label: 'Admins', href: '/console/admins' },
    { icon: Settings, label: 'Settings', href: '/console/settings' }
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r shadow-sm">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-shop-primary">Console</h1>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a 
                  href={item.href} 
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-medium">{user?.name}</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
            </div>
            <LanguageSwitcher />
          </div>
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
            <span>{t('auth.logout')}</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                      <h2 className="text-xl font-bold text-shop-primary">Console</h2>
                    </div>
                    <nav className="flex-1 p-4">
                      <ul className="space-y-3">
                        {navigationItems.map((item) => (
                          <li key={item.href}>
                            <a 
                              href={item.href} 
                              className="flex items-center gap-3 py-2"
                            >
                              <item.icon className="h-5 w-5" />
                              <span>{item.label}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              <h1 className="text-xl font-semibold md:hidden">Console</h1>
            </div>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <div className="hidden md:block">
                <span className="font-medium">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ConsoleLayout;
