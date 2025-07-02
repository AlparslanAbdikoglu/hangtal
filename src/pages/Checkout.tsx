import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@clerk/clerk-react';

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { items: cartItems, totalPrice } = useCart();
  const { user, isSignedIn } = useUser();

  const handleStripeCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.lifeisnatural.eu/wp-json/wc/v3/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_items: cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            variation_id: item.variation_id || null,
          })),
          user_email: isSignedIn ? user?.primaryEmailAddress?.emailAddress : undefined,
          user_id: isSignedIn ? user?.id : undefined,
          success_url: window.location.origin + '/payment-success',
          cancel_url: window.location.origin + '/cart'
        }),
      });

      const data = await response.json();

      if (response.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert(data.error || 'Failed to create Stripe checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cartItems.length > 0 && !isLoading) {
      handleStripeCheckout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  if (cartItems.length === 0) {
    return <div className="text-center py-10">Your cart is empty.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <ul className="mb-4">
        {cartItems.map(item => (
          <li key={item.id} className="mb-2">
            {item.title} x {item.quantity}
          </li>
        ))}
      </ul>
      <div className="mb-4 font-semibold">Total: €{totalPrice.toFixed(2)}</div>
      <button
        onClick={handleStripeCheckout}
        className="btn btn-primary"
        disabled={isLoading || cartItems.length === 0}
      >
        {isLoading ? 'Redirecting...' : 'Proceed to Stripe Checkout'}
      </button>
    </div>
  );
};

export default Checkout;
