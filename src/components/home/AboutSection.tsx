
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Sun, Droplets } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                alt="Ayurvedic ingredients and treatments"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg max-w-xs hidden md:block">
              <p className="italic text-muted-foreground font-serif">
                "The ancient wisdom of Ayurveda meets modern beauty science for true holistic care."
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-serif mb-4 text-primary-900">Our Ayurvedic Heritage</h2>
            <p className="text-muted-foreground mb-6">
              For over two decades, we've been crafting authentic Ayurvedic beauty formulations using time-tested
              recipes and premium natural ingredients. Our products harness the power of nature to enhance your
              beauty naturally, with no harmful chemicals or synthetic additives.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex">
                <div className="mr-4 flex-shrink-0 h-12 w-12 bg-ayurveda-cream rounded-full flex items-center justify-center text-primary">
                  <Leaf size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">All-Natural Ingredients</h3>
                  <p className="text-muted-foreground text-sm">
                    Ethically sourced herbs and botanical extracts from trusted suppliers.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4 flex-shrink-0 h-12 w-12 bg-ayurveda-cream rounded-full flex items-center justify-center text-primary">
                  <Sun size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Traditional Methods</h3>
                  <p className="text-muted-foreground text-sm">
                    Products created using ancestral techniques to preserve their potency.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4 flex-shrink-0 h-12 w-12 bg-ayurveda-cream rounded-full flex items-center justify-center text-primary">
                  <Droplets size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Sustainability Focus</h3>
                  <p className="text-muted-foreground text-sm">
                    Eco-friendly packaging and responsible manufacturing practices.
                  </p>
                </div>
              </div>
            </div>
            
            <Button className="bg-primary hover:bg-primary-600 text-white" asChild>
              <Link to="/about">Learn Our Story</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
