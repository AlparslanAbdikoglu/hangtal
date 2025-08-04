import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Define the Category interface
interface Category {
  id: number;
  name: string;
  slug: string;
  image?: { src: string };
  parent: number;
  count: number;
}

// Placeholder for images when a category has none
const placeholderImage = "https://placehold.co/400x300/dfd6c5/4A3C31?text=No+Image";

// Hardcoded image overrides for specific slugs
const hardcodedImages: Record<string, string> = {
  handpans: "https://zvukovaakademia.sk/wp-content/uploads/2025/08/handpan2.jpg",
  // Add more image URLs here to override placeholder images
};

// Main component
const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for sidebar hover effect
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);

  // State for managing the currently viewed parent category from clicks and breadcrumbs
  const [currentParent, setCurrentParent] = useState<Category | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Category[]>([]);
  
  // New state to track the last clicked category to handle the double-click logic
  const [lastClickedCategory, setLastClickedCategory] = useState<Category | null>(null);

  // Authentication and API details from environment variables
  // IMPORTANT: For this code to run, ensure VITE_WOO_CONSUMER_KEY, VITE_WOO_CONSUMER_SECRET,
  // and VITE_WOO_API_URL are correctly set in your .env file.
  const consumerKey = import.meta.env.VITE_WOO_CONSUMER_KEY;
  const consumerSecret = import.meta.env.VITE_WOO_CONSUMER_SECRET;
  const apiUrl = import.meta.env.VITE_WOO_API_URL;
  const auth = btoa(`${consumerKey}:${consumerSecret}`);

  // Fetch categories from the WooCommerce API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/products/categories?per_page=100`, {
          headers: { Authorization: `Basic ${auth}` },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data: Category[] = await res.json();

        // Filter out 'uncategorized' and assign images
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
      } catch (e: any) {
        setError(e.message);
        console.error("Error fetching categories:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [apiUrl, auth]);

  // Determine the categories to display in the sidebar
  const sidebarCategories = categories.filter((cat) => cat.parent === 0);

  // Determine the categories to display in the center based on hover or click
  let centerCategories: Category[];
  let centerTitle: string = "";

  if (hoveredCategory) {
    // If a category is hovered in the sidebar, show its subcategories or itself
    const subCategoriesOfHovered = categories.filter((cat) => cat.parent === hoveredCategory.id);
    if (subCategoriesOfHovered.length > 0) {
      centerCategories = [hoveredCategory, ...subCategoriesOfHovered];
      centerTitle = `${hoveredCategory.name} Subcategories`;
    } else {
      centerCategories = [hoveredCategory];
      centerTitle = hoveredCategory.name;
    }
  } else if (currentParent) {
    // If a category has been clicked, show its subcategories and the parent card
    const subCategoriesOfCurrentParent = categories.filter((cat) => cat.parent === currentParent.id);
    centerCategories = [currentParent, ...subCategoriesOfCurrentParent];
    centerTitle = currentParent.name;
  } else {
    // Default to showing all top-level parent categories
    centerCategories = categories.filter((cat) => cat.parent === 0);
    centerTitle = "All Categories";
  }

  // Handle a category card click
  const handleCardClick = (category: Category) => {
    // Check if this is the second click on the same parent category card
    if (lastClickedCategory && lastClickedCategory.id === category.id) {
      // It's the second click, so navigate to the products page
      navigate(`/products?category=${category.slug}`);
      setLastClickedCategory(null); // Reset the state
    } else {
      // This is the first click on a parent, or a click on a different card
      const hasSubcategories = categories.some((cat) => cat.parent === category.id);
      
      if (hasSubcategories) {
        setCurrentParent(category);
        setBreadcrumbs([...breadcrumbs, category]);
        setLastClickedCategory(category); // Store the clicked category
      } else {
        // It's a leaf category, navigate immediately
        navigate(`/products?category=${category.slug}`);
        setLastClickedCategory(null); // Reset the state
      }
    }
  };

  // Handle back button click
  const handleBackClick = () => {
    setLastClickedCategory(null); // Reset last clicked on back navigation
    if (breadcrumbs.length > 1) {
      const newBreadcrumbs = breadcrumbs.slice(0, -1);
      setCurrentParent(newBreadcrumbs[newBreadcrumbs.length - 1]);
      setBreadcrumbs(newBreadcrumbs);
    } else {
      setCurrentParent(null);
      setBreadcrumbs([]);
    }
  };

  // Render loading, error, or main content
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl text-foreground">Loading categories...</p>
      </div>
    );
  }

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
        {/* Sideline Menu (Sidebar) */}
        <aside
          className="w-64 bg-muted p-6 border-r border-border shadow-sm overflow-y-auto"
          onMouseLeave={() => setHoveredCategory(null)} // Reset on leaving sidebar area
        >
          <h3 className="text-2xl font-bold mb-6 text-foreground">Shop by Category</h3>
          <ul className="space-y-3">
            {sidebarCategories.map((cat) => (
              <li
                key={cat.id}
                className={`
                  cursor-pointer py-2 px-4 rounded-lg transition-all duration-200
                  ${
                    hoveredCategory?.id === cat.id
                      ? "bg-primary text-primary-foreground shadow-md font-medium"
                      : "text-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
                onMouseEnter={() => setHoveredCategory(cat)}
                onClick={() => handleCardClick(cat)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Center Cards Area */}
        <section className="flex-grow p-8 flex flex-col items-center">
          <div className="max-w-7xl w-full">
            
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center text-foreground text-sm mb-4">
              {currentParent !== null && (
                <button
                  onClick={handleBackClick}
                  className="flex items-center text-primary hover:text-primary transition-colors"
                >
                  <ArrowLeft size={16} className="mr-1" /> Back
                </button>
              )}
              <span className="ml-2">
                <button
                  onClick={() => { setCurrentParent(null); setBreadcrumbs([]); setLastClickedCategory(null); }}
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
                      const newBreadcrumbs = breadcrumbs.slice(0, breadcrumbs.indexOf(crumb) + 1);
                      setCurrentParent(crumb);
                      setBreadcrumbs(newBreadcrumbs);
                      setLastClickedCategory(null); // Reset last clicked on breadcrumb navigation
                    }}
                    className="hover:underline text-primary"
                  >
                    {crumb.name}
                  </button>
                </span>
              ))}
            </nav>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground">
                {centerTitle}
              </h1>
              <p className="mt-2 text-lg text-foreground">
                Browse our selection of products by category.
              </p>
            </div>

            {/* The Card Grid */}
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
                    />
                  </div>
                  <div className="p-4 flex flex-col items-center text-center">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    {cat.count !== undefined && (
                      <p className="mt-1 text-sm text-foreground">({cat.count} items)</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
