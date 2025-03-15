
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiveNotifications, setReceiveNotifications] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert the subscription into the database
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email, 
          receive_notifications: receiveNotifications 
        });

      if (error) {
        if (error.code === '23505') {
          toast.error("You're already subscribed to our newsletter");
        } else {
          console.error("Error saving subscription:", error);
          toast.error("Failed to subscribe. Please try again later.");
        }
      } else {
        toast.success("Thank you for subscribing!");
        setEmail("");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-primary py-16">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif mb-3 text-white">Join Our Newsletter</h2>
          <p className="text-white/80 mb-8">
            Subscribe to receive Ayurvedic beauty tips, exclusive offers, and updates on new products.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
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
            </div>
            
            <div className="flex items-center space-x-2 text-white/80 self-start mt-2">
              <Checkbox 
                id="notifications" 
                checked={receiveNotifications}
                onCheckedChange={(checked) => setReceiveNotifications(checked === true)}
                className="border-white/50 data-[state=checked]:bg-ayurveda-amber data-[state=checked]:text-primary"
              />
              <label htmlFor="notifications" className="text-sm cursor-pointer">
                Receive notifications about new products and offers
              </label>
            </div>
          
            <p className="text-white/60 text-sm mt-2">
              By subscribing, you agree to our <a href="/policies/privacy" className="underline hover:text-white">Privacy Policy</a> and consent to receive our marketing emails.
              You can unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Subscribe;
