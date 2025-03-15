
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Product, Category } from "@/types";
import ProductCard from "@/components/shop/ProductCard";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch category and products
  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setIsLoading(true);
      if (!categoryId) return;

      try {
        // Fetch category
        const { data: categoryData, error: categoryError } = await supabase
          .from("categories")
          .select("*")
          .eq("id", categoryId)
          .single();

        if (categoryError) throw categoryError;
        setCategory(categoryData);

        // Fetch products related to the category
        const { data: productsData, error: productsError } = await supabase
          .from("product_categories")
          .select("product_id")
          .eq("category_id", categoryId);

        if (productsError) throw productsError;

        if (productsData.length > 0) {
          const productIds = productsData.map((pc) => pc.product_id);
          
          const { data: products, error: productsDetailError } = await supabase
            .from("products")
            .select("*")
            .in("id", productIds);

          if (productsDetailError) throw productsDetailError;
          setProducts(products || []);

          // Set price range based on available products
          if (products && products.length > 0) {
            const prices = products.map((p) => p.price);
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            setMinPrice(min);
            setMaxPrice(max);
            setPriceRange([min, max]);
          }
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load category data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [categoryId]);

  // Handle sorting
  const getSortedProducts = () => {
    if (!products) return [];
    
    const filtered = products.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-low-high":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price-high-low":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "newest":
        return [...filtered].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        return filtered;
    }
  };

  const sortedProducts = getSortedProducts();

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const toggleSort = () => {
    setIsSortOpen(!isSortOpen);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex">
            <li className="flex items-center">
              <Link to="/" className="text-muted-foreground hover:text-primary">
                Home
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link to="/shop" className="text-muted-foreground hover:text-primary">
                Shop
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-primary">{category?.name}</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif mb-3">{category?.name}</h1>
          {category?.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
        </div>

        {/* Mobile Filters */}
        <div className="lg:hidden flex justify-between mb-6">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={toggleFilter}
          >
            <Filter className="h-4 w-4" />
            Filters
            {isFilterOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={toggleSort}
            >
              Sort By
              {isSortOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10 border">
                <div className="py-1">
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      sortBy === "featured" ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setSortBy("featured");
                      setIsSortOpen(false);
                    }}
                  >
                    Featured
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      sortBy === "price-low-high" ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setSortBy("price-low-high");
                      setIsSortOpen(false);
                    }}
                  >
                    Price: Low to High
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      sortBy === "price-high-low" ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setSortBy("price-high-low");
                      setIsSortOpen(false);
                    }}
                  >
                    Price: High to Low
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      sortBy === "newest" ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setSortBy("newest");
                      setIsSortOpen(false);
                    }}
                  >
                    Newest
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Panel */}
        {isFilterOpen && (
          <div className="lg:hidden mb-6 p-4 border rounded-md">
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="px-2 py-4">
              <Slider
                defaultValue={[minPrice, maxPrice]}
                min={minPrice}
                max={maxPrice}
                step={100}
                value={priceRange}
                onValueChange={handlePriceChange}
                className="mb-6"
              />
              <div className="flex justify-between text-sm">
                <span>₹{priceRange[0] / 100}</span>
                <span>₹{priceRange[1] / 100}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <div className="border rounded-md p-4 space-y-6">
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="px-2 py-4">
                  <Slider
                    defaultValue={[minPrice, maxPrice]}
                    min={minPrice}
                    max={maxPrice}
                    step={100}
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    className="mb-6"
                  />
                  <div className="flex justify-between text-sm">
                    <span>₹{priceRange[0] / 100}</span>
                    <span>₹{priceRange[1] / 100}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Sort By</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="sortBy"
                      className="h-4 w-4"
                      checked={sortBy === "featured"}
                      onChange={() => setSortBy("featured")}
                    />
                    <span>Featured</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="sortBy"
                      className="h-4 w-4"
                      checked={sortBy === "price-low-high"}
                      onChange={() => setSortBy("price-low-high")}
                    />
                    <span>Price: Low to High</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="sortBy"
                      className="h-4 w-4"
                      checked={sortBy === "price-high-low"}
                      onChange={() => setSortBy("price-high-low")}
                    />
                    <span>Price: High to Low</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="sortBy"
                      className="h-4 w-4"
                      checked={sortBy === "newest"}
                      onChange={() => setSortBy("newest")}
                    />
                    <span>Newest</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-12 border rounded-md">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or check out our other categories.
                </p>
                <Link to="/shop">
                  <Button>View All Products</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
