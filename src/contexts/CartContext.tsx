import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  variation?: Record<string, any> | null;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (
    product: CartItem,
    quantity?: number
  ) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  checkout: (customerData: any) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  function addToCart(product: CartItem, quantity = 1) {
    setItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + quantity }
            : p
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
    toast({
      title: "Added!",
      description: `${product.title} added to cart`,
    });
  }

  function updateQuantity(productId: number, newQuantity: number) {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: newQuantity } : p
      )
    );
  }

  function removeFromCart(productId: number) {
    setItems((prev) => prev.filter((p) => p.id !== productId));
    toast({ title: "Item removed from cart." });
  }

  function clearCart() {
    setItems([]);
    toast({ title: "Cart cleared." });
  }

  async function checkout(customerData: any) {
    if (items.length === 0) {
      toast({
        title: "Checkout failed",
        description: "Your cart is empty.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const orderPayload = {
        payment_method: "bacs", // or other method key
        payment_method_title: "Bank Transfer",
        set_paid: false,
        billing: customerData.billing,
        shipping: customerData.shipping,
        line_items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          ...(item.variation ? { variation: item.variation } : {})
        })),
      };

      const res = await fetch(
        "https://api.lifeisnatural.eu/wp-json/wc/v3/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic " +
              btoa(
                `${process.env.NEXT_PUBLIC_WC_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET}`
              ),
          },
          body: JSON.stringify(orderPayload),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create order");
      }

      const order = await res.json();
      console.log("Order created!", order);

      toast({
        title: "Order Created!",
        description: `Order #${order.id} created successfully.`,
      });

      clearCart();
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Checkout failed",
        description: e.message || "⚠️",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalPrice,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
