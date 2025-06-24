import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useTranslation } from "react-i18next";
import { useAuth } from "@clerk/clerk-react";

const Products = () => {
  const { t } = useTranslation();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState({
    label: "All Prices",
    min: 0,
    max: Infinity,
  });
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    t("products.filters.all"),
    "Steel Tongue Drums",
    "Handpans",
    "Kalimbas",
    "Crystal Singing Bowls",
    "Singing Bowls",
    "Wind Chimes",
  ];

  const priceRanges = [
    { label: t("products.filters.allPrices"), min: 0, max: Infinity },
    { label: t("products.filters.under100"), min: 0, max: 100 },
    { label: t("products.filters.100to500"), min: 100, max: 500 },
    { label: t("products.filters.over500"), min: 500, max: Infinity },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await getToken();
        const res = await fetch("https://api.lifeisnatural.eu/wp-json/react-woo/v1/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch");

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
  }, [getToken]);

  useEffect(() => {
    const filtered = products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === t("products.filters.all") ||
          product.categories?.includes(selectedCategory);

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
  }, [products, searchTerm, selectedCategory, selectedPriceRange, sortBy, t]);

  if (loading) return <div className="p-12 text-center">Loading products...</div>;
  if (error) return <div className="p-12 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* You can insert your filters/search UI above this if needed */}

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
          />
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
