
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import FeaturedProduct from "@/components/home/FeaturedProduct";
import AboutSection from "@/components/home/AboutSection";
import Testimonials from "@/components/home/Testimonials";
import Subscribe from "@/components/home/Subscribe";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedProduct />
      <AboutSection />
      <Testimonials />
      <Subscribe />
    </Layout>
  );
};

export default Index;
