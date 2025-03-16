
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative bg-ayurveda-cream py-16 md:py-24 w-full">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-4 text-primary-900 leading-tight">
            Reviving Ancient Ethics, Redeeming Modern India
            </h1>
            <p className="text-lg mb-8 text-muted-foreground max-w-md">
            Reviving ancient wisdom to enrich modern life—blending tradition with innovation for a future that honors our heritage. Join the journey!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-primary hover:bg-primary-600 text-white" size="lg" asChild>
                <Link to="/shop">Shop Collection</Link>
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary-100" size="lg" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative rounded-lg overflow-hidden aspect-[4/3]">
              <img
                src="https://sevantiinstitute.com/wp-content/uploads/2016/07/Slide3-darken.jpg"
                alt="Ayurvedic botanicals and herbs"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent mix-blend-multiply rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-ayurveda-amber/20 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
    </section>
  );
};

export default Hero;
