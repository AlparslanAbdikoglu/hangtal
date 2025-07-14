import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

export const CartDrawer = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
  } = useCart();

  const { t } = useTranslation();
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
    } else {
      addToCart({ id, quantity, name: "", price: 0 });
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({
        title: t("cart.empty") || "Cart is empty",
        variant: "destructive",
      });
      return;
    }

    setLoadingCheckout(true);
    try {
      const response = await fetch(
        "https://api.lifeisnatural.eu/api/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems,
            totalPrice,
          }),
        }
      );

      const data = await response.json();

      if (data.id) {
        toast({
          title: "Order created!",
          description: `Order #${data.id} created successfully.`,
        });

        window.location.href = `https://api.lifeisnatural.eu/checkout/order-pay/${data.id}/?key=${data.order_key}`;
      } else {
        toast({
          title: "Checkout error",
          description: JSON.stringify(data),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Checkout Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unknown error occurred during checkout.",
        variant: "destructive",
      });
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <Drawer>
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
            {t("cart.title")} ({t("cart.items", { count: itemCount })})
            {cartItems.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearCart}>
                {t("cart.clearAll")}
              </Button>
            )}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t("cart.empty")}</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-2 text-sm">
                        {item.name}
                      </h4>
                      <p className="text-primary font-bold">
                        €{item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 px-4 py-2 border-t">
                <div className="flex justify-between text-sm font-medium">
                  <span>{t("cart.total")}</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full mt-4"
                  disabled={itemCount === 0 || loadingCheckout}
                >
                  {loadingCheckout
                    ? t("cart.processing") || "Processing..."
                    : t("cart.checkout")}
                </Button>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
