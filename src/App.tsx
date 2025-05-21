
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import { StoreProvider } from "@/contexts/StoreContext";

// Layouts
import ShopLayout from "./layouts/ShopLayout";
import AdminLayout from "./layouts/AdminLayout";
import ConsoleLayout from "./layouts/ConsoleLayout";
import UserLayout from "./layouts/UserLayout";

// Pages
import ShopHome from "./pages/shop/ShopHome";
import Login from "./pages/auth/Login";
import Auth from "./pages/auth/Auth";
import ConsoleDashboard from "./pages/console/ConsoleDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import NotFound from "./pages/NotFound";

// Auth Guards
import PrivateRoute from "./components/auth/PrivateRoute";
import RoleGuard from "./components/auth/RoleGuard";

// i18n configuration
import "./i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <StoreProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Store Front Routes */}
              <Route path="/" element={<ShopLayout />}>
                <Route index element={<ShopHome />} />
                {/* Add more store routes here */}
              </Route>
              
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Console Routes - Restricted to console role */}
              <Route 
                path="/console" 
                element={
                  <RoleGuard requiredRoles={['console']} redirectTo="/login?returnTo=/console">
                    <ConsoleLayout />
                  </RoleGuard>
                }
              >
                <Route index element={<ConsoleDashboard />} />
                {/* Add more console routes here */}
              </Route>
              
              {/* Admin Routes - Restricted to admin or support roles */}
              <Route 
                path="/admin" 
                element={
                  <RoleGuard requiredRoles={['admin', 'support']} redirectTo="/login?returnTo=/admin">
                    <AdminLayout />
                  </RoleGuard>
                }
              >
                <Route index element={<AdminDashboard />} />
                {/* Add more admin routes here */}
              </Route>
              
              {/* User Account Routes - Restricted to user role */}
              <Route 
                path="/me" 
                element={
                  <RoleGuard requiredRoles={['user']} redirectTo="/login?returnTo=/me">
                    <UserLayout />
                  </RoleGuard>
                }
              >
                <Route index element={<UserDashboard />} />
                {/* Add more user routes here */}
              </Route>
              
              {/* Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </StoreProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
