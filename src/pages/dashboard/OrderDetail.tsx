
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import UserDashboardSidebar from '@/components/dashboard/UserDashboardSidebar';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: orderItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['orderItems', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!order,
  });

  const isLoading = orderLoading || itemsLoading;

  const getStatusColor = (status: string) => {
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Order Details</h1>
              <Link to="/dashboard/orders">
                <Button variant="outline">Back to Orders</Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center my-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : order ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <span>Order #{order.id.slice(0, 8)}</span>
                      <Badge className={`${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Placed on {formatDate(order.created_at)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium text-lg mb-2">Shipping Information</h3>
                        <p>{order.shipping_address}</p>
                        <p>{order.shipping_city}, {order.shipping_state}</p>
                        <p>{order.shipping_pincode}</p>
                        <p>Phone: {order.shipping_phone}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-2">Payment Information</h3>
                        <p><span className="font-medium">Method:</span> {order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Razorpay'}</p>
                        <p><span className="font-medium">Status:</span> {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}</p>
                        {order.coupon_id && (
                          <p><span className="font-medium">Coupon Applied:</span> Yes</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orderItems && orderItems.length > 0 ? (
                      <div className="space-y-4">
                        {orderItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-4 border rounded hover:bg-gray-50">
                            <div className="flex items-center space-x-4">
                              <div className="font-medium">{item.product_name}</div>
                              <div className="text-sm text-gray-500">x{item.quantity}</div>
                            </div>
                            <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                          </div>
                        ))}
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatCurrency(order.total_amount + order.discount_amount)}</span>
                          </div>
                          {order.discount_amount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount</span>
                              <span>-{formatCurrency(order.discount_amount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>{formatCurrency(order.total_amount)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p>No items found for this order.</p>
                    )}
                  </CardContent>
                </Card>

                {order.order_notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{order.order_notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-10">
                  <h3 className="text-lg font-medium">Order not found</h3>
                  <p className="text-sm text-gray-500 mt-2">The order you're looking for doesn't exist or you don't have permission to view it.</p>
                  <div className="mt-6">
                    <Link to="/dashboard/orders">
                      <Button>View All Orders</Button>
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

export default OrderDetail;
