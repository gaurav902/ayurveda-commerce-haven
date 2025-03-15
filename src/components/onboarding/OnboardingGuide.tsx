
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Step content for different parts of the site
const steps = [
  {
    title: "Welcome to Ayurveda Haven",
    description: "We're excited to have you here! Let us show you around our website and help you discover the ancient wisdom of Ayurveda.",
    element: null,
  },
  {
    title: "Discover Our Products",
    description: "Browse our complete collection in the Shop section. Filter by category, sort by price, and find the perfect products for your needs.",
    element: "nav-shop",
  },
  {
    title: "Your Account",
    description: "Create an account to save your favorite products, track orders, and enjoy a personalized shopping experience.",
    element: "nav-account",
  },
  {
    title: "Shopping Cart",
    description: "Your cart keeps track of items you want to purchase. View and modify your selections before checkout.",
    element: "nav-cart",
  },
  {
    title: "Featured Products",
    description: "Discover our highlighted products on the home page - these are our best sellers and new arrivals.",
    element: "featured-products",
  },
  {
    title: "Contact & Support",
    description: "Have questions? Our Contact page makes it easy to reach our support team for any assistance you need.",
    element: "nav-contact",
  },
];

const OnboardingGuide = () => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlight, setHighlight] = useState<string | null>(null);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    
    if (!hasVisited) {
      // Open the guide for first-time visitors
      setOpen(true);
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, []);

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
  }, [currentStep, open]);

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

      {/* Button to restart the tour */}
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setOpen(true)}
      >
        Website Guide
      </Button>
    </>
  );
};

export default OnboardingGuide;
