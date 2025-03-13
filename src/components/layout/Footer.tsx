
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-serif mb-4">Ayurveda Haven</h3>
            <p className="text-sm mb-4 text-white/90">
              Embracing the ancient wisdom of Ayurveda to bring harmony and balance to your hair and beauty care routine.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-ayurveda-amber transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-ayurveda-amber transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-ayurveda-amber transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li>
                <Link to="/products" className="hover:text-ayurveda-amber transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-ayurveda-amber transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-ayurveda-amber transition-colors">
                  Ayurvedic Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-ayurveda-amber transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-serif mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li>
                <Link to="/category/hair-care" className="hover:text-ayurveda-amber transition-colors">
                  Hair Care
                </Link>
              </li>
              <li>
                <Link to="/category/skin-care" className="hover:text-ayurveda-amber transition-colors">
                  Skin Care
                </Link>
              </li>
              <li>
                <Link to="/category/body-care" className="hover:text-ayurveda-amber transition-colors">
                  Body Care
                </Link>
              </li>
              <li>
                <Link to="/category/wellness" className="hover:text-ayurveda-amber transition-colors">
                  Wellness
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-serif mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex">
                <MapPin size={18} className="mr-2 flex-shrink-0" />
                <span>123 Ayurveda Way, Harmony Hills, 12345</span>
              </li>
              <li className="flex">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <span>contact@ayurvedahaven.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between">
            <p className="text-sm text-white/70 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Ayurveda Haven. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm text-white/70">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/shipping-policy" className="hover:text-white transition-colors">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
