
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Users, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Store Dashboard</h1>
        <Button asChild>
          <a href="/admin/products/new">
            Add New Product
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,489</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +20% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              New Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">143</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              New Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground flex items-center text-red-500">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              -0.4% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Recently placed orders across your store.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="mr-4 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        Order #{10240 + i}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${(99.99 * i).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Customer {i} • {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/admin/orders/${i}`}>View</a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Your best-selling products this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Smartphone', 'Headphones', 'Smart Watch'].map((product, i) => (
                <div key={product} className="flex items-center">
                  <div className="mr-4 h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                    <span className="text-xs font-medium">{i + 1}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {product}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${(149.99 - i * 20).toFixed(2)} • {42 - i * 10} sales
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
