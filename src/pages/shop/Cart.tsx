
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash, MinusIcon, PlusIcon, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Cart = () => {
  const { cartItems, cartTotal, updateCartItem, removeFromCart, getDiscountedTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const { data: coupons = [] } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;
      return data;
    },
  });

  const handleQuantityChange = (cartItemId: string, quantity: number) => {
    updateCartItem(cartItemId, quantity);
  };

  const handleRemoveItem = (cartItemId: string) => {
    removeFromCart(cartItemId);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    const foundCoupon = coupons.find(
      (coupon) => coupon.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (!foundCoupon) {
      toast.error("Invalid coupon code");
      return;
    }

    // Check if coupon is expired
    if (foundCoupon.expires_at && new Date(foundCoupon.expires_at) < new Date()) {
      toast.error("This coupon has expired");
      return;
    }

    setAppliedCoupon(foundCoupon);
    toast.success(`Coupon applied: ${foundCoupon.discount_percentage}% off`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const calculateFinalAmount = () => {
    if (appliedCoupon) {
      return getDiscountedTotal(appliedCoupon.discount_percentage);
    }
    return cartTotal;
  };

  const proceedToCheckout = () => {
    if (!user) {
      // Save intended destination
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    
    navigate('/checkout', { 
      state: { 
        appliedCouponId: appliedCoupon?.id,
        discountAmount: appliedCoupon ? (cartTotal - calculateFinalAmount()) : 0
      } 
    });
  };

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-serif mb-8">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-ayurveda-cream/10 rounded-lg">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-serif mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Button className="bg-primary hover:bg-primary-600" asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="w-full lg:w-2/3">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="text-left">
                        <th className="p-4">Product</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Quantity</th>
                        <th className="p-4">Total</th>
                        <th className="p-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {cartItems.map((item) => (
                        <tr key={item.id}>
                          <td className="p-4">
                            <div className="flex items-center">
                              <img 
                                src={item.product.image_url || "https://images.unsplash.com/photo-1518495973542-4542c06a5843"}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded-md mr-4"
                              />
                              <div>
                                <Link 
                                  to={`/product/${item.product_id}`}
                                  className="font-medium hover:text-primary"
                                >
                                  {item.product.name}
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-medium">
                            {formatCurrency(item.product.price)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center border rounded-md w-24">
                              <button 
                                className="px-2 py-1"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <MinusIcon size={14} />
                              </button>
                              <span className="px-2 py-1 flex-1 text-center">{item.quantity}</span>
                              <button 
                                className="px-2 py-1"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock}
                              >
                                <PlusIcon size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="p-4 font-medium">
                            {formatCurrency(item.product.price * item.quantity)}
                          </td>
                          <td className="p-4">
                            <button 
                              className="text-gray-400 hover:text-red-500"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Button variant="outline" asChild>
                  <Link to="/shop">
                    <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-serif mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatCurrency(cartTotal)}</span>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedCoupon.discount_percentage}%)</span>
                        <span>-{formatCurrency(cartTotal - calculateFinalAmount())}</span>
                      </div>
                    )}
                    
                    <div className="pt-3 border-t flex justify-between text-lg font-medium">
                      <span>Total</span>
                      <span>{formatCurrency(calculateFinalAmount())}</span>
                    </div>
                  </div>
                  
                  {/* Coupon */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Apply Coupon</label>
                    <div className="flex">
                      <Input 
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={!!appliedCoupon}
                        className="rounded-r-none"
                      />
                      {appliedCoupon ? (
                        <Button 
                          variant="outline" 
                          className="rounded-l-none border-l-0"
                          onClick={handleRemoveCoupon}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button 
                          className="rounded-l-none"
                          onClick={handleApplyCoupon}
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                    {appliedCoupon && (
                      <p className="text-sm text-green-600 mt-1">
                        Coupon {appliedCoupon.code} applied
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary-600"
                    size="lg"
                    disabled={cartItems.length === 0}
                    onClick={proceedToCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
