
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FeaturedProduct = () => {
  // This would come from your Supabase database in a real application
  const featuredProduct = {
    id: "feed-h-lotion",
    name: "FEED-H Lotion",
    price: 599,
    image: "https://images.unsplash.com/photo-1556760544-74068565f05c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Our revolutionary FEED-H Lotion is an Ayurvedic formulation that nourishes and revitalizes skin with a unique blend of traditional herbs and modern science.",
    benefits: [
      "Deep hydration with natural ingredients",
      "Revitalizes and enhances skin's natural glow",
      "Made with authentic Ayurvedic herbs",
      "Suitable for all skin types",
    ]
  };

  // Animation variants for motion effects
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const imageVariants = {
    hover: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-serif mb-2 text-primary-900">Introducing FEED-H Lotion</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Our signature Ayurvedic formulation designed to transform your daily skincare routine
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Product Image */}
          <motion.div 
            className="relative rounded-lg overflow-hidden shadow-lg h-[500px]"
            whileHover="hover"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src={featuredProduct.image}
              alt={featuredProduct.name}
              className="w-full h-full object-cover"
              variants={imageVariants}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent"></div>
          </motion.div>

          {/* Product Description */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div variants={itemVariants}>
              <span className="text-sm text-primary font-semibold tracking-wider uppercase">Signature Product</span>
              <h3 className="text-3xl font-serif mt-2 mb-4">{featuredProduct.name}</h3>
              <p className="text-xl text-primary-900 font-medium mb-2">₹{featuredProduct.price}.00</p>
              <p className="text-muted-foreground mb-6">
                {featuredProduct.description}
              </p>
            </motion.div>

            <motion.ul 
              className="space-y-3"
              variants={itemVariants}
            >
              {featuredProduct.benefits.map((benefit, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start"
                  variants={itemVariants}
                >
                  <div className="rounded-full bg-ayurveda-amber/20 p-1 mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-ayurveda-amber" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div 
              className="pt-6"
              variants={itemVariants}
            >
              <Button 
                asChild
                size="lg" 
                className="bg-primary hover:bg-primary-600 group"
              >
                <Link to={`/product/${featuredProduct.id}`}>
                  Learn More 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
