import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface CartContextType {
  items: any[];
  itemCount: number;
  totalPrice: number;
  cartKey: string;
  isLoading: boolean;
  jwt: string | null;
  loginToWoo: (username: string, password: string) => Promise<boolean>;
  addToCart: (productId: any, quantity?: number, variation?: Record<string, any>) => Promise<boolean>;
  updateQuantity: (itemKey: string, newQuantity: number) => Promise<void>;
  removeFromCart: (itemKey: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartKey, setCartKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [jwt, setJwt] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedJwt = localStorage.getItem('cocart_jwt');
    if (storedJwt) {
      setJwt(storedJwt);
    }
  }, []);

  useEffect(() => {
    if (jwt) {
      initializeCart();
    }
  }, [jwt]);

  useEffect(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setItemCount(count);
    setTotalPrice(total);
  }, [items]);

  const loginToWoo = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.lifeisnatural.eu/wp-json/cocart/v2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        setJwt(data.token);
        localStorage.setItem('cocart_jwt', data.token);
        toast({
          title: 'Login successful',
          description: 'You are logged into WooCommerce.',
          variant: 'default',
        });
        return true;
      } else {
        toast({
          title: 'Login failed',
          description: data.message || 'Invalid login credentials.',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Login error',
        description: 'Could not connect to WooCommerce.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const initializeCart = async () => {
    try {
      let storedCartKey = localStorage.getItem('cocart_cart_key');

      if (!storedCartKey) {
        const response = await fetch('https://api.lifeisnatural.eu/wp-json/cocart/v2/cart', {
          method: 'POST',
          headers: getAuthHeaders(),
          credentials: 'include',
        });

        const data = await response.json();
        storedCartKey = data.cart_key;
        if (storedCartKey) {
          localStorage.setItem('cocart_cart_key', storedCartKey);
        }
      }

      if (storedCartKey) {
        setCartKey(storedCartKey);
        await fetchCartItems(storedCartKey);
      }
    } catch (error) {
      console.error('Failed to initialize cart:', error);
    }
  };

  const fetchCartItems = async (key) => {
    try {
      const response = await fetch(`https://api.lifeisnatural.eu/wp-json/cocart/v2/cart?cart_key=${key}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const cartItems = Object.values(data.items || {}).map((item: any) => ({
          item_key: item.item_key,
          id: item.id,
          title: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity.value,
          image: item.featured_image,
          variation: item.variation ? Object.values(item.variation).join(', ') : null,
        }));
        setItems(cartItems);
      }
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    }
  };

  const addToCart = async (productId, quantity = 1, variation = {}) => {
    if (!cartKey) {
      toast({
        title: 'Cart Error',
        description: 'Cart not initialized. Please refresh the page.',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    try {
      const requestBody: {
        id: any;
        quantity: number;
        cart_key: string;
        variation?: Record<string, any>;
      } = {
        id: productId,
        quantity,
        cart_key: cartKey,
      };

      if (Object.keys(variation).length > 0) {
        requestBody.variation = variation;
      }

      const response = await fetch('https://api.lifeisnatural.eu/wp-json/cocart/v2/cart/add-item', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestBody),
        credentials: 'include',
      });

      if (response.ok) {
        await fetchCartItems(cartKey);
        toast({
          title: 'Item Added',
          description: 'Product has been added to your cart',
          variant: 'default',
        });
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast({
        title: 'Add to Cart Failed',
        description: error.message || 'Failed to add item to cart',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemKey, newQuantity) => {
    if (newQuantity < 1) {
      return removeFromCart(itemKey);
    }

    try {
      const response = await fetch('https://api.lifeisnatural.eu/wp-json/cocart/v2/cart/item', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          cart_key: cartKey,
          item_key: itemKey,
          quantity: newQuantity,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        await fetchCartItems(cartKey);
      } else {
        throw new Error('Failed to update quantity');
      }
    } catch (error) {
      console.error('Update quantity error:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update item quantity',
        variant: 'destructive',
      });
    }
  };

  const removeFromCart = async (itemKey) => {
    try {
      const response = await fetch('https://api.lifeisnatural.eu/wp-json/cocart/v2/cart/item', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          cart_key: cartKey,
          item_key: itemKey,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        await fetchCartItems(cartKey);
        toast({
          title: 'Item Removed',
          description: 'Item has been removed from your cart',
          variant: 'default',
        });
      } else {
        throw new Error('Failed to remove item');
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      toast({
        title: 'Remove Failed',
        description: 'Failed to remove item from cart',
        variant: 'destructive',
      });
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('https://api.lifeisnatural.eu/wp-json/cocart/v2/cart/clear', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ cart_key: cartKey }),
        credentials: 'include',
      });

      if (response.ok) {
        setItems([]);
        toast({
          title: 'Cart Cleared',
          description: 'All items have been removed from your cart',
          variant: 'default',
        });
      } else {
        throw new Error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Clear cart error:', error);
      toast({
        title: 'Clear Failed',
        description: 'Failed to clear cart',
        variant: 'destructive',
      });
    }
  };

  const getAuthHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (jwt) {
      headers['Authorization'] = `Bearer ${jwt}`;
    }
    return headers;
  };

  const value: CartContextType = {
    items,
    itemCount,
    totalPrice,
    cartKey,
    isLoading,
    jwt,
    loginToWoo,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: () => fetchCartItems(cartKey),
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
