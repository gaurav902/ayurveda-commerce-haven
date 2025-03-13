
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/shop/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

// Mock data for products by category
const fetchProductsByCategory = async (categorySlug: string) => {
  // In a real app, this would fetch from an API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const categoryData: Record<string, {name: string, description: string}> = {
    "hair-care": {
      name: "Hair Care",
      description: "Natural Ayurvedic solutions for healthy, beautiful hair"
    },
    "skin-care": {
      name: "Skin Care",
      description: "Traditional formulations to nurture and illuminate your skin"
    },
    "body-care": {
      name: "Body Care",
      description: "Holistic care for your entire body, using ancient wisdom"
    },
    "wellness": {
      name: "Wellness",
      description: "Products to support balance and harmony in mind and body"
    }
  };
  
  // Generate 8 products for the requested category
  return {
    category: categoryData[categorySlug] || { 
      name: categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      description: "Explore our collection of natural Ayurvedic products"
    },
    products: Array.from({ length: 8 }, (_, i) => ({
      id: `${categorySlug}-${i+1}`,
      name: `${categoryData[categorySlug]?.name || 'Natural'} Product ${i+1}`,
      price: Math.floor(1500 + Math.random() * 3000) / 100,
      image: `https://images.unsplash.com/photo-${1518495973542 + i}-4542c06a5843`,
      rating: Math.floor(3 + Math.random() * 2),
      reviewCount: Math.floor(5 + Math.random() * 95),
      category: categorySlug,
      inStock: Math.random() > 0.2,
    }))
  };
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sortOrder, setSortOrder] = useState<string>("recommended");
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => fetchProductsByCategory(slug || ''),
    enabled: !!slug,
  });

  // Handle sorting
  const getSortedProducts = () => {
    if (!data?.products) return [];
    
    const products = [...data.products];
    
    switch (sortOrder) {
      case "price-low-high":
        return products.sort((a, b) => a.price - b.price);
      case "price-high-low":
        return products.sort((a, b) => b.price - a.price);
      case "newest":
        return products; // In a real app, this would sort by date
      case "top-rated":
        return products.sort((a, b) => b.rating - a.rating);
      default:
        return products;
    }
  };

  const sortedProducts = getSortedProducts();

  return (
    <Layout>
      <div className="container-custom py-12">
        {isLoading ? (
          <>
            <div className="mb-8">
              <Skeleton className="h-12 w-1/3 mb-2" />
              <Skeleton className="h-5 w-2/3" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="card-ayurveda">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-5 w-4/5 mb-2" />
                    <Skeleton className="h-5 w-2/5 mb-4" />
                    <Skeleton className="h-10 w-full rounded" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-serif mb-4">We couldn't find this category</h2>
            <p className="text-muted-foreground mb-6">
              The category you're looking for may have been moved or deleted.
            </p>
            <Button asChild>
              <a href="/shop">Return to Shop</a>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-serif mb-2">{data?.category.name}</h1>
              <p className="text-muted-foreground">{data?.category.description}</p>
            </div>
            
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <p className="text-muted-foreground">
                Showing {sortedProducts.length} products
              </p>
              <div className="w-full sm:w-auto">
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                    <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="top-rated">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
