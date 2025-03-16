import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Sun, Droplets } from "lucide-react";
import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Image Section with 3D Hover Effect */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              className="rounded-lg overflow-hidden shadow-lg"
              whileHover={{ scale: 1.05, rotateX: -5, rotateY: 5 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                alt="Ayurvedic ingredients and treatments"
                className="w-full h-full object-cover aspect-[4/3] rounded-lg"
              />
            </motion.div>
            
            {/* Floating Quote Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg max-w-xs hidden md:block"
            >
              <p className="italic text-muted-foreground font-serif">
                "Ayurveda guides what benefits or harms life, bringing health and harmony."
              </p>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif mb-4 text-primary-900">Our Ayurvedic Heritage</h2>
            <p className="text-muted-foreground mb-6">
              For over two decades, we've been crafting authentic Ayurvedic beauty formulations using time-tested
              recipes and premium natural ingredients. Our products harness the power of nature to enhance your
              beauty naturally, with no harmful chemicals or synthetic additives.
            </p>

            <div className="space-y-4 mb-8">
              {/* Feature 1 */}
              <motion.div
                className="flex"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mr-4 flex-shrink-0 h-12 w-12 bg-ayurveda-cream rounded-full flex items-center justify-center text-primary shadow-md">
                  <Leaf size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">All-Natural Ingredients</h3>
                  <p className="text-muted-foreground text-sm">
                    Ethically sourced herbs and botanical extracts from trusted suppliers.
                  </p>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                className="flex"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mr-4 flex-shrink-0 h-12 w-12 bg-ayurveda-cream rounded-full flex items-center justify-center text-primary shadow-md">
                  <Sun size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Traditional Methods</h3>
                  <p className="text-muted-foreground text-sm">
                    Products created using ancestral techniques to preserve their potency.
                  </p>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                className="flex"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mr-4 flex-shrink-0 h-12 w-12 bg-ayurveda-cream rounded-full flex items-center justify-center text-primary shadow-md">
                  <Droplets size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Sustainability Focus</h3>
                  <p className="text-muted-foreground text-sm">
                    Eco-friendly packaging and responsible manufacturing practices.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Button with Hover Animation */}
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <Button className="bg-primary hover:bg-primary-600 text-white" asChild>
                <Link to="/about">Learn Our Story</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
