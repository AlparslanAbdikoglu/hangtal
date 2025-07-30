import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useTranslation } from "react-i18next";

interface Product {
  id: number;
  name: string;
  price: string;
  regular_price?: string;
  sale_price?: string;
  description?: string;
  short_description?: string;
  stock_status?: string;
  categories: { id: number; name: string; slug: string }[];
  images: { id: number; src: string }[];
  meta_data?: { key: string; value: string }[];
}

interface ProductsProps {
  onAddToCart: (product: Product) => void;
  setPageLoading: (loading: boolean) => void;
}

const Products = ({ onAddToCart, setPageLoading }: ProductsProps) => {
  const { t } = useTranslation();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState({
    label: "All Prices",
    min: 0,
    max: Infinity,
  });
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categoryKeys = [
    "all",
    "steelTongueDrums",
    "handpans",
    "kalimbas",
    "crystalSingingBowls",
    "singingBowls",
    "windChimes",
  ];

  const categories = categoryKeys.map((key) => ({
    key,
    label: key === "all" ? t("products.filters.all") : t(`categories.${key}`),
  }));

  const priceRanges = [
    { label: t("products.filters.allPrices"), min: 0, max: Infinity },
    { label: t("products.filters.under100"), min: 0, max: 100 },
    { label: t("products.filters.100to500"), min: 100, max: 500 },
    { label: t("products.filters.over500"), min: 500, max: Infinity },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setPageLoading(true);
        const consumerKey = import.meta.env.VITE_WOO_CONSUMER_KEY;
        const consumerSecret = import.meta.env.VITE_WOO_CONSUMER_SECRET;
        const apiUrl = import.meta.env.VITE_WOO_API_URL;

        const auth = btoa(`${consumerKey}:${consumerSecret}`);

        const res = await fetch(`${apiUrl}/products`, {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const data: Product[] = await res.json();
        setProducts(data);
        setLoading(false);
        setPageLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products.");
        setLoading(false);
        setPageLoading(false);
      }
    };

    fetchProducts();
  }, [setPageLoading]);

  useEffect(() => {
    const filtered = products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" ||
          product.categories?.some(
            (c) => c.slug === selectedCategory || c.name === selectedCategory
          );

        const matchesPrice =
          parseFloat(product.price) >= selectedPriceRange.min &&
          parseFloat(product.price) <= selectedPriceRange.max;

        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return parseFloat(a.price) - parseFloat(b.price);
          case "price-high":
            return parseFloat(b.price) - parseFloat(a.price);
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedPriceRange, sortBy]);

  if (loading) return <div className="p-12 text-center">Loading products...</div>;
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
          value={selectedPriceRange.label}
          onChange={(e) => {
            const selected = priceRanges.find((r) => r.label === e.target.value);
            if (selected) setSelectedPriceRange(selected);
          }}
          className="border px-3 py-2 rounded w-full"
        >
          {priceRanges.map((range) => (
            <option key={range.label} value={range.label}>
              {range.label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="featured">{t("products.filters.featured")}</option>
  <option value="price-low">{t("products.filters.priceLowToHigh")}</option>
  <option value="price-high">{t("products.filters.priceHighToLow")}</option>
  <option value="name">{t("products.filters.name")}</option>
        </select>
      </div>
    </div>

    {/* Product Grid */}
    <div className="flex-grow">
      <div className={`grid ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "grid-cols-1"} p-1`}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            title={product.name}
            price={parseFloat(product.price)}
            image={product.images?.[0]?.src || "/placeholder.jpg"}
            hasVideo={product.meta_data?.some((m) => m.key === "has_video" && m.value === "yes")}
            hasAudio={product.meta_data?.some((m) => m.key === "has_audio" && m.value === "yes")}
            available={product.stock_status === "instock"}
            id={String(product.id)}
            description={product.short_description || product.description}
            onAddToCart={() => onAddToCart(product)}
          />
        ))}
      </div>
    </div>
  </div>
</main>


      <Footer />
    </div>
  );
};

export default Products;
