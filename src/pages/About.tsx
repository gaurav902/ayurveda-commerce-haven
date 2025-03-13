
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif mb-6">About Ayurveda Haven</h1>
          
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1920"
              alt="Ayurvedic herbs and ingredients" 
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="lead text-lg text-muted-foreground">
              At Ayurveda Haven, we are dedicated to bringing the ancient wisdom of Ayurveda to modern living, offering authentic, natural products that nurture your body, mind, and spirit.
            </p>
            
            <h2 className="text-2xl font-serif mt-8 mb-4">Our Story</h2>
            <p>
              Founded in 2018, Ayurveda Haven began with a simple mission: to create effective, natural products based on Ayurvedic principles that have stood the test of time for over 5,000 years. Our founder, a practitioner of Ayurveda with deep roots in traditional Indian medicine, recognized the growing need for authentic Ayurvedic products in a market flooded with synthetic alternatives.
            </p>
            
            <h2 className="text-2xl font-serif mt-8 mb-4">Our Philosophy</h2>
            <p>
              Ayurveda teaches us that true beauty and wellness come from balance—balance in our bodies, minds, and in our relationship with nature. We believe in:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li><strong>Authenticity:</strong> We use traditional Ayurvedic formulations, backed by centuries of wisdom.</li>
              <li><strong>Purity:</strong> Our products contain only natural ingredients, free from harsh chemicals, parabens, and artificial fragrances.</li>
              <li><strong>Sustainability:</strong> We source our ingredients ethically and use eco-friendly packaging.</li>
              <li><strong>Holistic Approach:</strong> We consider the whole person—body, mind, and spirit—in every product we create.</li>
            </ul>
            
            <h2 className="text-2xl font-serif mt-8 mb-4">Our Ingredients</h2>
            <p>
              We carefully source herbs, oils, and minerals that have been used in Ayurvedic medicine for centuries. Every ingredient is selected for its specific properties and benefits, and we work directly with small-scale farmers who practice sustainable cultivation methods.
            </p>
            
            <h2 className="text-2xl font-serif mt-8 mb-4">Our Commitment</h2>
            <p>
              We are committed to quality, transparency, and customer satisfaction. Every product is made in small batches to ensure freshness and efficacy, and we rigorously test for purity and potency.
            </p>
            
            <div className="mt-10 flex justify-center">
              <Button className="bg-primary hover:bg-primary-600" asChild>
                <Link to="/shop">Explore Our Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
