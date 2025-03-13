
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types';
import { ExternalLink } from 'lucide-react';

const Orders = () => {
  const { user } = useAuth();
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['userOrders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Order[];
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
            <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
            
            {isLoading ? (
              <div className="flex justify-center my-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
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
                <CardContent className="text-center py-10">
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
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
