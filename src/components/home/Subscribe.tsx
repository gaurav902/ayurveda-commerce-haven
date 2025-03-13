
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Thank you for subscribing!");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="bg-primary py-16">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif mb-3 text-white">Join Our Newsletter</h2>
          <p className="text-white/80 mb-8">
            Subscribe to receive Ayurvedic beauty tips, exclusive offers, and updates on new products.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button 
              type="submit" 
              className="bg-ayurveda-amber hover:bg-amber-600 text-primary-900 font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          
          <p className="text-white/60 text-sm mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive our marketing emails.
            You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Subscribe;
