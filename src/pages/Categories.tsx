import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: { src: string };
  parent: number;
  count: number;
}

const placeholderImage = "https://placehold.co/400x300/dfd6c5/4A3C31?text=No+Image";
const hardcodedImages: Record<string, string> = {
  handpans: "https://zvukovaakademia.sk/wp-content/uploads/2025/09/handpan-stand.jpg",
};

const Categories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [currentParent, setCurrentParent] = useState<Category | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Category[]>([]);
  const [lastClickedCategory, setLastClickedCategory] = useState<Category | null>(null);

  const consumerKey = import.meta.env.VITE_WOO_CONSUMER_KEY;
  const consumerSecret = import.meta.env.VITE_WOO_CONSUMER_SECRET;
  const apiUrl = import.meta.env.VITE_WOO_API_URL;
  const auth = btoa(`${consumerKey}:${consumerSecret}`);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${apiUrl}/products/categories?per_page=100`, {
          headers: { Authorization: `Basic ${auth}` },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data: Category[] = await res.json();
        const allCats = data
          .filter((cat) => cat.slug !== "uncategorized")
          .map((cat) => ({
            ...cat,
            image: {
              src: hardcodedImages[cat.slug] || cat.image?.src || placeholderImage,
            },
          }));
        setCategories(allCats);
        setError(null);
      } catch (err: unknown) {
        console.error("Error fetching categories:", err);
        const message = err instanceof Error ? err.message : "Error";
        setError(message);
      }
    };

    fetchCategories();
  }, [apiUrl, auth]);

  // Memoize sidebar categories
  const sidebarCategories = useMemo(
    () => categories?.filter((cat) => cat.parent === 0) || [],
    [categories]
  );

  // Derive centerCategories & centerTitle
  const { centerCategories, centerTitle } = useMemo(() => {
    if (!categories) return { centerCategories: [], centerTitle: "" };

    if (hoveredCategory) {
      const subs = categories.filter((cat) => cat.parent === hoveredCategory.id);
      return {
        centerCategories: [hoveredCategory, ...subs],
        centerTitle: subs.length > 0 ? `${hoveredCategory.name} Subcategories` : hoveredCategory.name,
      };
    } else if (currentParent) {
      const subs = categories.filter((cat) => cat.parent === currentParent.id);
      return {
        centerCategories: [currentParent, ...subs],
        centerTitle: currentParent.name,
      };
    }
    return {
      centerCategories: categories.filter((cat) => cat.parent === 0),
      centerTitle: "All Categories",
    };
  }, [categories, hoveredCategory, currentParent]);

  const handleCardClick = useCallback(
    (category: Category) => {
      if (lastClickedCategory && lastClickedCategory.id === category.id) {
        navigate(`/products?category=${category.slug}`);
        setLastClickedCategory(null);
      } else {
        const hasSubs = categories?.some((cat) => cat.parent === category.id);
        if (hasSubs) {
          setCurrentParent(category);
          setBreadcrumbs((prev) => [...prev, category]);
          setLastClickedCategory(category);
        } else {
          navigate(`/products?category=${category.slug}`);
          setLastClickedCategory(null);
        }
      }
    },
    [lastClickedCategory, categories, navigate]
  );

  const handleBackClick = useCallback(() => {
    setLastClickedCategory(null);
    if (breadcrumbs.length > 1) {
      const newCrumbs = breadcrumbs.slice(0, -1);
      setCurrentParent(newCrumbs[newCrumbs.length - 1]);
      setBreadcrumbs(newCrumbs);
    } else {
      setBreadcrumbs([]);
      setCurrentParent(null);
    }
  }, [breadcrumbs]);

  // Skeleton loader (shown before categories load)
  const SkeletonGrid = () => (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-card rounded-xl shadow-lg overflow-hidden"
        >
          <div className="w-full h-48 bg-muted" />
          <div className="p-4 flex flex-col items-center text-center">
            <div className="h-5 w-32 bg-muted rounded mb-2" />
            <div className="h-4 w-20 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700">
        <p className="text-xl text-center">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow flex">
        <aside
          className="w-64 bg-muted p-6 border-r border-border shadow-sm overflow-y-auto"
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <h3 className="text-2xl font-bold mb-6 text-foreground">Shop by Category</h3>
          <ul className="space-y-3">
            {sidebarCategories.map((cat) => (
              <li
                key={cat.id}
                className={`cursor-pointer py-2 px-4 rounded-lg transition-all duration-200 ${
                  hoveredCategory?.id === cat.id
                    ? "bg-primary text-primary-foreground shadow-md font-medium"
                    : "text-foreground hover:bg-muted hover:text-foreground"
                }`}
                onMouseEnter={() => setHoveredCategory(cat)}
                onClick={() => handleCardClick(cat)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex-grow p-8 flex flex-col items-center">
          <div className="max-w-7xl w-full">
            <nav className="flex items-center text-foreground text-sm mb-4">
              {currentParent && (
                <button
                  onClick={handleBackClick}
                  className="flex items-center text-primary hover:text-primary transition-colors"
                >
                  <ArrowLeft size={16} className="mr-1" /> Back
                </button>
              )}
              <span className="ml-2">
                <button
                  onClick={() => {
                    setCurrentParent(null);
                    setBreadcrumbs([]);
                    setLastClickedCategory(null);
                  }}
                  className="hover:underline"
                >
                  All Categories
                </button>
              </span>
              {breadcrumbs.map((crumb) => (
                <span key={crumb.id} className="flex items-center">
                  <ChevronRight size={16} className="mx-1" />
                  <button
                    onClick={() => {
                      const newCrumbs = breadcrumbs.slice(0, breadcrumbs.indexOf(crumb) + 1);
                      setCurrentParent(crumb);
                      setBreadcrumbs(newCrumbs);
                      setLastClickedCategory(null);
                    }}
                    className="hover:underline text-primary"
                  >
                    {crumb.name}
                  </button>
                </span>
              ))}
            </nav>

            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground">
                {centerTitle || "Loading Categories..."}
              </h1>
              <p className="mt-2 text-lg text-foreground">
                Browse our selection of products by category.
              </p>
            </div>

            {categories === null ? (
              <SkeletonGrid />
            ) : (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {centerCategories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleCardClick(cat)}
                    className="cursor-pointer group flex flex-col bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={cat.image?.src || placeholderImage}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 flex flex-col items-center text-center">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      {typeof cat.count === "number" && (
                        <p className="mt-1 text-sm text-foreground">({cat.count} items)</p>
                      )}
                    </div>
                  </div>
                ))}
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
