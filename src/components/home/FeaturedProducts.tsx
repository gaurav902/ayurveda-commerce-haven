
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";

// This would come from your API in a real application
const featuredProducts = [
  {
    id: 1,
    name: "Bhringraj Hair Oil",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843",
    category: "Hair Care",
    rating: 4.8,
    isNew: true,
  },
  {
    id: 2,
    name: "Neem & Tulsi Face Wash",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    category: "Skin Care",
    rating: 4.6,
    isNew: false,
  },
  {
    id: 3,
    name: "Amla Hair Mask",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    category: "Hair Care",
    rating: 4.9,
    isNew: true,
  },
  {
    id: 4,
    name: "Turmeric Glow Serum",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843",
    category: "Skin Care",
    rating: 4.7,
    isNew: false,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-serif mb-2 text-primary-900">Featured Products</h2>
            <p className="text-muted-foreground">Our most popular Ayurvedic beauty creations</p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0" asChild>
            <Link to="/products">View All Products</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="card-ayurveda overflow-hidden group">
              <div className="relative overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                {product.isNew && (
                  <span className="absolute top-3 left-3 bg-ayurveda-amber px-2 py-1 text-xs font-medium text-primary-900 rounded">
                    New
                  </span>
                )}
                <button className="absolute top-3 right-3 bg-white rounded-full p-1.5 text-primary hover:text-primary-600 transition-colors">
                  <Heart size={18} />
                </button>
              </div>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-medium text-lg mb-1 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-medium">${product.price.toFixed(2)}</span>
                  <Button size="sm" className="bg-primary hover:bg-primary-600">
                    <ShoppingCart size={16} className="mr-1" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
