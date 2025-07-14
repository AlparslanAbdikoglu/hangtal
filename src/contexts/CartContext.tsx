import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useToast } from "@/components/ui/use-toast";

interface CartItem {
  item_key: string;
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  variation?: string | null;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  cartKey: string;
  isLoading: boolean;
  addToCart: (
    productId: number,
    quantity?: number,
    variation?: Record<string, any>
  ) => Promise<boolean>;
  updateQuantity: (itemKey: string, newQuantity: number) => Promise<void>;
  removeFromCart: (itemKey: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartKey, setCartKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeCart();
  }, []);

  useEffect(() => {
    setItemCount(items.reduce((s, i) => s + i.quantity, 0));
    setTotalPrice(items.reduce((s, i) => s + i.price * i.quantity, 0));
  }, [items]);

  async function initializeCart() {
    try {
      let key = localStorage.getItem("cocart_cart_key") || "";
      if (!key) {
        const res = await fetch(
          "https://api.lifeisnatural.eu/wp-json/cocart/v2/cart",
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        key = data.cart_key;
        key && localStorage.setItem("cocart_cart_key", key);
      }
      setCartKey(key);
      key && fetchCartItems(key);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchCartItems(key: string) {
    try {
      const res = await fetch(
        `https://api.lifeisnatural.eu/wp-json/cocart/v2/cart?cart_key=${key}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!res.ok) {
        console.error("Fetch cart items failed:", res.status);
        return;
      }
      const data = await res.json();
      const arr = Object.values(data.items || {}).map((item: any) => ({
        item_key: item.item_key,
        id: item.id,
        title: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity.value,
        image: item.featured_image,
        variation: item.variation
          ? Object.values(item.variation).join(", ")
          : null,
      }));
      setItems(arr);
    } catch (e) {
      console.error(e);
    }
  }

  async function addToCart(
    productId: number,
    quantity = 1,
    variation = {}
  ) {
    if (!cartKey) {
      toast({ title: "Cart Error", description: "Missing cart key", variant: "destructive" });
      return false;
    }
    setIsLoading(true);
    try {
      const body: any = {
        id: productId,
        quantity: quantity.toString(), // v2 requires string :contentReference[oaicite:3]{index=3}
        cart_key: cartKey,
      };
      if (Object.keys(variation).length) body.variation = variation;

      const res = await fetch(
        "https://api.lifeisnatural.eu/wp-json/cocart/v2/cart/add-item",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) throw new Error((await res.json()).message || "");
      await fetchCartItems(cartKey);
      toast({ title: "Added!", description: "Item added to cart" });
      return true;
    } catch (e: any) {
      console.error(e);
      toast({ title: "Add failed", description: e.message || "⚠️", variant: "destructive" });
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function updateQuantity(itemKey: string, newQty: number) {
    if (newQty < 1) return removeFromCart(itemKey);
    try {
      const res = await fetch(
        "https://api.lifeisnatural.eu/wp-json/cocart/v2/cart/item",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart_key: cartKey,
            item_key: itemKey,
            quantity: newQty.toString(),
          }),
        }
      );
      if (!res.ok) throw new Error("update failed");
      await fetchCartItems(cartKey);
    } catch (e) {
      console.error(e);
      toast({ title: "Update failed", variant: "destructive" });
    }
  }

  async function removeFromCart(itemKey: string) {
    try {
      const res = await fetch(
        "https://api.lifeisnatural.eu/wp-json/cocart/v2/cart/item",
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart_key: cartKey, item_key: itemKey }),
        }
      );
      if (!res.ok) throw new Error("remove failed");
      await fetchCartItems(cartKey);
    } catch (e) {
      console.error(e);
      toast({ title: "Remove failed", variant: "destructive" });
    }
  }

  async function clearCart() {
    try {
      const res = await fetch(
        "https://api.lifeisnatural.eu/wp-json/cocart/v2/cart/clear",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart_key: cartKey }),
        }
      );
      if (!res.ok) throw new Error("clear failed");
      setItems([]);
    } catch (e) {
      console.error(e);
      toast({ title: "Clear failed", variant: "destructive" });
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalPrice,
        cartKey,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: () => fetchCartItems(cartKey),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
      