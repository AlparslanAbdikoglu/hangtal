import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Music, Video } from "lucide-react";

interface ProductCardProps {
  title: string;
  price: number;
  image: string;
  hasVideo?: boolean;
  hasAudio?: boolean;
  available?: boolean;
}

export const ProductCard = ({
  title,
  price,
  image,
  hasVideo = false,
  hasAudio = false,
  available = true,
}: ProductCardProps) => {
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
          src={image}
          alt={title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-medium line-clamp-2">{title}</CardTitle>
        <p className="text-2xl font-bold mt-2">€{price.toFixed(2)}</p>
        {available && (
          <p className="text-green-500 text-sm mt-1">Available immediately</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-primary hover:bg-primary/90">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};