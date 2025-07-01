import React, { createContext, useContext, useState, useEffect, ReactNode, Key } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface CartItem {
  item_key: Key;
  id: string; 
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
  removeFromCart: (itemKey: string) => Promise<void>;
  updateQuantity: (itemKey: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();

  // ✅ Updated helper function
  const apiRequest = async (url: string, method: string, body?: any) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_WOO_SITE_URL}${url}`, {
      method,
      credentials: 'include', // send cookies (for cart session)
      headers: {
        'Content-Type': 'application/json',
        // Remove Authorization header here!
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


  // ✅ Load cart on initial mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await apiRequest('/wp-json/cocart/v2/cart', 'GET');
        const items = Object.values(data.items || {}).map((item: any) => ({
          item_key: item.item_key,
          id: item.id,
          title: item.name,
          price: parseFloat(item.prices.price),
          image: item.featured_image || '',
          quantity: item.quantity,
        }));
        setItems(items);
      } catch (error) {
        console.error('Failed to load cart', error);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
    try {
      console.log('Adding to cart:', {
        id: product.id,
        quantity: 1,
      });
      // always add quantity 1
      const response = await apiRequest(`/wp-json/cocart/v2/cart/add-item`, 'POST', {
        id: product.id, // should be a valid WooCommerce product ID
        quantity: 1,
      });
      console.log('API response:', response);

      // CoCart returns the updated cart
      const updatedItem = response.item;
      const item_key = updatedItem.item_key;

      const newItem: CartItem = {
        item_key,
        id: updatedItem.id,
        title: updatedItem.name,
        price: parseFloat(updatedItem.prices.price),
        image: updatedItem.featured_image || '',
        quantity: updatedItem.quantity,
      };

      setItems((prev) => {
        const exists = prev.find((i) => i.item_key === item_key);
        if (exists) {
          return prev.map((i) =>
            i.item_key === item_key ? { ...i, quantity: newItem.quantity } : i
          );
        } else {
          return [...prev, newItem];
        }
      });

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

  const removeFromCart = async (itemKey: string) => {
    try {
      await apiRequest(`/wp-json/cocart/v2/cart/item/${itemKey}`, 'DELETE');
      setItems((prev) => prev.filter((item) => item.item_key !== itemKey));
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

  const updateQuantity = async (itemKey: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemKey);
        return;
      }

      await apiRequest(`/wp-json/cocart/v2/cart/item/${itemKey}`, 'PUT', { quantity });

      setItems((prev) =>
        prev.map((item) => (item.item_key === itemKey ? { ...item, quantity } : item))
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
      await apiRequest(`/wp-json/cocart/v2/cart/clear`, 'POST');
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
