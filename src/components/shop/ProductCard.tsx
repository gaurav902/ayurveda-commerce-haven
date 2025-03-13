
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <Card className="card-ayurveda overflow-hidden group">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image_url || "https://images.unsplash.com/photo-1518495973542-4542c06a5843"}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <button className="absolute top-3 right-3 bg-white rounded-full p-1.5 text-primary hover:text-primary-600 transition-colors">
          <Heart size={18} />
        </button>
      </div>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground mb-1">Ayurvedic</div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-lg mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <span className="font-medium">{formatCurrency(product.price)}</span>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary-600"
            onClick={onAddToCart}
          >
            <ShoppingCart size={16} className="mr-1" /> Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
