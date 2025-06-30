import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useTranslation } from "react-i18next";

const Products = () => {
  const { t } = useTranslation();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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

        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" ||
          product.categories?.some((c) => c.slug === selectedCategory || c.name === selectedCategory);

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
      <Navbar /> {/* Add this line to include the Navbar */}

      <main className="flex-grow">
        <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <input
            type="text"
            placeholder={t("search product") || "Search products..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-1/3"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border px-3 py-2 rounded"
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
            className="border px-3 py-2 rounded"
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
            className="border px-3 py-2 rounded"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className={`grid ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-4 gap-6" : "grid-cols-1"} p-4`}>
          {filteredProducts.map((product: any) => (
            <ProductCard
              key={product.id}
              title={product.name}
              price={parseFloat(product.price)}
              image={product.images?.[0]?.src || "/placeholder.jpg"}
              hasVideo={product.meta_data?.some((m: any) => m.key === "has_video" && m.value === "yes")}
              hasAudio={product.meta_data?.some((m: any) => m.key === "has_audio" && m.value === "yes")}
              available={product.stock_status === "instock"}
              id={String(product.id)}
              description={product.short_description || product.description}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
