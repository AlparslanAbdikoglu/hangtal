import React, { useState } from 'react';
import { Button } from './ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/clerk-react';

export const CartDrawer = ({ open, onOpenChange }) => {
  const { items, itemCount, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { t } = useTranslation();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();
  const { user, isSignedIn } = useUser();

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: t('cart.emptyCartError') || 'Cart is empty',
        description: 'Please add items to cart before checkout',
        variant: 'destructive',
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      // Get cart key from localStorage
      const cartKey = localStorage.getItem('cocart_cart_key') || '';
      
      if (!cartKey) {
        toast({
          title: t('cart.noCartKey') || 'Cart session not found',
          description: 'Please refresh the page and try again',
          variant: 'destructive',
        });
        setIsCheckingOut(false);
        return;
      }

      console.log('Starting checkout with cart key:', cartKey);
      console.log('Cart items:', items);

      const checkoutData: {
        cart_key: string;
        success_url: string;
        cancel_url: string;
        user_email?: string;
        user_id?: string;
      } = {
        cart_key: cartKey,
        success_url: `${window.location.origin}/payment-success`,
        cancel_url: `${window.location.origin}/cart`,
      };

      // Add user info if signed in
      if (isSignedIn && user) {
        checkoutData.user_email = user.primaryEmailAddress?.emailAddress;
        checkoutData.user_id = user.id;
      }

      console.log('Checkout data:', checkoutData);

      const response = await fetch('https://api.lifeisnatural.eu/wp-json/wc/v3/stripe-checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(checkoutData),
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success && data.checkout_url) {
        console.log('Redirecting to:', data.checkout_url);
        // Use window.location.replace for better UX
        window.location.replace(data.checkout_url);
      } else if (data.checkout_url) {
        console.log('Redirecting to checkout URL:', data.checkout_url);
        window.location.replace(data.checkout_url);
      } else {
        throw new Error(data.message || data.error || 'No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: t('cart.checkoutError') || 'Checkout failed',
        description: error.message || 'An error occurred during checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleQuantityDecrease = (itemKey, currentQuantity) => {
    if (currentQuantity <= 1) {
      removeFromCart(itemKey);
    } else {
      updateQuantity(itemKey, currentQuantity - 1);
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
                  <div key={item.item_key} className="flex items-center gap-4 p-4 border rounded-lg">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-2 text-sm">{item.title}</h4>
                      <p className="text-primary font-bold">
                        €{(typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0).toFixed(2)}
                      </p>
                      {item.variation && (
                        <p className="text-xs text-muted-foreground">{item.variation}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityDecrease(item.item_key, item.quantity)}
                        disabled={isCheckingOut}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.item_key, item.quantity + 1)}
                        disabled={isCheckingOut}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 ml-2"
                        onClick={() => removeFromCart(item.item_key)}
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
                  <span className="text-lg font-bold">
                    {t('cart.total', { amount: (typeof totalPrice === 'number' ? totalPrice : parseFloat(totalPrice) || 0).toFixed(2) })}
                  </span>
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || items.length === 0}
                >
                  {isCheckingOut ? t('cart.checkingOut') || 'Processing...' : t('cart.checkout') || 'Proceed to Checkout'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};