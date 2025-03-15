
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import UserDashboardSidebar from '@/components/dashboard/UserDashboardSidebar';
import { Product } from '@/types';

const Wishlist = () => {
  const { user } = useAuth();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  // Fetch wishlist items
  const { data: wishlistItems, isLoading, refetch } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*, products(*)')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!user) return;
    
    setIsRemoving(productId);
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
      
      if (error) throw error;
      
      toast.success('Item removed from wishlist');
      refetch();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    } finally {
      setIsRemoving(null);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) return;
    
    try {
      // Get user's cart or create one
      let { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!cart) {
        const { data: newCart, error: cartError } = await supabase
          .from('carts')
          .insert({ user_id: user.id })
          .select('id')
          .single();
        
        if (cartError) throw cartError;
        cart = newCart;
      }
      
      // Check if product is already in cart
      const { data: existingItems } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart.id)
        .eq('product_id', product.id);
      
      if (existingItems && existingItems.length > 0) {
        // Update quantity
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItems[0].quantity + 1 })
          .eq('id', existingItems[0].id);
        
        if (updateError) throw updateError;
      } else {
        // Add new item
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            cart_id: cart.id,
            product_id: product.id,
            quantity: 1
          });
        
        if (insertError) throw insertError;
      }
      
      toast.success('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <UserDashboardSidebar />
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
            
            {isLoading ? (
              <div className="flex justify-center my-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : !wishlistItems || wishlistItems.length === 0 ? (
              <div className="text-center p-8 bg-muted rounded-lg">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6">Items you add to your wishlist will appear here</p>
                <Button asChild>
                  <a href="/shop">Continue Shopping</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item: any) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <img 
                        src={item.products.image_url || '/placeholder.svg'} 
                        alt={item.products.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium truncate">{item.products.name}</h3>
                      <p className="text-lg font-bold my-2">{formatCurrency(item.products.price)}</p>
                      
                      <div className="flex gap-2 mt-4">
                        <Button 
                          className="flex-1" 
                          size="sm"
                          onClick={() => handleAddToCart(item.products)}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive border-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveFromWishlist(item.product_id)}
                          disabled={isRemoving === item.product_id}
                        >
                          {isRemoving === item.product_id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
