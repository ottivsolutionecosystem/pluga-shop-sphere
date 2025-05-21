
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Heart, BarChart, User, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/3">
          <CardHeader>
            <CardTitle className="text-xl">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-base">{user?.name || 'User'}</p>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-base">{user?.email || 'user@example.com'}</p>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p className="text-base">+1 (555) 123-4567</p>
            </div>
            <Button asChild variant="outline" className="w-full mt-2">
              <a href="/me/settings">Edit Profile</a>
            </Button>
          </CardContent>
        </Card>

        <div className="md:w-2/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Orders</CardTitle>
              <CardDescription>Your recently placed orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 border rounded-md">
                  <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">Order #12345</p>
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Shipping</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">2 items • $129.99</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/me/orders/12345">Track</a>
                  </Button>
                </div>

                <div className="flex items-center p-3 border rounded-md">
                  <div className="mr-4 h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">Order #12344</p>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Delivered</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">1 item • $59.99</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/me/orders/12344">Details</a>
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Button asChild variant="link">
                  <a href="/me/orders">View All Orders</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-red-500" />
                    <span className="text-xl font-bold">4</span>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <a href="/me/wishlist">View</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <BarChart className="h-4 w-4 mr-2" />
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <a href="/me/reviews">View</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Account</span>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <a href="/me/settings">Edit</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
