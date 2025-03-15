
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

// Step content for different scenarios
const dashboardSteps = [
  {
    title: "Welcome to Your Dashboard",
    description: "This is your personal hub for managing orders, profile, and exploring Ayurveda Haven products.",
    element: null,
  },
  {
    title: "Your Orders",
    description: "Track all your orders in one place. See order status, history, and details of past purchases.",
    element: "dashboard-orders",
  },
  {
    title: "Profile Settings",
    description: "Update your personal information, shipping addresses, and account preferences here.",
    element: "dashboard-profile",
  },
  {
    title: "Shopping Wishlist",
    description: "View and manage products you've saved for future purchases.",
    element: "dashboard-wishlist",
  },
  {
    title: "Payment Methods",
    description: "Manage your saved payment methods for faster checkout.",
    element: "dashboard-payments",
  },
  {
    title: "Get Started",
    description: "Explore your dashboard and enjoy your Ayurveda Haven experience!",
    element: null,
  },
];

const checkoutSteps = [
  {
    title: "Welcome to Checkout",
    description: "Complete your purchase by following these simple steps.",
    element: null,
  },
  {
    title: "Review Your Cart",
    description: "Verify the items in your cart before proceeding with payment.",
    element: "checkout-cart-summary",
  },
  {
    title: "Shipping Information",
    description: "Enter or select your shipping address where you'd like your products delivered.",
    element: "checkout-shipping",
  },
  {
    title: "Payment Method",
    description: "Select your preferred payment method to complete your purchase securely.",
    element: "checkout-payment",
  },
  {
    title: "Complete Order",
    description: "Review all details and confirm your order.",
    element: "checkout-submit",
  },
];

const OnboardingGuide = () => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [steps, setSteps] = useState(dashboardSteps);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Determine which steps to use based on the current path
    const currentPath = location.pathname;
    
    if (currentPath.includes('/dashboard')) {
      setSteps(dashboardSteps);
    } else if (currentPath.includes('/checkout') || currentPath.includes('/cart')) {
      setSteps(checkoutSteps);
    }

    // Open guide automatically in specific conditions
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
    const showOnDashboard = currentPath.includes('/dashboard') && !localStorage.getItem("dashboardGuideShown");
    const showOnCheckout = (currentPath.includes('/checkout') || currentPath.includes('/cart')) && !localStorage.getItem("checkoutGuideShown");
    
    if (showOnDashboard && user) {
      setOpen(true);
      localStorage.setItem("dashboardGuideShown", "true");
    } else if (showOnCheckout) {
      // For checkout/cart, check if user is logged in
      if (!user) {
        // Redirect to login if not logged in
        navigate('/login', { state: { from: location } });
        return;
      }
      setOpen(true);
      localStorage.setItem("checkoutGuideShown", "true");
    }
    
    // For first time visitors, set the flag
    if (!hasVisitedBefore) {
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, [location.pathname, user, navigate, location]);

  useEffect(() => {
    // Highlight the relevant element when step changes
    if (open && steps[currentStep]?.element) {
      setHighlight(steps[currentStep].element);
      
      // Scroll to element if needed
      const element = document.getElementById(steps[currentStep].element);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      setHighlight(null);
    }

    return () => {
      setHighlight(null);
    };
  }, [currentStep, open, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentStep(0);
    setHighlight(null);
  };

  // Add a highlight effect to the targeted element
  useEffect(() => {
    if (highlight) {
      const element = document.getElementById(highlight);
      if (element) {
        element.classList.add("onboarding-highlight");
      }

      return () => {
        if (element) {
          element.classList.remove("onboarding-highlight");
        }
      };
    }
  }, [highlight]);

  // Only show on dashboard or cart/checkout pages
  const showGuideButton = location.pathname.includes('/dashboard') || 
                          location.pathname.includes('/cart') || 
                          location.pathname.includes('/checkout');

  return (
    <>
      {/* Add a global style for highlighted elements */}
      <style>
        {`
        .onboarding-highlight {
          position: relative;
          z-index: 100;
          animation: pulse 2s infinite;
          box-shadow: 0 0 0 10px rgba(216, 164, 92, 0.3);
          border-radius: 4px;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(216, 164, 92, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(216, 164, 92, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(216, 164, 92, 0);
          }
        }
        `}
      </style>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{steps[currentStep]?.title}</DialogTitle>
            <DialogDescription>
              {steps[currentStep]?.description}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex-1"
              >
                Previous
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1 bg-primary"
              >
                {currentStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
            <Button
              variant="ghost"
              onClick={handleClose}
              size="sm"
              className="sm:self-end"
            >
              Skip Tour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Button to restart the tour - only shown on relevant pages */}
      {showGuideButton && (
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50"
          onClick={() => setOpen(true)}
        >
          Website Guide
        </Button>
      )}
    </>
  );
};

export default OnboardingGuide;
