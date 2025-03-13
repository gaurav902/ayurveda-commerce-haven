
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { useCart } from "@/context/CartContext";

interface RelatedProductsProps {
  currentProductId: string;
}

const RelatedProducts = ({ currentProductId }: RelatedProductsProps) => {
  const { addToCart } = useCart();

  const { data: relatedProducts = [], isLoading } = useQuery({
    queryKey: ['related-products', currentProductId],
    queryFn: async () => {
      // Get categories of current product
      const { data: categories } = await supabase
        .from('product_categories')
        .select('category_id')
        .eq('product_id', currentProductId);
      
      if (!categories || categories.length === 0) {
        // If no categories, get any 4 products except current
        const { data } = await supabase
          .from('products')
          .select('*')
          .neq('id', currentProductId)
          .limit(4);
        return data || [];
      }
      
      // Get category IDs
      const categoryIds = categories.map(c => c.category_id);
      
      // Get products from the same categories
      const { data: productIds } = await supabase
        .from('product_categories')
        .select('product_id')
        .in('category_id', categoryIds)
        .neq('product_id', currentProductId);
      
      if (!productIds || productIds.length === 0) return [];
      
      // Get unique product IDs
      const uniqueProductIds = [...new Set(productIds.map(p => p.product_id))].slice(0, 4);
      
      // Get product details
      const { data } = await supabase
        .from('products')
        .select('*')
        .in('id', uniqueProductIds);
      
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-serif mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-gray-100 animate-pulse h-80 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-serif mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product: Product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={() => addToCart(product.id, 1)}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
