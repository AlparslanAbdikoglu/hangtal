
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart, Play, Volume2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  hasVideo?: boolean;
  hasAudio?: boolean;
  description?: string;
}

export const ProductCard = ({ id, title, price, image, hasVideo, hasAudio }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      title,
      price,
      image,
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="aspect-square relative">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {hasVideo && (
              <div className="bg-black/50 p-1 rounded">
                <Play className="h-4 w-4 text-white" />
              </div>
            )}
            {hasAudio && (
              <div className="bg-black/50 p-1 rounded">
                <Volume2 className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        </div>
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">${price.toFixed(2)}</span>
            <Button onClick={handleAddToCart} size="sm">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
