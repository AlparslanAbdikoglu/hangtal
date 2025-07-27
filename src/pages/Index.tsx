import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import { Footer } from "@/components/Footer";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const categories = [
  { title: "Handpans", image: "/images/item1.jpg" },
  { title: "Steel Tongue Drums", image: "/images/thumbnail1.jpg" },
  { title: "Kalimbas", image: "/images/webshop2.jpg" },
  { title: "Crystal Singing Bowls", image: "/images/webshop4.jpg" },
  { title: "Crystal Singing Chalices", image: "/images/thumbnail3.jpg" },
  { title: "Singing Bowls", image: "/images/webshop.jpg" },
];

const socialLinks = [
  { name: "Facebook", icon: <Facebook className="h-5 w-5" />, url: "https://facebook.com/meinlsonic" },
  { name: "Instagram", icon: <Instagram className="h-5 w-5" />, url: "https://instagram.com/meinlsonic" },
  { name: "YouTube", icon: <Youtube className="h-5 w-5" />, url: "https://youtube.com/meinlsonic" },
];

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Hero />

      <section className="container py-16 bg-muted rounded-lg text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">
          {t("promo.title", "Discover Our Unique Portfolio")}
        </h2>
        <p className="mb-8 text-lg text-gray-700 max-w-lg mx-auto">
          {t(
            "promo.description",
            "Explore our curated collection of handcrafted instruments and bespoke creations. See the artistry and craftsmanship behind every piece Learn how you can experience the healing power of sound."
          )}
        </p>
        <Link to="https://portfolio.zvukovaakademia.sk" target="_blank" rel="noopener noreferrer">
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
