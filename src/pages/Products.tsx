import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useTranslation } from "react-i18next";
import { CATEGORY_ORDER_MAP, KNOWN_CATEGORIES } from "@/constants/categories";

interface Product {
  id: number;
  name: string;
  type?: string;
  price: string;
  weight?: string;
  featured?: boolean;
  regular_price?: string;
  sale_price?: string;
  description?: string;
  short_description?: string;
  stock_status?: string;
  categories: { id: number; name: string; slug: string }[];
  images: { id: number; src: string }[];
  attributes?: { id: number; name: string; options: string[] }[];
  date_created?: string;
  total_sales?: number;
  meta_data?: { key: string; value: string }[];
}

interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

interface ProductsProps {
  onAddToCart: (product: Product) => void;
  setPageLoading: (loading: boolean) => void;
  defaultCategory?: string;
}

const VISIBLE_INCREMENT = 10;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const PRODUCT_CACHE_KEY = "woo_products_cache";
const CATEGORY_CACHE_KEY = "woo_categories_cache";

const WEIGHT_RANGES = [
  { key: "all", min: 0, max: Infinity },
  { key: "0-500", min: 0, max: 500 },
  { key: "500-1000", min: 500, max: 1000 },
  { key: "1000-1500", min: 1000, max: 1500 },
  { key: "1500-2000", min: 1500, max: 2000 },
  { key: "2000-3000", min: 2000, max: 3000 },
  { key: "3000-5000", min: 3000, max: 5000 },
];

const PITCHES = ["C", "D", "E", "F", "G", "A", "B/H"] as const;

const getCachedData = <T,>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached) as { timestamp: number; data: T };
    if (Date.now() - parsed.timestamp < CACHE_DURATION) {
      return parsed.data;
    }
  } catch (error) {
    console.warn(`Failed to parse cache for ${key}`, error);
  }

  return null;
};

  const setCache = <T,>(key: string, data: T) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  };

type PriceRange = { key: string; label: string; min: number; max: number };

const Products = ({ onAddToCart, setPageLoading, defaultCategory }: ProductsProps) => {
  const { t } = useTranslation();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRangeKey, setSelectedPriceRangeKey] = useState("all");
  const [selectedWeightRangeKey, setSelectedWeightRangeKey] = useState("all");
  const [selectedPitch, setSelectedPitch] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<{ key: string; label: string }[]>([]);
  const [visibleCount, setVisibleCount] = useState(VISIBLE_INCREMENT);

  // priceRanges depends on i18n (t), so memoize it to avoid recreating each render
  const priceRanges: PriceRange[] = useMemo(
    () => [
      { key: "all", label: t("products.filters.allPrices", "All Prices"), min: 0, max: Infinity },
      { key: "0-10000", label: "0 - 10 000 Ft", min: 0, max: 10000 },
      { key: "10000-30000", label: "10 000 - 30 000 Ft", min: 10000, max: 30000 },
      { key: "30000-60000", label: "30 000 - 60 000 Ft", min: 30000, max: 60000 },
      { key: "60000-100000", label: "60 000 - 100 000 Ft", min: 60000, max: 100000 },
      { key: "100000-200000", label: "100 000 - 200 000 Ft", min: 100000, max: 200000 },
      { key: "200000-1000000", label: "200 000 Ft+", min: 200000, max: 1000000 },
    ],
    [t]
  );

  const knownCategoryBySlug = useMemo(
    () => new Map(KNOWN_CATEGORIES.map((category) => [category.slug, category] as const)),
    []
  );

  // ✅ FIX: keep only ONE selectedPriceRange (derived from selectedPriceRangeKey)
  const selectedPriceRange = useMemo(
    () => priceRanges.find((range) => range.key === selectedPriceRangeKey) ?? priceRanges[0],
    [priceRanges, selectedPriceRangeKey]
  );

  const consumerKey = import.meta.env.VITE_WOO_CONSUMER_KEY;
  const consumerSecret = import.meta.env.VITE_WOO_CONSUMER_SECRET;
  const apiUrl = import.meta.env.VITE_WOO_API_URL;
  const auth = btoa(`${consumerKey}:${consumerSecret}`);

  const prevDeps = useRef({
    searchTerm,
    selectedCategory,
    selectedPriceRangeKey,
    selectedWeightRangeKey,
    selectedPitch,
    sortBy,
  });

  const normalizePitch = useCallback((pitch?: string) => {
    if (!pitch) return null;
    const normalized = pitch.trim().toUpperCase();
    if (normalized === "B" || normalized === "H") return "B/H";
    return PITCHES.includes(normalized as (typeof PITCHES)[number]) ? normalized : null;
  }, []);

  const getProductPitch = useCallback(
    (product: Product) => {
      const attributePitch = product.attributes?.find((attr) => /hang|note|pitch/i.test(attr.name))?.options?.[0];
      const metaPitch = product.meta_data?.find((m) => /hang|note|pitch/i.test(m.key))?.value;
      return normalizePitch(String(attributePitch || metaPitch || ""));
    },
    [normalizePitch]
  );

  const getProductWeight = useCallback((product: Product) => {
    const weightValue = product.weight || product.meta_data?.find((m) => /weight/i.test(m.key))?.value;
    const parsed = weightValue ? parseFloat(String(weightValue).replace(/[^0-9.]/g, "")) : NaN;
    return Number.isNaN(parsed) ? null : parsed;
  }, []);

  const sortCategoriesByOrder = useCallback(
    (list: { key: string; label: string }[]) => {
      if (!list.length) return list;
      const [first, ...rest] = list;

      const sortedRest = [...rest].sort((a, b) => {
        const aIndex = CATEGORY_ORDER_MAP.get(a.key);
        const bIndex = CATEGORY_ORDER_MAP.get(b.key);

        if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
        if (aIndex !== undefined) return -1;
        if (bIndex !== undefined) return 1;
        return a.label.localeCompare(b.label);
      });

      return [{ ...first, label: t("products.filters.all") || first.label }, ...sortedRest];
    },
    [t]
  );

  useEffect(() => {
    setCategories((prev) => sortCategoriesByOrder(prev));
  }, [sortCategoriesByOrder, t]);

  // Set category from URL or defaultCategory
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCategory = params.get("category");
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else if (defaultCategory) {
      setSelectedCategory(defaultCategory);
      params.set("category", defaultCategory);
      window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
    }
  }, [defaultCategory]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cachedCategories = getCachedData<ProductCategory[]>(CATEGORY_CACHE_KEY);

        if (cachedCategories) {
          setCategories(
            sortCategoriesByOrder([
              { key: "all", label: t("products.filters.all") || "All Categories" },
              ...cachedCategories.map((cat) => ({
                key: cat.slug,
                label: knownCategoryBySlug.get(cat.slug)?.name || cat.name,
              })),
            ])
          );
        }

        const res = await fetch(`${apiUrl}/products/categories`, {
          headers: { Authorization: `Basic ${auth}` },
        });

        const data: ProductCategory[] = await res.json();

        setCategories(
          sortCategoriesByOrder([
            { key: "all", label: t("products.filters.all") || "All Categories" },
            ...data.map((cat) => ({
              key: cat.slug,
              label: knownCategoryBySlug.get(cat.slug)?.name || cat.name,
            })),
          ])
        );

        setCache(CATEGORY_CACHE_KEY, data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, [apiUrl, auth, knownCategoryBySlug, sortCategoriesByOrder, t]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setPageLoading(true);
        const cachedProducts = getCachedData<Product[]>(PRODUCT_CACHE_KEY);

        if (cachedProducts) {
          setProducts(cachedProducts);
          setLoading(false);
        }

        const res = await fetch(`${apiUrl}/products?per_page=100`, {
          headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch products");

        const data: Product[] = await res.json();

        const updatedData = await Promise.all(
          data.map(async (product) => {
            if (product.type === "grouped") {
              try {
                const groupRes = await fetch(`${apiUrl}/products/${product.id}`, {
                  headers: { Authorization: `Basic ${auth}` },
                });
                const groupData = await groupRes.json();
                const childPrices = groupData.grouped_products_prices || [];

                if (childPrices.length > 0) {
                  const minPrice = Math.min(...childPrices.map((p: number) => parseFloat(String(p))));
                  return { ...product, price: minPrice.toString() };
                }
              } catch (err) {
                console.error(`Failed to fetch grouped product ${product.id}`, err);
              }
            }
            return product;
          })
        );

        setProducts(updatedData);
        setCache(PRODUCT_CACHE_KEY, updatedData);
        setLoading(false);
        setPageLoading(false);
      } catch (err) {
        console.error(err);
        setError(t("products.error", "Failed to fetch products."));
        setLoading(false);
        setPageLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl, auth, setPageLoading, t]);

  // Filtering logic
  useEffect(() => {
    const weightRange = WEIGHT_RANGES.find((range) => range.key === selectedWeightRangeKey) || WEIGHT_RANGES[0];

    const filtered = products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" || product.categories?.some((c) => c.slug === selectedCategory);

        const matchesPrice =
          parseFloat(product.price) >= selectedPriceRange.min && parseFloat(product.price) <= selectedPriceRange.max;

        const weight = getProductWeight(product);
        const matchesWeight =
          selectedWeightRangeKey === "all" ||
          (weight !== null && weight >= weightRange.min && weight < weightRange.max);

        const pitch = getProductPitch(product);
        const matchesPitch = selectedPitch === "all" || pitch === selectedPitch;

        return matchesSearch && matchesCategory && matchesPrice && matchesWeight && matchesPitch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return parseFloat(a.price) - parseFloat(b.price);
          case "price-high":
            return parseFloat(b.price) - parseFloat(a.price);
          case "popular":
            return (b.total_sales || 0) - (a.total_sales || 0);
          case "newest":
            return new Date(b.date_created || 0).getTime() - new Date(a.date_created || 0).getTime();
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      });

    const hasFilterChanged =
      prevDeps.current.searchTerm !== searchTerm ||
      prevDeps.current.selectedCategory !== selectedCategory ||
      prevDeps.current.selectedPriceRangeKey !== selectedPriceRangeKey ||
      prevDeps.current.sortBy !== sortBy ||
      prevDeps.current.selectedWeightRangeKey !== selectedWeightRangeKey ||
      prevDeps.current.selectedPitch !== selectedPitch;

    if (hasFilterChanged) {
      setVisibleCount(VISIBLE_INCREMENT);
    }

    prevDeps.current = {
      searchTerm,
      selectedCategory,
      selectedPriceRangeKey,
      selectedWeightRangeKey,
      selectedPitch,
      sortBy,
    };

    setFilteredProducts(filtered);

    // Update URL when category changes
    const params = new URLSearchParams(window.location.search);
    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  }, [
    getProductPitch,
    getProductWeight,
    products,
    searchTerm,
    selectedCategory,
    selectedPriceRange,
    selectedPriceRangeKey,
    selectedWeightRangeKey,
    selectedPitch,
    sortBy,
  ]);

  const weightCounts = useMemo(() => {
    const baseFiltered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.categories?.some((c) => c.slug === selectedCategory);

      const matchesPrice =
        parseFloat(product.price) >= selectedPriceRange.min && parseFloat(product.price) <= selectedPriceRange.max;

      const pitch = getProductPitch(product);
      const matchesPitch = selectedPitch === "all" || pitch === selectedPitch;

      return matchesSearch && matchesCategory && matchesPrice && matchesPitch;
    });

    const counts: Record<string, number> = {};
    WEIGHT_RANGES.forEach((range) => {
      if (range.key === "all") return;
      counts[range.key] = baseFiltered.filter((product) => {
        const weight = getProductWeight(product);
        return weight !== null && weight >= range.min && weight < range.max;
      }).length;
    });
    return counts;
  }, [getProductPitch, getProductWeight, products, searchTerm, selectedCategory, selectedPriceRange, selectedPitch]);

  if (loading) return <div className="p-12 text-center">{t("products.loading", "Loading products...")}</div>;
  if (error) return <div className="p-12 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <Navbar />
      <main className="flex-grow">
        <div className="flex flex-col md:flex-row p-4 gap-6">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder={t("products.search") || "Search products..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              >
                {categories.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedPriceRangeKey}
                onChange={(e) => setSelectedPriceRangeKey(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              >
                {priceRanges.map((range) => (
                  <option key={range.key} value={range.key}>
                    {range.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedWeightRangeKey}
                onChange={(e) => setSelectedWeightRangeKey(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              >
                <option value="all">{t("products.filters.allWeights", "All weights")}</option>
                {WEIGHT_RANGES.filter((r) => r.key !== "all").map((range) => (
                  <option key={range.key} value={range.key}>
                    {t(`products.filters.weight.${range.key}`)} ({weightCounts[range.key] ?? 0})
                  </option>
                ))}
              </select>

              <select
                value={selectedPitch}
                onChange={(e) => setSelectedPitch(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              >
                <option value="all">{t("products.filters.allPitches", "All pitches")}</option>
                {PITCHES.map((pitch) => (
                  <option key={pitch} value={pitch}>
                    {t(`products.filters.pitch.${pitch}`, pitch)}
                  </option>
                ))}
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border px-3 py-2 rounded w-full">
                <option value="featured">{t("products.filters.featured", "featured")}</option>
                <option value="popular">{t("products.filters.popular", "Most popular")}</option>
                <option value="newest">{t("products.filters.newest", "Newest")}</option>
                <option value="price-low">{t("products.filters.priceLowHigh", "priceLowHigh")}</option>
                <option value="price-high">{t("products.filters.priceHighLow", "priceHighLow")}</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-grow">
            <div
              className={`grid ${
                viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "grid-cols-1"
              } p-1`}
            >
              {filteredProducts.slice(0, visibleCount).map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.name}
                  price={parseFloat(product.price)}
                  image={product.images?.[0]?.src || "/placeholder.jpg"}
                  available={product.stock_status === "instock"}
                  id={String(product.id)}
                  description={product.short_description || product.description}
                  onAddToCart={() => onAddToCart(product)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {filteredProducts.length > visibleCount && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount((prevCount) => prevCount + VISIBLE_INCREMENT)}
                  className="bg-primary text-primary-foreground font-bold py-2 px-6 rounded-lg shadow-md hover:bg-primary-foreground hover:text-primary transition-colors duration-200"
                >
                  {t("products.loadMore", "Load More")}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
