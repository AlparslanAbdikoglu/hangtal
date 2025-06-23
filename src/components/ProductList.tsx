// my-webshop/frontend/src/components/ProductList.jsx

import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/woocommerce'; // Import the API function
import { ProductCard } from "./ProductCard"; // Import your updated ProductCard
import { Button } from "./ui/button"; // Assuming path to Shadcn UI components
import { Input } from "./ui/input"; // Assuming path to Shadcn UI components
import { Search, Grid, List } from "lucide-react"; // Assuming Lucide icons
import { useTranslation } from 'react-i18next'; // Assuming you have i18n setup

const ProductList = () => {
  const { t } = useTranslation();

  const [products, setProducts] = useState([]); // Raw product data from API
  const [loading, setLoading] = useState(true); // Loading state for API fetch
  const [error, setError] = useState(null);     // Error state for API fetch

  // --- Filtering & Sorting States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(t('products.filters.all'));
  const [selectedPriceRange, setSelectedPriceRange] = useState({ label: t('products.filters.allPrices'), min: 0, max: Infinity });
  const [sortBy, setSortBy] = useState("featured"); // Default sort option
  const [viewMode, setViewMode] = useState("grid"); // Default view mode

  // These categories should ideally be fetched dynamically from WooCommerce's /products/categories API
  const categories = [t('products.filters.all'), "Steel Tongue Drums", "Handpans", "Kalimbas", "Crystal Singing Bowls", "Singing Bowls", "Wind Chimes"];
  const priceRanges = [
    { label: t('products.filters.allPrices'), min: 0, max: Infinity },
    { label: t('products.filters.under100'), min: 0, max: 100 },
    { label: t('products.filters.100to500'), min: 100, max: 500 },
    { label: t('products.filters.over500'), min: 500, max: Infinity }
  ];

  // --- Fetch Products on Component Mount ---
  useEffect(() => {
    const fetchWooCommerceProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch products using the API function
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err);
        console.error("Failed to fetch products from WooCommerce:", err);
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchWooCommerceProducts();
  }, []); // Empty dependency array means this runs once on component mount

  // --- Filter and Sort Products ---
  const filteredProducts = products
    .filter(product => {
      // Helper to strip HTML tags from a string (useful for WooCommerce descriptions)
      const stripHtml = (html) => {
        if (!html) return '';
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
      };

      const descriptionText = product.short_description ? stripHtml(product.short_description) : '';
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            descriptionText.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter (checks if product has the selected category)
      const productCategoryNames = product.categories ? product.categories.map(cat => cat.name) : [];
      const matchesCategory = selectedCategory === t('products.filters.all') || productCategoryNames.includes(selectedCategory);
      
      // Price range filter
      const matchesPrice = parseFloat(product.price) >= selectedPriceRange.min && parseFloat(product.price) <= selectedPriceRange.max;
      
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": return parseFloat(a.price) - parseFloat(b.price);
        case "price-high": return parseFloat(b.price) - parseFloat(a.price);
        case "name": return a.name.localeCompare(b.name);
        default: return 0; // "featured" or no specific sort order
      }
    });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">{t('products.title')}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('products.subtitle')}
          </p>
        </div>

        {/* --- Filters and Search Section --- */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('products.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-input rounded-md px-3 py-2 text-sm bg-background"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Price Range Filter */}
              <select
                value={selectedPriceRange.label}
                onChange={(e) => {
                  const range = priceRanges.find(r => r.label === e.target.value);
                  if (range) setSelectedPriceRange(range);
                }}
                className="border border-input rounded-md px-3 py-2 text-sm bg-background"
              >
                {priceRanges.map(range => (
                  <option key={range.label} value={range.label}>{range.label}</option>
                ))}
              </select>

              {/* Sort By Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-input rounded-md px-3 py-2 text-sm bg-background"
              >
                <option value="featured">{t('products.filters.featured')}</option>
                <option value="price-low">{t('products.filters.priceLowHigh')}</option>
                <option value="price-high">{t('products.filters.priceHighLow')}</option>
                <option value="name">{t('products.filters.nameAZ')}</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-input rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-primary text-white" : "bg-background text-muted-foreground"}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-primary text-white" : "bg-background text-muted-foreground"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCategory !== t('products.filters.all') && (
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {selectedCategory}
                <button onClick={() => setSelectedCategory(t('products.filters.all'))} className="hover:text-primary/70">×</button>
              </span>
            )}
            {selectedPriceRange.label !== t('products.filters.allPrices') && (
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {selectedPriceRange.label}
                <button onClick={() => setSelectedPriceRange(priceRanges[0])} className="hover:text-primary/70">×</button>
              </span>
            )}
            {searchTerm && (
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                "{searchTerm}"
                <button onClick={() => setSearchTerm("")} className="hover:text-primary/70">×</button>
              </span>
            )}
          </div>
        </div>

        {/* --- Product Count and Clear Filters --- */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {t('products.showing', { count: filteredProducts.length, total: products.length })}
          </p>
          
          {filteredProducts.length === 0 && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(t('products.filters.all'));
                setSelectedPriceRange(priceRanges[0]);
              }}
            >
              {t('products.clearFilters')}
            </Button>
          )}
        </div>

        {/* --- Product List Display (Loading, Error, No Results, or Products) --- */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
            <p className="ml-4 text-lg text-gray-700">Loading products from store...</p>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center p-4">
            Error: {error.message || 'Failed to fetch products.'}
            <p>Please ensure your WooCommerce backend is running and accessible at the configured URL.</p>
            <p>If you're still seeing this, check your server logs and browser console for more details.</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4" // Simple vertical list layout
          }>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id} // Pass product ID
                title={product.name} // Map WC name to title
                price={parseFloat(product.price)} // Ensure price is a number
                image={product.images && product.images.length > 0 ? product.images[0].src : ''} // Get first image URL
                description={product.short_description} // Pass short description
                category={product.categories && product.categories.length > 0 ? product.categories[0].name : 'Uncategorized'} // Get first category name
                // hasVideo and hasAudio would need custom fields in WooCommerce, defaulting to false for now
                hasVideo={false} 
                hasAudio={false}
                available={product.stock_status === 'instock'} // Determine availability from stock status
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-2xl font-bold text-primary mb-2">{t('products.noResults')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('products.noResultsText')}
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(t('products.filters.all'));
                setSelectedPriceRange(priceRanges[0]);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              {t('products.viewAll')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
