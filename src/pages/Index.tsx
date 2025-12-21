import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import { Footer } from "@/components/Footer";
import { Facebook, Instagram, Music2, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const socialLinks = [
  { name: "Facebook", icon: <Facebook className="h-5 w-5" />, url: "https://www.facebook.com/profile.php?id=100027587995370" },
  { name: "Instagram", icon: <Instagram className="h-5 w-5" />, url: "https://www.instagram.com/hangakademia" },
  { name: "YouTube", icon: <Youtube className="h-5 w-5" />, url: "" },
  { name: "TikTok", icon: <Music2 className="h-5 w-5" />, url: "" },
];

const Index = () => {
  const { t } = useTranslation();

  // Updated categories with the full curated order from the Categories page
  const categories = [
    { id: "gongok", slug: "gongok", title: "Gongok", image: "/images/vizjeles_logo.webp" },
    { id: "hangvillak", slug: "hangvillak", title: "Hangvillák", image: "/images/vizjeles_logo.webp" },
    { id: "himalajai-hangtalak", slug: "himalajai-hangtalak", title: "Himalájai Hangtálak", image: "/images/vizjeles_logo.webp" },
    { id: "kristaly-hangtalak-es-kelyhek", slug: "kristaly-hangtalak-es-kelyhek", title: "Kristályhangtálak és kelyhek", image: "/images/vizjeles_logo.webp" },
    { id: "kalimbak", slug: "kalimbak", title: "Kalimbák", image: "/images/vizjeles_logo.webp" },
    { id: "handpanak", slug: "handpanak", title: "Handpanak", image: "/images/vizjeles_logo.webp" },
    { id: "acel-nyelvdobok", slug: "acel-nyelvdobok", title: "Acél Nyelvdobok", image: "/images/vizjeles_logo.webp" },
    { id: "dobok", slug: "dobok", title: "Dobok", image: "/images/vizjeles_logo.webp" },
    { id: "chimeok-hangjatekok", slug: "chimeok-hangjatekok", title: "Chimeok-Hangjátékok", image: "/images/vizjeles_logo.webp" },
    { id: "hang-effektek", slug: "hang-effektek", title: "Hang effektek", image: "/images/vizjeles_logo.webp" },
    { id: "didgeridoo", slug: "didgeridoo", title: "Didgeridoo", image: "/images/vizjeles_logo.webp" },
    { id: "energia-rudak", slug: "energia-rudak", title: "Energia rudak", image: "/images/vizjeles_logo.webp" },
    { id: "udok-dorzsfak", slug: "udok-dorzsfak", title: "Üdők, dörzsfák", image: "/images/vizjeles_logo.webp" },
    { id: "taskak-tokok-huzatok", slug: "taskak-tokok-huzatok", title: "Táskák, tokok, huzatok", image: "/images/vizjeles_logo.webp" },
    { id: "allvanyok", slug: "allvanyok", title: "Állványok", image: "/images/vizjeles_logo.webp" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Hero />

      {/* Promo Section */}
      <section className="container py-16 bg-background w-full max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center">{t("promo.title", "Miért a Hangakadémia®?")}</h2>
        <div className="mb-8 text-lg text-gray-700 space-y-2 leading-relaxed">
          <p>{t("promo.benefit1", "Prémium minőségű, gondosan válogatott hangszerek – szakmai háttérrel.")}</p>
          <p>{t("promo.background1", "A Hangakadémia® nem csupán egy webshop.")}</p>
          <p>
            {t(
              "promo.background2",
              "Minden hangtálat és hangszert személyesen válogatunk, kipróbálunk és szakmai szempontok alapján ajánlunk."
            )}
          </p>
          <p>
            {t(
              "promo.partnership",
              "A Hangakadémia® a Meinl Sonic Energy hivatalos szakmai partnere, alapítója, Pál Adrienn, Magyarország hivatalos Meinl Sonic Energy szakmai nagykövete."
            )}
          </p>
          <p>{t("promo.value", "Nálunk nem csak eszközt vásárolsz – útmutatást, tudást és megbízható szakmai hátteret is kapsz.")}</p>
        </div>
        <div className="text-center">
          <Link to="https://hangakademia.hu" target="_blank" rel="noopener noreferrer">
            <button className="bg-primary text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-primary/90 transition">
              {t("promo.cta", "👉 Ismerd meg a Hangakadémiát® és a Meinl Sonic Energy Magyarországi Nagykövetét")}
            </button>
          </Link>
          {/* Guarantees */}
          <div className="mt-6 rounded-2xl border bg-card p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg border p-3">
                <div className="font-semibold">100% elégedettségi garancia</div>
                <div className="text-foreground/70">Biztonságos vásárlás, gondtalan döntés.</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="font-semibold">Ingyenes szállítás 30 000 Ft felett</div>
                <div className="text-foreground/70">Gyors és megbízható kézbesítés.</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="font-semibold">Meinl Sonic Energy nagykövet ajánlásával</div>
                <div className="text-foreground/70">Ajánlott választás a közösségben.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold mb-8">{t("categories.title", "Válogass prémium kategóriáinkból")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link key={category.id} to={`/products?category=${category.slug}`}>
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
