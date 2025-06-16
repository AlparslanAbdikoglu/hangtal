// my-webshop/frontend/src/components/ProductCard.tsx

import { Button } from "./ui/button"; // Assuming path to Shadcn UI components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"; // Assuming path to Shadcn UI components
import { Music, Video } from "lucide-react"; // Assuming Lucide icons
import { useCart } from "@/contexts/CartContext"; // Assuming you have this context
import { useTranslation } from 'react-i18next'; // Assuming you have i18n setup

// Define the interface for the ProductCard component's props
interface ProductCardProps {
  // Directly mapping from WooCommerce product object properties for simplicity in usage
  id: number; // Add product ID for cart operations
  title: string;
  price: number;
  image: string; // URL of the product image
  description: string; // Short description, will be stripped of HTML
  category: string; // Main category name
  hasVideo?: boolean; // Custom flag, might need a custom field in WP
  hasAudio?: boolean; // Custom flag, might need a custom field in WP
  available?: boolean; // Derived from stock status
}

export const ProductCard = ({
  id, // Destructure product ID for cart context
  title,
  price,
  image,
  description, // Added for consistency with ProductList data
  category,    // Added for consistency with ProductList data
  hasVideo = false,
  hasAudio = false,
  available = true, // Default to true if not explicitly set
}: ProductCardProps) => {
  const { addToCart } = useCart(); // Assuming useCart provides addToCart
  const { t } = useTranslation(); // For translations

  const defaultImage = "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";

  const handleAddToCart = () => {
    // Pass relevant product data to your cart context's addToCart function
    addToCart({
      id, // Pass product ID for unique identification in cart
      title,
      price,
      image,
      quantity: 1, // Default quantity
    });
  };

  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg">
      <CardHeader className="relative p-0">
        <div className="absolute top-2 left-2 flex gap-2 z-10">
          {hasVideo && (
            <div className="bg-teal-500 p-1.5 rounded text-white">
              <Video size={16} />
            </div>
          )}
          {hasAudio && (
            <div className="bg-teal-500 p-1.5 rounded text-white">
              <Music size={16} />
            </div>
          )}
        </div>
        <img
          src={image || defaultImage} // Use default if image is null/empty
          alt={title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { // Fallback for broken image URLs
            e.currentTarget.onerror = null; // Prevents looping
            e.currentTarget.src = defaultImage;
          }}
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-medium line-clamp-2">{title}</CardTitle>
        {category && <p className="text-sm text-gray-500">{category}</p>} {/* Display category */}
        <p className="text-2xl font-bold mt-2">€{price.toFixed(2)}</p>
        {available && (
          <p className="text-green-500 text-sm mt-1">{t('products.available')}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleAddToCart}
          disabled={!available}
        >
          {t('cart.addToCart')}
        </Button>
      </CardFooter>
    </Card>
  );
};
