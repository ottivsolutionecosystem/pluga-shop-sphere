import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { toast } from 'sonner';
import { cleanupAuthState } from '@/utils/auth';

const Login = () => {
  const { t } = useTranslation();
  const { user, login, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Parse the returnTo query param to redirect after login
  const urlParams = new URLSearchParams(location.search);
  const returnTo = urlParams.get('returnTo') || '';

  // Redirect if already authenticated based on role
  useEffect(() => {
    if (user) {
      if (returnTo) {
        navigate(returnTo);
      } else {
        redirectUserBasedOnRole();
      }
    }
  }, [user]);

  const redirectUserBasedOnRole = () => {
    if (hasRole('console')) {
      navigate('/console');
    } else if (hasRole('admin') || hasRole('support')) {
      navigate('/admin');
    } else if (hasRole('user')) {
      navigate('/me');
    } else {
      // Fallback to homepage if no specific role is found
      navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Clean up any existing auth state to avoid conflicts
      cleanupAuthState();
      
      await login(email, password);
      toast.success('Logged in successfully');

      // Redirection will be handled by the useEffect
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-shop-primary">PlugaShop</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{t('auth.login')}</CardTitle>
              <CardDescription>
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              {/* Mock login buttons */}
              <div className="space-y-2 pt-2">
                <p className="text-sm text-center text-muted-foreground mb-2">Test accounts (for development)</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEmail('console@plugashop.com');
                      setPassword('password');
                    }}
                  >
                    Console
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEmail('admin@loja.com');
                      setPassword('password');
                    }}
                  >
                    Admin
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEmail('user@example.com');
                      setPassword('password');
                    }}
                  >
                    User
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                className="w-full bg-shop-primary hover:bg-shop-primary/90" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : t('auth.login')}
              </Button>
              
              <div className="mt-4 text-center text-sm">
                <a href="/forgot-password" className="text-shop-primary hover:underline">
                  Forgot password?
                </a>
                <p className="mt-2">
                  Don't have an account?{" "}
                  <a href="/auth" className="text-shop-primary hover:underline">
                    {t('auth.signup')}
                  </a>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center text-sm text-gray-500">
          <a href="/" className="hover:underline">
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
