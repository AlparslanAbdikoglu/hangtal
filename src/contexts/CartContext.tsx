import React, { createContext, useContext, useState, ReactNode, Key } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface CartItem {
  item_key: Key;
  id: string; // WooCommerce product_id
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  addToCart: (product: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Helper function for API requests
  const apiRequest = async (url: string, method: string, body?: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_WOO_SITE_URL}${url}`, {
        method,
        headers: {
          Authorization: `Basic ${btoa(`${import.meta.env.VITE_WC_CONSUMER_KEY}:${import.meta.env.VITE_WC_CONSUMER_SECRET}`)}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItem = items.find((item) => item.id === product.id);
      const quantity = existingItem ? existingItem.quantity + 1 : 1;

      // Sync with CoCart
      await apiRequest(`/wp-json/cocart/v2/cart/add-item`, 'POST', {
        id: product.id,
        quantity,
      });

      // Update local state
      if (existingItem) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === product.id ? { ...item, quantity } : item
          )
        );
      } else {
        setItems((prev) => [...prev, { ...product, quantity }]);
      }

      toast({
        title: t('cart.addedToCart'),
        description: t('cart.addedDescription', { title: product.title }),
      });
    } catch (error) {
      toast({
        title: t('cart.error'),
        description: t('cart.addError', { title: product.title }),
        variant: 'destructive',
      });
      console.error('Failed to add item to cart', error);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      // Remove from CoCart
      await apiRequest(`/wp-json/cocart/v2/cart/item/${id}`, 'DELETE');

      // Update local state
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: t('cart.removedFromCart'),
        description: t('cart.removedDescription'),
      });
    } catch (error) {
      toast({
        title: t('cart.error'),
        description: t('cart.removeError'),
        variant: 'destructive',
      });
      console.error('Failed to remove item from cart', error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(id);
        return;
      }

      // Update quantity in CoCart
      await apiRequest(`/wp-json/cocart/v2/cart/item/${id}`, 'PUT', { quantity });

      // Update local state
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
      toast({
        title: t('cart.updated'),
        description: t('cart.updatedDescription'),
      });
    } catch (error) {
      toast({
        title: t('cart.error'),
        description: t('cart.updateError'),
        variant: 'destructive',
      });
      console.error('Failed to update quantity', error);
    }
  };

  const clearCart = async () => {
    try {
      // Clear CoCart session
      await apiRequest(`/wp-json/cocart/v2/cart/clear`, 'POST');

      // Update local state
      setItems([]);
      toast({
        title: t('cart.cleared'),
        description: t('cart.clearedDescription'),
      });
    } catch (error) {
      toast({
        title: t('cart.error'),
        description: t('cart.clearError'),
        variant: 'destructive',
      });
      console.error('Failed to clear cart', error);
    }
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};