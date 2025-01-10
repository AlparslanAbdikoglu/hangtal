import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";

const categories = [
  { title: "Handpans", image: "/placeholder.svg" },
  { title: "Steel Tongue Drums", image: "/placeholder.svg" },
  { title: "Kalimbas", image: "/placeholder.svg" },
  { title: "Crystal Singing Bowls", image: "/placeholder.svg" },
  { title: "Crystal Singing Chalices", image: "/placeholder.svg" },
  { title: "Singing Bowls", image: "/placeholder.svg" },
];

const products = [
  {
    title: "MEINL Sonic Energy 16\" Octave Steel Tongue Drum, D Kurd, 9 Notes, 440 Hz, Lasered Floral Design, Black",
    price: 369.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasVideo: true,
    hasAudio: true,
  },
  {
    title: "MEINL Sonic Energy 16\" Octave Steel Tongue Drum, D Amara, 9 Notes, 440 Hz, Lasered Floral Design, Navy Blue",
    price: 369.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasVideo: true,
    hasAudio: true,
  },
  {
    title: "MEINL Sonic Energy 16\" Octave Steel Tongue Drum, D Kurd, 9 Notes, 440 Hz, Black",
    price: 349.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasVideo: true,
    hasAudio: true,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Hero />
      
      <section className="container py-16">
        <h2 className="text-3xl font-bold mb-8">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>

      <section className="container py-16 bg-muted">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.title} {...product} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;