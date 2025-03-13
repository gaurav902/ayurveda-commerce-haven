
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, ShoppingCart, Heart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import RelatedProducts from "@/components/shop/RelatedProducts";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: categories } = useQuery({
    queryKey: ['product-categories', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('categories(*)')
        .eq('product_id', id);
      
      if (error) throw error;
      return data.map(item => item.categories);
    },
    enabled: !!id,
  });

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error("Sorry, we don't have more stock available");
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    await addToCart(product.id, quantity);
    // Optionally navigate to cart
    // navigate('/cart');
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    await addToCart(product.id, quantity);
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="w-full md:w-1/2 bg-gray-200 rounded-lg h-[400px]"></div>
              <div className="w-full md:w-1/2 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h2 className="text-2xl font-serif">Product not found</h2>
          <p className="mt-2 text-muted-foreground">The product you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-6" onClick={() => navigate('/shop')}>
            Back to Shop
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg overflow-hidden">
              <img 
                src={product.image_url || "https://images.unsplash.com/photo-1518495973542-4542c06a5843"} 
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-serif mb-2">{product.name}</h1>
            
            <div className="text-2xl font-medium mb-4">
              {formatCurrency(product.price)}
            </div>
            
            {categories && categories.length > 0 && (
              <div className="mb-4">
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category: any) => (
                    <span 
                      key={category.id} 
                      className="bg-ayurveda-cream/50 px-3 py-1 rounded-full text-sm"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="my-6">
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            
            <div className="flex items-center mb-6">
              <span className="text-sm font-medium mr-4">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button 
                  className="px-3 py-2 border-r"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <MinusIcon size={16} />
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button 
                  className="px-3 py-2 border-l"
                  onClick={increaseQuantity}
                  disabled={product && quantity >= product.stock}
                >
                  <PlusIcon size={16} />
                </button>
              </div>
              <span className="ml-4 text-sm text-muted-foreground">
                {product.stock} available
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-1 bg-primary hover:bg-primary-600"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
              <Button variant="outline" size="icon" className="w-10 h-10">
                <Heart size={18} />
              </Button>
            </div>
            
            <div className="mt-8 pt-6 border-t">
              <h3 className="font-medium mb-2">Product Details</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Authentic Ayurvedic formula</li>
                <li>100% natural ingredients</li>
                <li>No harmful chemicals</li>
                <li>Cruelty-free and sustainable</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} />
      </div>
    </Layout>
  );
};

export default ProductDetail;
