import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Card, CardFooter, CardHeader, CardContent, CardTitle } from "./ui/card";
import { CurrencyInfo, formatMoney } from "@/utils/currency";

type ProductCardProps = {
  id: string;
  title: string;
  price: number;
  image: string;
  available?: boolean;
  description?: string;
  onAddToCart: () => void;
  currency?: CurrencyInfo;
};

export const ProductCard = ({
  id,
  title,
  price,
  image,
  available = true,
  description,
  onAddToCart,
  currency,
}: ProductCardProps) => {
  const { t } = useTranslation();

  const formattedPrice = currency ? formatMoney(price, currency) : `€${price.toFixed(2)}`;

  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg relative">
      <CardHeader className="relative p-0">
        <Link to={`/products/${id}`} className="block z-0">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover rounded"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-medium line-clamp-2">{title}</CardTitle>
        <p className="text-2xl font-bold mt-2">{formattedPrice}</p>
        {available && <p className="text-green-500 text-sm mt-1">{t("products.filters.stockAvailable")}</p>}
        {description && (
          <p
            className="text-sm text-muted-foreground mt-1 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 z-10 relative">
        <Button
          className="w-full bg-primary hover:bg-primary/90"
          onClick={onAddToCart}
          disabled={!available}
        >
          {t("cart.addToCart")}
        </Button>
      </CardFooter>
    </Card>
  );
};
