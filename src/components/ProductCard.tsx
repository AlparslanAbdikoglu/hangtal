import { useCart } from "@/contexts/CartContext";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { Card, CardFooter, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Music, Video } from "lucide-react";
import {SignInButton } from "@clerk/clerk-react";


type ProductCardProps = {
  id: string;
  title: string;
  price: number;
  image: string;
  hasVideo?: boolean;
  hasAudio?: boolean;
  available?: boolean;
  description?: string;
};

export const ProductCard = ({
  id,
  title,
  price,
  image,
  hasVideo = false,
  hasAudio = false,
  available = true,
  description,
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const { isSignedIn } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAddToCart = () => {
    if (!isSignedIn) {
      setShowLoginModal(true);
      return;
    }

    addToCart({ title, price, image });
  };

  return (
    <>
      <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg relative">
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
          <Link to={`/products/${id}`} className="block z-0">
            <img src={image} alt={title} className="w-full h-48 object-cover rounded" />
          </Link>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-medium line-clamp-2">{title}</CardTitle>
          <p className="text-2xl font-bold mt-2">€{price.toFixed(2)}</p>
{available && (
  <p className="text-green-500 text-sm mt-1">{t('products.available')}</p>
)}
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
            onClick={handleAddToCart}
            disabled={!available}
          >
            {t('cart.addToCart')}
          </Button>
        </CardFooter>
      </Card>

      {/* Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4">{t('auth.loginRequired') || "Login Required"}</h2>
            <p className="mb-6">{t('auth.pleaseLoginToAddToCart') || "Please log in to add this product to your cart."}</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setShowLoginModal(false)}>
                {t('common.close') || "Close"}
              </Button>
              <SignInButton mode="modal">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  {t('auth.login') || "Log In"}
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
