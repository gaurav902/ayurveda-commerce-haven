
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import UserDashboardSidebar from '@/components/dashboard/UserDashboardSidebar';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Package, ShoppingBag, User } from 'lucide-react';
import { Order } from '@/types';

const UserDashboard = () => {
  const { user, profile, updateProfile } = useAuth();
  
  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['recentUserOrders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data as Order[];
    },
    enabled: !!user,
  });

  const { data: orderCount } = useQuery({
    queryKey: ['userOrderCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <UserDashboardSidebar />
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <User className="mr-2 h-5 w-5" /> Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{profile?.full_name || user?.email}</p>
                  <p className="text-sm text-gray-500">Member since {formatDate(profile?.created_at || '')}</p>
                </CardContent>
                <CardFooter>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">Manage Account</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Package className="mr-2 h-5 w-5" /> Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{orderCount}</p>
                  <p className="text-sm text-gray-500">Total orders placed</p>
                </CardContent>
                <CardFooter>
                  <Link to="/dashboard/orders">
                    <Button variant="outline" size="sm">View Orders</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5" /> Shopping
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Browse our latest products</p>
                  <p className="text-sm text-gray-500">Find new Ayurvedic products</p>
                </CardContent>
                <CardFooter>
                  <Link to="/shop">
                    <Button variant="outline" size="sm">Shop Now</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recent Orders</h2>
                  <Link to="/dashboard/orders">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
                
                {ordersLoading ? (
                  <div className="flex justify-center my-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : recentOrders && recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <Card key={order.id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 pb-2">
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                              <p className="text-sm text-gray-500">Placed on {formatDate(order.created_at)}</p>
                            </div>
                            <Badge className={`${getStatusColorClass(order.status)} text-white mt-2 sm:mt-0`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                              <p className="font-medium">Total Amount: {formatCurrency(order.total_amount)}</p>
                              <p className="text-sm text-gray-500">Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}</p>
                            </div>
                            <Link to={`/dashboard/order/${order.id}`}>
                              <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                                View Details <ExternalLink className="ml-1 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <h3 className="text-lg font-medium">No orders yet</h3>
                      <p className="text-sm text-gray-500 mt-2">You haven't placed any orders yet.</p>
                      <div className="mt-6">
                        <Link to="/shop">
                          <Button>Start Shopping</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Name:</span> {profile?.full_name || 'Not set'}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {profile?.email || user?.email}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {profile?.phone || 'Not set'}
                      </div>
                      <div>
                        <span className="font-medium">Address:</span> {profile?.address ? (
                          <span>
                            {profile.address}, {profile.city}, {profile.state}, {profile.pincode}
                          </span>
                        ) : (
                          'Not set'
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Edit Profile</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
