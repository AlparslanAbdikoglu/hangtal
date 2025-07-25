import { useEffect, useState } from "react";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard"; // You might keep this for future use or delete if unused
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
// Removed carousel imports
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { myStoreHook } from "@/MyStoreContext";

interface Product {
  id: string;
  name: string;
  price: number;
  images?: { src: string }[];
  hasVideo?: boolean;
  hasAudio?: boolean;
}

const categories = [
  { title: "Handpans", image: "/placeholder.svg" },
  { title: "Steel Tongue Drums", image: "/placeholder.svg" },
  { title: "Kalimbas", image: "/placeholder.svg" },
  { title: "Crystal Singing Bowls", image: "/placeholder.svg" },
  { title: "Crystal Singing Chalices", image: "/placeholder.svg" },
  { title: "Singing Bowls", image: "/placeholder.svg" },
];

const socialLinks = [
  {
    name: "Facebook",
    icon: <Facebook className="h-5 w-5" />,
    url: "https://facebook.com/meinlsonic",
  },
  {
    name: "Instagram",
    icon: <Instagram className="h-5 w-5" />,
    url: "https://instagram.com/meinlsonic",
  },
  {
    name: "YouTube",
    icon: <Youtube className="h-5 w-5" />,
    url: "https://youtube.com/meinlsonic",
  },
];

const Index = () => {
  const { t } = useTranslation();
  const { addToCart } = myStoreHook();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("https://api.lifeisnatural.eu/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: Product[] = await res.json();

        // No filtering — use all products
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      title: product.name,
      price: product.price,
      image: product.images?.[0]?.src || "/placeholder.svg",
      product_id: product.id,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Hero />

      {/* Promo Section added at the top instead of carousel */}
      <section className="container py-16 bg-muted rounded-lg text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">
          {t("promo.title", "Discover Our Unique Portfolio")}
        </h2>
        <p className="mb-8 text-lg text-gray-700 max-w-lg mx-auto">
          {t(
            "promo.description",
            "Explore our curated collection of handcrafted instruments and bespoke creations. See the artistry and craftsmanship behind every piece."
          )}
        </p>
        <Link to="/portfolio">
          <button className="bg-primary text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-primary/90 transition">
            {t("promo.cta", "View Portfolio")}
          </button>
        </Link>
      </section>

      <section className="container py-16">
        <h2 className="text-3xl font-bold mb-8">{t("categories.title")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.title}
              to={`/products?category=${encodeURIComponent(category.title)}`}
            >
              <CategoryCard {...category} />
            </Link>
          ))}
        </div>
      </section>

      {/* Removed Featured Products Carousel Section */}

      <section className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-6">{t("footer.followUs")}</h2>
        <div className="flex justify-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary transition-colors"
            >
              <Button variant="ghost" size="icon">
                {link.icon}
                <span className="sr-only">{link.name}</span>
              </Button>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
