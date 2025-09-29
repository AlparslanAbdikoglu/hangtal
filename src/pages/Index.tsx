import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import { Footer } from "@/components/Footer";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const socialLinks = [
  { name: "Facebook", icon: <Facebook className="h-5 w-5" />, url: "https://facebook.com/meinlsonic" },
  { name: "Instagram", icon: <Instagram className="h-5 w-5" />, url: "https://instagram.com/meinlsonic" },
  { name: "YouTube", icon: <Youtube className="h-5 w-5" />, url: "https://youtube.com/meinlsonic" },
];

const Index = () => {
  const { t } = useTranslation();

  const categories = [
    { title: t("categories.handpans", "Handpans"), image: "/images/hangtal.jpg" },
    { title: t("categories.steelTongueDrums", "Steel Tongue Drums"), image: "/images/thumbnail1.jpg" },
    { title: t("categories.kalimbas", "Kalimbas"), image: "/images/webshop2.jpg" },
    { title: t("categories.crystalSingingBowls", "Crystal Singing Bowls"), image: "/images/webshop4.jpg" },
    { title: t("categories.crystalSingingChalices", "Crystal Singing Chalices"), image: "/images/thumbnail3.jpg" },
    { title: t("categories.singingBowls", "Singing Bowls"), image: "/images/webshop.jpg" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Hero />

      {/* Promo Section */}
      <section className="container py-16 bg-background w-full text-center max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">
          {t("promo.title", "Miért válassz minket?")}
        </h2>
        <div className="mb-8 text-lg text-gray-700 max-w-lg mx-auto space-y-6">
          <p>
            {t(
              "promo.intro",
              "Fedezd fel gondosan válogatott, kézzel készített hangszereink és egyedi alkotásaink világát."
            )}
          </p>
          <ul className="list-none space-y-2 text-left">
            <li>🔔 {t("promo.point1", "Minőségi, válogatott hangszerek")}</li>
            <li>🌿 {t("promo.point2", "Szakértői útmutatás és oktatás")}</li>
            <li>
              ✨ {t("promo.point3", "Egyedi táblázatok, leírások a hangtálak mellé – csak nálunk")}
            </li>
            <li>📦 {t("promo.point4", "Gyors, biztonságos szállítás")}</li>
          </ul>
          <p>
            {t(
              "promo.outro",
              "Engedd, hogy a hangok ereje belépjen a mindennapjaidba  válassz most webshopunk kínálatából."
            )}
          </p>
        </div>
        <Link to="https://hangakademia.hu" target="_blank" rel="noopener noreferrer">
          <button className="bg-primary text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-primary/90 transition">
            {t("promo.cta", "Nagykövet megtekintése")}
          </button>
        </Link>
      </section>

      {/* Categories Section */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold mb-8">{t("categories.title", "Kategóriák")}</h2>
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

      {/* Social Links Section */}
      <section className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-6">{t("footer.followUs", "Kövess minket")}</h2>
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
