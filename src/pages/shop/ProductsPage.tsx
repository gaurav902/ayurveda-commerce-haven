
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Product, Category } from "@/types";
import ProductCard from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/context/CartContext";

const ProductsPage = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const { addToCart } = useCart();

  const fetchProducts = async () => {
    let query = supabase
      .from('products')
      .select('*, product_categories!inner(category_id)');

    if (selectedCategories.length > 0) {
      query = query.in('product_categories.category_id', selectedCategories);
    }

    // Convert price range from rupees to paise
    const minPrice = priceRange[0] * 100;
    const maxPrice = priceRange[1] * 100;
    
    query = query.gte('price', minPrice).lte('price', maxPrice);
    
    const { data, error } = await query;

    if (error) throw error;

    // Deduplicate products (they might appear multiple times due to the join)
    const uniqueProducts = Array.from(new Map(data.map(item => [item.id, item])).values());
    
    // Filter by search query if provided
    if (searchQuery) {
      return uniqueProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return uniqueProducts;
  };

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', selectedCategories, searchQuery, priceRange],
    queryFn: fetchProducts,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      return data;
    },
  });

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1);
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-serif mb-6">Shop Ayurvedic Products</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-medium text-lg mb-4">Filters</h2>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Search</label>
                <Input 
                  type="text"
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category: Category) => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox 
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryChange(category.id)}
                      />
                      <label 
                        htmlFor={`category-${category.id}`} 
                        className="ml-2 text-sm font-medium"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-2">Price Range (₹)</h3>
                <div className="flex items-center space-x-4">
                  <Input 
                    type="number"
                    min="0"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-24"
                  />
                  <span>to</span>
                  <Input 
                    type="number"
                    min="0"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-24"
                  />
                </div>
              </div>
              
              {/* Reset Filters */}
              <Button 
                variant="outline" 
                className="w-full mt-6"
                onClick={() => {
                  setSelectedCategories([]);
                  setSearchQuery("");
                  setPriceRange([0, 10000]);
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="w-full lg:w-3/4">
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gray-100 animate-pulse h-80 rounded-lg"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No products found</h3>
                <p className="text-muted-foreground mt-1">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: Product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={() => handleAddToCart(product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
