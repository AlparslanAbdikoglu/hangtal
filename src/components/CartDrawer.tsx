import { useState } from 'react';
import { Button } from './ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@clerk/clerk-react';
// We no longer need the custom Checkout component since we are redirecting.
// import Checkout from './Checkout';

export const CartDrawer = ({ open, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) => {
  const { items, itemCount, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // FIX: This function now redirects to the standard WooCommerce checkout page.
  const handleCheckout = () => {
    if (!isSignedIn) {
      alert(t('auth.notSignedIn') || 'Please sign in to proceed to checkout');
      return;
    }

    if (itemCount === 0) {
        return; // Don't redirect if the cart is empty
    }

    setIsRedirecting(true);
    
    // Construct the checkout URL from your environment variables
    const checkoutUrl = `${import.meta.env.VITE_WOO_SITE_URL}/checkout`;
    
    // Redirect the user
    window.location.href = checkoutUrl;
  };

  return (
    <>
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
              {t('cart.title')} ({itemCount})
              {items.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearCart} disabled={isRedirecting}>
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
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-medium line-clamp-2 text-sm">{item.title}</h4>
                        <p className="text-primary font-bold">€{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(String(item.item_key), item.quantity - 1)}
                          disabled={isRedirecting}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(String(item.item_key), item.quantity + 1)}
                          disabled={isRedirecting}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 ml-2"
                          onClick={() => removeFromCart(String(item.item_key))}
                          disabled={isRedirecting}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">{t('cart.total')}</span>
                    <span className="text-lg font-bold">€{totalPrice.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={handleCheckout}
                    disabled={isRedirecting || itemCount === 0}
                  >
                    {isRedirecting ? t('cart.redirecting', 'Redirecting...') : t('cart.checkout')}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
      {/* We no longer need to render the custom Checkout component */}
    </>
  );
};

export default CartDrawer;
