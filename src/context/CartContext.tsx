
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { Cart, CartItem, CartWithItems, Product } from "@/types";
import { toast } from "sonner";

interface CartContextType {
  cart: CartWithItems | null;
  cartItems: (CartItem & { product: Product })[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getDiscountedTotal: (discountPercentage: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartWithItems | null>(null);
  const [cartItems, setCartItems] = useState<(CartItem & { product: Product })[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Calculate cart count and total whenever cart items change
    let count = 0;
    let total = 0;

    cartItems.forEach(item => {
      count += item.quantity;
      total += item.product.price * item.quantity;
    });

    setCartCount(count);
    setCartTotal(total);
  }, [cartItems]);

  const fetchCart = async () => {
    if (!user) return;

    setIsLoading(true);
    
    // Check if user has an existing cart
    let { data: existingCart } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // If no cart exists, create one
    if (!existingCart) {
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (createError) {
        console.error("Error creating cart:", createError);
        toast.error("Error creating cart");
        setIsLoading(false);
        return;
      }

      existingCart = newCart;
    }

    // Get cart items with product details
    const { data: items, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('cart_id', existingCart.id);

    if (itemsError) {
      console.error("Error fetching cart items:", itemsError);
      toast.error("Error loading cart items");
      setIsLoading(false);
      return;
    }

    setCart({ ...existingCart, items: items || [] });
    setCartItems(items || []);
    setIsLoading(false);
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      toast.error("Please log in to add items to cart");
      return;
    }

    if (!cart) {
      await fetchCart();
      if (!cart) return;
    }

    setIsLoading(true);

    // Check if product already in cart
    const existingItem = cartItems.find(item => item.product_id === productId);

    if (existingItem) {
      // Update quantity if item already exists
      await updateCartItem(existingItem.id, existingItem.quantity + quantity);
    } else {
      // Add new item to cart
      const { error } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: productId,
          quantity: quantity
        });

      if (error) {
        console.error("Error adding to cart:", error);
        toast.error("Error adding item to cart");
        setIsLoading(false);
        return;
      }

      toast.success("Item added to cart");
      fetchCart();
    }
  };

  const updateCartItem = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId);

    if (error) {
      console.error("Error updating cart item:", error);
      toast.error("Error updating cart");
      setIsLoading(false);
      return;
    }

    fetchCart();
  };

  const removeFromCart = async (cartItemId: string) => {
    setIsLoading(true);

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      console.error("Error removing from cart:", error);
      toast.error("Error removing item from cart");
      setIsLoading(false);
      return;
    }

    toast.info("Item removed from cart");
    fetchCart();
  };

  const clearCart = async () => {
    if (!cart) return;

    setIsLoading(true);

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);

    if (error) {
      console.error("Error clearing cart:", error);
      toast.error("Error clearing cart");
      setIsLoading(false);
      return;
    }

    fetchCart();
  };

  const getDiscountedTotal = (discountPercentage: number) => {
    const discount = Math.round((cartTotal * discountPercentage) / 100);
    return cartTotal - discount;
  };

  const value = {
    cart,
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getDiscountedTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
