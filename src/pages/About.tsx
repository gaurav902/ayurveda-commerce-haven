import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-6">About Tell Me India</h1>
          
          <div className="mb-8">
            <img 
              src="https://vediherbals.com/cdn/shop/articles/AyurvedaHistory.jpg?v=1739768432" 
              alt="Tell Me India" 
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-serif font-bold mt-8 mb-4">Swastha: A Journey Towards Wholeness</h2>
            <p>
              <strong>Ayurveda</strong>, the ancient Indian “science of life” (Sanskrit: <strong>Ayur</strong> – life, <strong>Veda</strong> – knowledge), forms the cornerstone of our approach to wellbeing. It emphasizes <strong>Swastha</strong> (Sanskrit for “wholeness”), a state where mind, body, and spirit exist in perfect harmony.
            </p>
            <blockquote className="border-l-4 pl-4 text-lg italic">
              <p>As the <strong>Charaka Samhita</strong>, a foundational Ayurvedic text, beautifully states:</p>
              <p className="font-bold">” स्वस्थ स्थिरता सुखं आत्मवत् संच संतोष हितं च अर्थो च सुखं आयु च लभेत  ” (चरक संहिता)</p>
              <p>This translates to: “Through <strong>Swastha</strong> (wholeness), one finds stability, happiness, self-realization, contentment, fulfillment of desires, and a long and healthy life.”</p>
            </blockquote>
            <p>
              Following the wisdom of the <strong>rishis</strong> (Sanskrit for “seers”) and drawing from ancient <strong>Vedic texts</strong> like the <strong>Charaka Samhita</strong>, we explore the profound connection between nature’s bounty and our inner well-being.
            </p>
            
            <h2 className="text-2xl font-serif font-bold mt-8 mb-4">About Us: Unveiling Bharat's Timeless Treasures</h2>
            <p>
              At <strong>Tell Me India</strong>, we embark on a captivating quest – <em>“to unlock the wisdom of our ancestors, the revered <strong>rishis</strong>, and unveil the forgotten brilliance of <strong>Bharat</strong>’s (India’s) ancient technologies.”</em> We weave these timeless treasures into the vibrant fabric of modern life, fostering a future rich in heritage, yet attuned to the ever-evolving needs of today.
            </p>
            <p>
              This is not a mere echo of the past, but a symphony of innovation orchestrated by tradition. We are the architects of a tomorrow where the essence of our legacy resonates, illuminating the path towards a brighter future.
            </p>
            <p>
              Join us on this transformative <strong>yatra</strong> (sacred journey) – a pilgrimage of revitalization and progress. Together, bathed in the ancient light of <strong>Vedic wisdom</strong>, we shall illuminate the path to a brighter tomorrow.
            </p>
            
            <h2 className="text-2xl font-serif font-bold mt-8 mb-4 text-center">Our Mission</h2>
            <p className="text-center">
              <strong>Tell Me India</strong> bridges the ancient wisdom of <strong>Bharat</strong> with the dynamism of today. We revive forgotten technologies, reimagine their potential, and rejuvenate lives through holistic well-being (<strong>Swastha</strong>). Join us on this transformative journey!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-bold mb-2">Unveiling Ancient Wisdom</h3>
                <p><strong>Unlock</strong> the brilliance of <strong>Bharat</strong>’s forgotten technologies for a richer future.</p>
              </div>
              <div className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-bold mb-2">Swastha: Your Ayurvedic Journey</h3>
                <p>Find <strong>wholeness</strong> through personalized Ayurvedic practices for optimal health.</p>
              </div>
              <div className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-bold mb-2">Yatra: A Path to Progress</h3>
                <p>Join us on a <strong>transformative voyage</strong> towards a brighter tomorrow.</p>
              </div>
            </div>
            
            <div className="mt-10 flex justify-center">
              <Button className="bg-primary hover:bg-primary-600 text-white text-lg px-6 py-3 rounded-lg shadow-lg" asChild>
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