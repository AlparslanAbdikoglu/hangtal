
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Filter, Grid, List } from "lucide-react";

const products = [
  {
    title: "Steel Tongue Drum - D Kurd Scale",
    price: 369.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasVideo: true,
    hasAudio: true,
    category: "Steel Tongue Drums",
    description: "Beautiful 16\" octave drum with floral laser design"
  },
  {
    title: "Steel Tongue Drum - D Amara Scale",
    price: 369.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasVideo: true,
    hasAudio: true,
    category: "Steel Tongue Drums",
    description: "Navy blue finish with enchanting Amara tuning"
  },
  {
    title: "Classic Steel Tongue Drum",
    price: 349.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasVideo: true,
    hasAudio: true,
    category: "Steel Tongue Drums",
    description: "Essential black finish for pure sound meditation"
  },
  {
    title: "Crystal Singing Bowl - Clear Quartz",
    price: 299.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasAudio: true,
    category: "Crystal Singing Bowls",
    description: "Pure quartz crystal bowl for healing frequencies"
  },
  {
    title: "Professional Handpan - D Minor",
    price: 1299.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasVideo: true,
    hasAudio: true,
    category: "Handpans",
    description: "Premium handcrafted steel handpan with rich harmonics"
  },
  {
    title: "Mahogany Kalimba - 17 Keys",
    price: 89.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasAudio: true,
    category: "Kalimbas",
    description: "Traditional thumb piano with warm mahogany body"
  },
  {
    title: "Tibetan Singing Bowl Set",
    price: 159.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasAudio: true,
    category: "Singing Bowls",
    description: "Hand-hammered bowl with cushion and striker"
  },
  {
    title: "Wind Chimes - Bamboo Harmony",
    price: 45.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasAudio: true,
    category: "Wind Chimes",
    description: "Natural bamboo chimes for peaceful ambiance"
  }
];

const categories = ["All", "Steel Tongue Drums", "Handpans", "Kalimbas", "Crystal Singing Bowls", "Singing Bowls", "Wind Chimes"];
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under €100", min: 0, max: 100 },
  { label: "€100 - €500", min: 100, max: 500 },
  { label: "Over €500", min: 500, max: Infinity }
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesPrice = product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max;
      
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "name": return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">Sound Healing Instruments</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover our carefully curated collection of premium sound healing instruments. 
            Each piece is crafted to bring harmony, peace, and therapeutic vibrations to your life.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search instruments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-input rounded-md px-3 py-2 text-sm bg-background"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

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

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-input rounded-md px-3 py-2 text-sm bg-background"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>

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

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedCategory !== "All" && (
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {selectedCategory}
                <button onClick={() => setSelectedCategory("All")} className="hover:text-primary/70">×</button>
              </span>
            )}
            {selectedPriceRange.label !== "All Prices" && (
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

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          
          {filteredProducts.length === 0 && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedPriceRange(priceRanges[0]);
              }}
            >
              Clear All Filters
            </Button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-2xl font-bold text-primary mb-2">No instruments found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search terms to find the perfect instrument.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedPriceRange(priceRanges[0]);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              View All Products
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;
