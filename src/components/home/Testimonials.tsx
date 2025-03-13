
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

// Testimonial data - would come from API in a real app
const testimonials = [
  {
    id: 1,
    name: "Priya M.",
    avatar: "https://i.pravatar.cc/150?img=29",
    rating: 5,
    text: "The Bhringraj hair oil has completely transformed my hair. After years of damage, my hair finally feels strong and healthy again!",
  },
  {
    id: 2,
    name: "David K.",
    avatar: "https://i.pravatar.cc/150?img=53",
    rating: 5,
    text: "I've struggled with sensitive skin for years. The neem face wash is the first product that has cleared my skin without any irritation.",
  },
  {
    id: 3,
    name: "Sarah J.",
    avatar: "https://i.pravatar.cc/150?img=47",
    rating: 4,
    text: "The turmeric glow serum gives my skin the most beautiful natural radiance. I receive compliments all the time!",
  },
  {
    id: 4,
    name: "Amir H.",
    avatar: "https://i.pravatar.cc/150?img=68",
    rating: 5,
    text: "After discovering these products, I've completely switched all my skincare to ayurvedic formulations. My skin has never looked better.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-ayurveda-cream/50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif mb-3 text-primary-900">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover why our customers love our authentic Ayurvedic beauty products
          </p>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <Card className="h-full border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < testimonial.rating ? "fill-ayurveda-amber text-ayurveda-amber" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <p className="text-foreground italic mb-6">{testimonial.text}</p>
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <span className="font-medium">{testimonial.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="relative mr-2 inset-auto" />
            <CarouselNext className="relative ml-2 inset-auto" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
