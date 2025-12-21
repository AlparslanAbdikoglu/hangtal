import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { CATEGORY_ORDER_MAP, KNOWN_CATEGORIES } from "@/constants/categories";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: { src: string };
  parent: number;
  count: number;
}

const placeholderImage =
  "https://placehold.co/400x300/dfd6c5/4A3C31?text=Nincs+k%C3%A9p";

const hardcodedImages: Record<string, string> = {
  handpans: "https://zvukovaakademia.sk/wp-content/uploads/2025/09/handpan-stand.jpg",
};

const KNOWN_CATEGORY_BY_SLUG = new Map(
  KNOWN_CATEGORIES.map((category) => [category.slug, category] as const)
);

const stripHtml = (html?: string) =>
  (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const normalize = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[–—−]/g, "-")
    .replace(/&/g, "es")
    .replace(/[,/]/g, " ")
    .replace(/\s+/g, " ");

const sortByCustomOrder = (cats: Category[]) =>
  [...cats].sort((a, b) => {
    const ai = CATEGORY_ORDER_MAP.get(a.slug);
    const bi = CATEGORY_ORDER_MAP.get(b.slug);
    if (ai !== undefined && bi !== undefined) return ai - bi;
    if (ai !== undefined) return -1;
    if (bi !== undefined) return 1;
    return normalize(a.name).localeCompare(normalize(b.name), "hu");
  });

const sortAlphabeticalHU = (cats: Category[]) =>
  [...cats].sort((a, b) => a.name.localeCompare(b.name, "hu"));

const Categories = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [categories, setCategories] = useState<Category[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [currentParent, setCurrentParent] = useState<Category | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Category[]>([]);

  // hover overlay inside card
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  const consumerKey = import.meta.env.VITE_WOO_CONSUMER_KEY;
  const consumerSecret = import.meta.env.VITE_WOO_CONSUMER_SECRET;
  const apiUrl = import.meta.env.VITE_WOO_API_URL;
  const auth = btoa(`${consumerKey}:${consumerSecret}`);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${apiUrl}/products/categories?per_page=100`, {
          headers: { Authorization: `Basic ${auth}` },
        });
        if (!res.ok) throw new Error("Failed to fetch categories");

        const data: Category[] = await res.json();
        const allCats = data
          .filter((cat) => cat.slug !== "uncategorized")
          .map((cat) => {
            const known = KNOWN_CATEGORY_BY_SLUG.get(cat.slug);
            return {
              ...cat,
              name: known?.name || cat.name,
              image: {
                src: known?.image || hardcodedImages[cat.slug] || cat.image?.src || placeholderImage,
              },
            };
          });

        setCategories(allCats);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(t("categories.fetchError", "Nem sikerült betölteni a kategóriákat."));
      }
    };

    fetchCategories();
  }, [apiUrl, auth, t]);

  const sidebarCategories = useMemo(() => {
    const top = categories?.filter((c) => c.parent === 0) || [];
    return sortByCustomOrder(top);
  }, [categories]);

  // Hovering sidebar drives the center grid (category image + children)
  const { centerCategories, centerTitle } = useMemo(() => {
    if (!categories) return { centerCategories: [], centerTitle: "" };

    if (hoveredCategory) {
      const subs = categories.filter((c) => c.parent === hoveredCategory.id);
      return {
        centerCategories: [hoveredCategory, ...sortAlphabeticalHU(subs)],
        centerTitle: hoveredCategory.name,
      };
    }

    if (currentParent) {
      const subs = categories.filter((c) => c.parent === currentParent.id);
      return {
        centerCategories: [currentParent, ...sortAlphabeticalHU(subs)],
        centerTitle: currentParent.name,
      };
    }

    const top = categories.filter((c) => c.parent === 0);
    return {
      centerCategories: sortByCustomOrder(top),
      centerTitle: t("categories.allCategories", "Összes kategória"),
    };
  }, [categories, hoveredCategory, currentParent, t]);

  const handleCardClick = useCallback(
    (category: Category) => {
      const hasSubs = categories?.some((c) => c.parent === category.id);
      if (hasSubs) {
        setCurrentParent(category);
        setBreadcrumbs((prev) => [...prev, category]);
      } else {
        navigate(`/products?category=${category.slug}`);
      }
    },
    [categories, navigate]
  );

  const handleBackClick = () => {
    if (breadcrumbs.length > 1) {
      const newCrumbs = breadcrumbs.slice(0, -1);
      setCurrentParent(newCrumbs[newCrumbs.length - 1]);
      setBreadcrumbs(newCrumbs);
    } else {
      setBreadcrumbs([]);
      setCurrentParent(null);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow flex">
        <aside className="w-64 bg-muted p-6 border-r border-border" onMouseLeave={() => setHoveredCategory(null)}>
          <h3 className="text-2xl font-bold mb-6">Vásárlás kategória szerint</h3>
          <ul className="space-y-3">
            {sidebarCategories.map((cat) => (
              <li
                key={cat.id}
                className="cursor-pointer py-2 px-4 rounded-lg hover:bg-primary hover:text-primary-foreground"
                onMouseEnter={() => setHoveredCategory(cat)}
                onClick={() => handleCardClick(cat)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex-grow p-8">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center text-sm mb-4">
              {currentParent && (
                <button onClick={handleBackClick} className="flex items-center text-primary">
                  <ArrowLeft size={16} className="mr-1" /> Vissza
                </button>
              )}
            </nav>

            <h1 className="text-4xl font-bold text-center mb-4">{centerTitle}</h1>

            {!categories ? (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-pulse">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col bg-card rounded-xl shadow-lg overflow-hidden">
                    <div className="w-full h-48 bg-muted" />
                    <div className="p-4 flex flex-col items-center text-center">
                      <div className="h-5 w-32 bg-muted rounded mb-2" />
                      <div className="h-4 w-20 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {centerCategories.map((cat) => {
                  const desc = stripHtml(cat.description);
                  const showOverlay = hoveredCardId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      className="cursor-pointer group flex flex-col bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                      onMouseEnter={() => setHoveredCardId(cat.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                      onClick={() => handleCardClick(cat)}
                    >
                      <div className="relative w-full h-48 overflow-hidden">
                        <img
                          src={cat.image?.src || placeholderImage}
                          alt={cat.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />

                        <div
                          className={`absolute inset-0 transition-opacity duration-200 ${
                            showOverlay ? "opacity-100" : "opacity-0"
                          }`}
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.70), rgba(0,0,0,0.25), rgba(0,0,0,0.00))",
                          }}
                        >
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="text-white font-semibold text-base leading-tight">{cat.name}</div>
                            <div className="text-white/90 text-xs mt-1 line-clamp-3">
                              {desc || "Nincs megadva kategória leírás ehhez a kategóriához."}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 flex flex-col items-center text-center">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {cat.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">({cat.count} termék)</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
