import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useUser } from '@clerk/clerk-react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  product_id: number;
  variation_id?: number;
  item_key?: string;
  woo_item_key?: string; // WooCommerce cart item key
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (product: Omit<CartItem, 'quantity' | 'id' | 'item_key' | 'woo_item_key'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncWithWooCommerce: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user, isSignedIn } = useUser();

  // Generate nonce for WooCommerce API authentication
  const generateNonce = async () => {
    // Only attempt to generate nonce if signed in and VITE_WOO_SITE_URL is defined
    if (!isSignedIn || !import.meta.env.VITE_WOO_SITE_URL) {
      return null;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_WOO_SITE_URL}/wp-json/wc/store/cart/get-cart-nonce`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data.nonce;
    } catch (error) {
      console.error('Failed to get nonce:', error);
      return null;
    }
  };

  // Sync cart with WooCommerce on user login
  useEffect(() => {
    if (isSignedIn && user) {
      syncWithWooCommerce();
    }
  }, [isSignedIn, user]);

  const syncWithWooCommerce = async () => {
    if (!isSignedIn || !import.meta.env.VITE_WOO_SITE_URL) return; // Only sync if signed in and URL is available
    
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_WOO_SITE_URL}/wp-json/wc/store/cart`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-WC-Store-API-Nonce': await generateNonce() || '',
        },
      });

      if (response.ok) {
        const wooCart = await response.json();
        const wooItems: CartItem[] = wooCart.items.map((item: any) => ({
          id: `woo-${item.key}`,
          title: item.name,
          price: parseFloat(item.prices.price) / 100, // WooCommerce stores prices in cents
          image: item.images?.[0]?.src || '',
          quantity: item.quantity,
          product_id: item.id,
          variation_id: item.variation?.length > 0 ? item.variation[0].attribute : undefined,
          woo_item_key: item.key,
        }));
        setItems(wooItems);
      } else {
        console.warn('Failed to sync with WooCommerce, proceeding with local cart.');
      }
    } catch (error) {
      console.error('Failed to sync with WooCommerce:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Omit<CartItem, 'quantity' | 'id' | 'item_key' | 'woo_item_key'>) => {
    setIsLoading(true);
    
    try {
      let addedToWooCommerce = false;
      // Attempt to add to WooCommerce if user is signed in and URL is defined
      if (isSignedIn && import.meta.env.VITE_WOO_SITE_URL) {
        try {
          const nonce = await generateNonce();
          const response = await fetch(`${import.meta.env.VITE_WOO_SITE_URL}/wp-json/wc/store/cart/add-item`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-WC-Store-API-Nonce': nonce || '',
            },
            body: JSON.stringify({
              id: product.product_id,
              quantity: 1,
              variation: product.variation_id ? [{ attribute: 'variation_id', value: product.variation_id }] : [],
            }),
          });

          if (response.ok) {
            const result = await response.json();
            const newItem: CartItem = {
              id: `woo-${result.item_key || Date.now()}`,
              title: product.title,
              price: product.price,
              image: product.image,
              quantity: 1,
              product_id: product.product_id,
              variation_id: product.variation_id,
              woo_item_key: result.item_key,
            };

            setItems(prev => {
              const existingItemIndex = prev.findIndex(item => 
                item.product_id === product.product_id && 
                item.variation_id === product.variation_id
              );
              
              if (existingItemIndex >= 0) {
                const updatedItems = [...prev];
                updatedItems[existingItemIndex].quantity += 1;
                return updatedItems;
              } else {
                return [...prev, newItem];
              }
            });
            addedToWooCommerce = true;
          } else {
            console.warn('Failed to add to WooCommerce cart, adding to local cart only.');
          }
        } catch (wooError) {
          console.warn('Error adding to WooCommerce cart, adding to local cart only:', wooError);
        }
      }

      // If not added to WooCommerce (or not signed in), add to local cart
      if (!addedToWooCommerce) {
        const id = `local-${product.product_id}-${Date.now()}`;
        const existingItem = items.find(item => 
          item.product_id === product.product_id && 
          item.variation_id === product.variation_id
        );
        
        if (existingItem) {
          // Update quantity for existing local item
          setItems(prev => prev.map(item => 
            item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item
          ));
        } else {
          // Add new local item
          const newItem: CartItem = {
            id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
            product_id: product.product_id,
            variation_id: product.variation_id,
          };
          setItems(prev => [...prev, newItem]);
        }
      }
      
      toast({
        title: t('cart.addedToCart', { defaultValue: 'Added to cart' }),
        description: t('cart.addedDescription', { title: product.title, defaultValue: `${product.title} added to cart` }),
      });

    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: t('cart.error', { defaultValue: 'Error' }),
        description: t('cart.addError', { defaultValue: 'Failed to add item to cart' }),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (id: string) => {
    setIsLoading(true);
    
    try {
      const item = items.find(i => i.id === id);
      if (!item) return;

      // Attempt to remove from WooCommerce if user is signed in and item has WooCommerce key
      if (isSignedIn && item.woo_item_key && import.meta.env.VITE_WOO_SITE_URL) {
        try {
          const nonce = await generateNonce();
          const response = await fetch(`${import.meta.env.VITE_WOO_SITE_URL}/wp-json/wc/store/cart/remove-item`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-WC-Store-API-Nonce': nonce || '',
            },
            body: JSON.stringify({
              key: item.woo_item_key,
            }),
          });

          if (!response.ok) {
            console.warn('Failed to remove from WooCommerce cart, removing from local cart only.');
          }
        } catch (wooError) {
          console.warn('Error removing from WooCommerce cart, removing from local cart only:', wooError);
        }
      }

      // Always remove from local cart
      setItems(prev => prev.filter(cartItem => cartItem.id !== id));
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast({
        title: t('cart.error', { defaultValue: 'Error' }),
        description: t('cart.removeError', { defaultValue: 'Failed to remove item from cart' }),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    setIsLoading(true);
    
    try {
      const item = items.find(i => i.id === id);
      if (!item) return;

      let updatedInWooCommerce = false;
      // Attempt to update in WooCommerce if user is signed in and item has WooCommerce key
      if (isSignedIn && item.woo_item_key && import.meta.env.VITE_WOO_SITE_URL) {
        try {
          const nonce = await generateNonce();
          const response = await fetch(`${import.meta.env.VITE_WOO_SITE_URL}/wp-json/wc/store/cart/update-item`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-WC-Store-API-Nonce': nonce || '',
            },
            body: JSON.stringify({
              key: item.woo_item_key,
              quantity: quantity,
            }),
          });

          if (response.ok) {
            updatedInWooCommerce = true;
          } else {
            console.warn('Failed to update WooCommerce cart, updating local cart only.');
          }
        } catch (wooError) {
          console.warn('Error updating WooCommerce cart, updating local cart only:', wooError);
        }
      }

      // Always update local cart, regardless of WooCommerce sync status
      setItems(prev => prev.map(cartItem => 
        cartItem.id === id ? { ...cartItem, quantity } : cartItem
      ));

    } catch (error) {
      console.error('Failed to update cart:', error);
      toast({
        title: t('cart.error', { defaultValue: 'Error' }),
        description: t('cart.updateError', { defaultValue: 'Failed to update cart' }),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    
    try {
      // Attempt to clear WooCommerce cart if user is signed in
      if (isSignedIn && import.meta.env.VITE_WOO_SITE_URL) {
        try {
          const nonce = await generateNonce();
          const response = await fetch(`${import.meta.env.VITE_WOO_SITE_URL}/wp-json/wc/store/cart/remove-item`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-WC-Store-API-Nonce': nonce || '',
            },
          });

          if (!response.ok) {
            console.warn('Failed to clear WooCommerce cart, clearing local cart only');
          }
        } catch (wooError) {
          console.warn('Error clearing WooCommerce cart, clearing local cart only:', wooError);
        }
      }

      // Always clear local cart
      setItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Clear local cart even if WooCommerce clear fails
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      totalPrice,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      syncWithWooCommerce,
    }}>
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
