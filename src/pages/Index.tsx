import { useEffect, useState } from "react";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("https://api.lifeisnatural.eu/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        // Adapt data shape if needed
        const mappedProducts = data.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          price: p.price,
          images: p.images,
          hasVideo: false,  // optional, or derive if available
          hasAudio: false,  // optional, or derive if available
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Hero />

      <section className="container py-16">
        <h2 className="text-3xl font-bold mb-8">{t('categories.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.title} to={`/products?category=${encodeURIComponent(category.title)}`}>
              <CategoryCard {...category} />
            </Link>
          ))}
        </div>
      </section>

      <section className="container py-16 bg-muted">
        <h2 className="text-3xl font-bold mb-8">{t('products.featured')}</h2>
        {loading ? (
          <p className="text-center text-muted-foreground">Loading products...</p>
        ) : (
          <Carousel className="w-full max-w-6xl mx-auto">
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <Link to={`/products/${product.id}`}>
                    <ProductCard
                      id={product.id}
                      title={product.name}
                      price={product.price}
                      image={product.images?.[0]?.src || "/placeholder.svg"}
                      onAddToCart={() => console.log("Add to cart:", product.name)}
                      hasVideo={product.hasVideo}
                      hasAudio={product.hasAudio}
                    />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
        <div className="flex justify-center mt-8">
          <Link to="/products">
            <button className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90">
              {t('products.viewAll') || "View All Products"}
            </button>
          </Link>
        </div>
      </section>

      <section className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-6">{t('footer.followUs')}</h2>
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
