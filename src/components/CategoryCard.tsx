import { Card, CardContent } from "./ui/card";

interface CategoryCardProps {
  title: string;
  image: string;
}

export const CategoryCard = ({ title, image }: CategoryCardProps) => {
  return (
    <Card className="group cursor-pointer overflow-hidden">
      <CardContent className="p-0 relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end p-4">
          <h3 className="text-white text-lg font-medium">{title}</h3>
        </div>
      </CardContent>
    </Card>
  );
};