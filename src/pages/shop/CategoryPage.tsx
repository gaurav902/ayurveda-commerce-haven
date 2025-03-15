
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Slider,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Product } from "@/types";

// Mock data - would come from your API in a real application
const products: Product[] = [
  {
    id: "1",
    name: "Bhringraj Hair Oil",
    description: "A traditional Ayurvedic hair oil made with pure Bhringraj herb, known for promoting hair growth and preventing premature graying.",
    price: 3499, // 34.99 in paise
    stock: 25,
    image_url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843",
    created_at: "2023-01-15T00:00:00Z",
    updated_at: "2023-01-15T00:00:00Z"
  },
  {
    id: "2",
    name: "Neem & Tulsi Face Wash",
    description: "A gentle face wash infused with the goodness of Neem and Tulsi, perfect for acne-prone skin.",
    price: 2499, // 24.99 in paise
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    created_at: "2023-01-20T00:00:00Z",
    updated_at: "2023-01-20T00:00:00Z"
  },
  {
    id: "3",
    name: "Amla Hair Mask",
    description: "A deeply nourishing hair mask made with Amla (Indian Gooseberry) to strengthen and condition damaged hair.",
    price: 2999, // 29.99 in paise
    stock: 18,
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    created_at: "2023-01-25T00:00:00Z",
    updated_at: "2023-01-25T00:00:00Z"
  },
  {
    id: "4",
    name: "Turmeric Glow Serum",
    description: "A brightening serum infused with turmeric extract to even skin tone and impart a natural glow.",
    price: 3999, // 39.99 in paise
    stock: 30,
    image_url: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17",
    created_at: "2023-02-05T00:00:00Z",
    updated_at: "2023-02-05T00:00:00Z"
  },
  {
    id: "5",
    name: "Aloe Vera Gel",
    description: "100% pure Aloe Vera gel for multiple uses including skin soothing, hair conditioning, and wound healing.",
    price: 1999, // 19.99 in paise
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1505637040160-2614986a5623",
    created_at: "2023-02-10T00:00:00Z",
    updated_at: "2023-02-10T00:00:00Z"
  },
  {
    id: "6",
    name: "Rose Water Toner",
    description: "A refreshing facial toner made from steam-distilled rose petals to balance skin pH and tighten pores.",
    price: 1499, // 14.99 in paise
    stock: 35,
    image_url: "https://images.unsplash.com/photo-1562104308-a39f4a8aee70",
    created_at: "2023-02-15T00:00:00Z",
    updated_at: "2023-02-15T00:00:00Z"
  }
];

// Mock categories - would come from your API in a real application
const categories = [
  { id: "hair-care", name: "Hair Care", count: 15 },
  { id: "skin-care", name: "Skin Care", count: 22 },
  { id: "body-care", name: "Body Care", count: 9 },
  { id: "wellness", name: "Wellness", count: 12 },
  { id: "aromatherapy", name: "Aromatherapy", count: 7 },
];

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]); // in paise (0-50 USD)
  const [sortBy, setSortBy] = useState("latest");
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const category = categories.find((cat) => cat.id === slug);
    setCategoryName(category?.name || "Products");
  }, [slug]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 5000]);
    setSortBy("latest");
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Filter and sort products based on current filters
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low-high":
          return a.price - b.price;
        case "price-high-low":
          return b.price - a.price;
        case "name-a-z":
          return a.name.localeCompare(b.name);
        case "name-z-a":
          return b.name.localeCompare(a.name);
        case "latest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <Layout>
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Filter Sidebar - Mobile Toggle */}
          <div className="w-full md:hidden mb-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-between"
              onClick={toggleFilter}
            >
              <span className="flex items-center">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {isFilterOpen ? "Hide Filters" : "Show Filters"}
              </span>
              {isFilterOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
                  {filteredProducts.length}
                </span>
              )}
            </Button>
          </div>

          {/* Filter Sidebar */}
          <div
            className={`w-full md:w-64 space-y-6 ${
              isFilterOpen ? "block" : "hidden md:block"
            }`}
          >
            <div>
              <h2 className="text-lg font-medium mb-4">Search</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-medium mb-4">Categories</h2>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.id}>
                    <a
                      href={`/category/${category.id}`}
                      className={`flex justify-between items-center hover:text-primary transition-colors ${
                        slug === category.id ? "text-primary font-medium" : ""
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-muted-foreground text-sm">
                        ({category.count})
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-medium mb-4">Price Range</h2>
              <Slider
                defaultValue={priceRange}
                min={0}
                max={5000}
                step={100}
                value={priceRange}
                onValueChange={handlePriceChange}
                className="mb-6"
              />
              <div className="flex justify-between">
                <span>₹{(priceRange[0] / 100).toFixed(2)}</span>
                <span>₹{(priceRange[1] / 100).toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            <Button
              variant="outline"
              className="w-full"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-2xl font-serif mb-2 sm:mb-0">
                {categoryName} ({filteredProducts.length})
              </h1>

              <div className="w-full sm:w-auto">
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="latest">Latest</SelectItem>
                      <SelectItem value="price-low-high">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high-low">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                      <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
