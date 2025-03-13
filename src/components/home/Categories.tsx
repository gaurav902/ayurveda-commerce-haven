
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Hair Care",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843",
    description: "Nourish and strengthen your hair with Ayurvedic formulations",
    path: "/category/hair-care",
  },
  {
    id: 2,
    name: "Skin Care",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    description: "Illuminate your skin with natural herbal treatments",
    path: "/category/skin-care",
  },
  {
    id: 3,
    name: "Body Care",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    description: "Pamper your body with gentle, effective Ayurvedic solutions",
    path: "/category/body-care",
  },
  {
    id: 4,
    name: "Wellness",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843",
    description: "Holistic wellness products for inner and outer harmony",
    path: "/category/wellness",
  },
];

const Categories = () => {
  return (
    <section className="py-16 bg-ayurveda-cream/30 w-full">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif mb-3 text-primary-900">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated collections of Ayurvedic beauty and wellness products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.path}
              className="group relative block h-72 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-serif mb-1 group-hover:translate-y-0 translate-y-2 transition-transform duration-200">
                  {category.name}
                </h3>
                <p className="text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.description}
                </p>
                <span className="mt-2 inline-block text-sm font-medium underline text-white/90">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
