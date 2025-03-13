
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ShoppingBag, Printer } from "lucide-react";
import { formatCurrency, formatDate, getThankYouMessage } from "@/lib/utils";
import { Order, OrderItem } from "@/types";

const OrderSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const [thankYouMessage, setThankYouMessage] = useState("");

  useEffect(() => {
    // Generate a random thank you message when component mounts
    setThankYouMessage(getThankYouMessage());
  }, []);

  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Order;
    },
    enabled: !!id,
  });

  const { data: orderItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['order-items', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);
      
      if (error) throw error;
      return data as OrderItem[];
    },
    enabled: !!id,
  });

  const { data: coupon } = useQuery({
    queryKey: ['coupon', order?.coupon_id],
    queryFn: async () => {
      if (!order?.coupon_id) return null;
      
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', order.coupon_id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!order?.coupon_id,
  });

  const handlePrint = () => {
    window.print();
  };

  if (orderLoading || itemsLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h2 className="text-2xl font-serif">Order not found</h2>
          <p className="mt-2 text-muted-foreground">The order you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-6" asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12 print:py-4">
        <div className="text-center mb-8 print:mb-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 print:hidden" />
          <h1 className="text-3xl font-serif mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-4">{thankYouMessage}</p>
          <div className="flex flex-wrap justify-center gap-4 print:hidden">
            <Button asChild>
              <Link to="/dashboard/orders">View My Orders</Link>
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print Receipt
            </Button>
          </div>
        </div>
        
        <Card className="max-w-4xl mx-auto mb-8 print:shadow-none">
          <CardContent className="p-6 print:p-0">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 print:mb-3">
              <div>
                <h2 className="font-serif text-xl">Order Confirmation</h2>
                <p className="text-muted-foreground">Order ID: {order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-muted-foreground">Date: {formatDate(order.created_at)}</p>
              </div>
              <div className="mt-4 sm:mt-0 sm:text-right">
                <h3 className="font-medium">Payment Method</h3>
                <p className="text-muted-foreground capitalize">
                  {order.payment_method.replace(/_/g, ' ')}
                </p>
                <p className={`${
                  order.payment_status === 'completed' ? 'text-green-600' : 
                  order.payment_status === 'pending' ? 'text-amber-600' : 'text-red-600'
                }`}>
                  Payment {order.payment_status}
                </p>
              </div>
            </div>
            
            <div className="mb-6 print:mb-3">
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <p>{order.shipping_address}</p>
              <p>{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
              <p>Phone: {order.shipping_phone}</p>
            </div>
            
            <div className="mb-6 print:mb-3">
              <h3 className="font-medium mb-2">Order Items</h3>
              <table className="w-full mb-4">
                <thead className="border-b text-left">
                  <tr>
                    <th className="pb-2">Product</th>
                    <th className="pb-2">Quantity</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2">{item.product_name}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2 text-right">{formatCurrency(item.price)}</td>
                      <td className="py-2 text-right">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.total_amount + order.discount_amount)}</span>
              </div>
              
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Discount
                    {coupon && ` (${coupon.code}: ${coupon.discount_percentage}%)`}
                  </span>
                  <span>-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
            
            {order.order_notes && (
              <div className="mt-6 pt-4 border-t">
                <h3 className="font-medium mb-2">Order Notes</h3>
                <p className="text-muted-foreground">{order.order_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center print:hidden">
          <Button asChild variant="outline">
            <Link to="/shop">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
