
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { StoreProvider } from "@/contexts/StoreContext";

// Layouts
import ShopLayout from "./layouts/ShopLayout";
import AdminLayout from "./layouts/AdminLayout";
import ConsoleLayout from "./layouts/ConsoleLayout";
import UserLayout from "./layouts/UserLayout";

// Pages
import ShopHome from "./pages/shop/ShopHome";
import Login from "./pages/auth/Login";
import ConsoleDashboard from "./pages/console/ConsoleDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import NotFound from "./pages/NotFound";

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
              <Route path="/signup" element={<Login />} /> {/* Reusing Login for now */}
              
              {/* Console Routes */}
              <Route path="/console" element={<ConsoleLayout />}>
                <Route index element={<ConsoleDashboard />} />
                {/* Add more console routes here */}
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                {/* Add more admin routes here */}
              </Route>
              
              {/* User Account Routes */}
              <Route path="/me" element={<UserLayout />}>
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
