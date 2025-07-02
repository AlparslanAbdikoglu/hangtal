import { useState } from "react";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

export const CartDrawer = ({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) => {
  const { items, itemCount, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { t } = useTranslation();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Optionally sync with WooCommerce backend here if needed
      // for (const item of items) {
      //   await fetch(`${import.meta.env.VITE_WOO_SITE_URL}/wp-json/wc/store/cart/add-item`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     credentials: "include",
      //     body: JSON.stringify({
      //       id: item.id,
      //       quantity: item.quantity,
      //     }),
      //   });
      // }

      navigate("/checkout"); // Use frontend checkout page
    } catch (error) {
      console.error("Cart sync failed", error);
      alert(t('cart.syncError') || "Something went wrong syncing your cart!");
      setIsCheckingOut(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="flex justify-between items-center">
            {t('cart.title')} ({t('cart.items', { count: itemCount })})
            {items.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearCart} disabled={isCheckingOut}>
                {t('cart.clearAll')}
              </Button>
            )}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('cart.empty')}</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-2 text-sm">{item.title}</h4>
                      <p className="text-primary font-bold">€{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={isCheckingOut}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={isCheckingOut}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 ml-2"
                        onClick={() => removeFromCart(item.id)}
                        disabled={isCheckingOut}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">{t('cart.total', { amount: totalPrice.toFixed(2) })}</span>
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? t('cart.checkingOut') || 'Checking out...' : t('cart.checkout')}
                </Button>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
