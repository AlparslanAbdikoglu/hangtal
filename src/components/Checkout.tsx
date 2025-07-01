import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@clerk/clerk-react';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { getToken, isSignedIn } = useAuth();
  const [cart, setCart] = useState(null);
  const [billing, setBilling] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address_1: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
  });
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  // Fetch cart data from CoCart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!isSignedIn) {
          setError(t('auth.notSignedIn') || 'You must be signed in');
          return;
        }
        const token = await getToken();
        if (!token) {
          setError(t('auth.noToken') || 'No JWT token available');
          return;
        }
        const response = await axios.get(`${import.meta.env.VITE_WOO_SITE_URL}/wp-json/cocart/v2/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(response.data);
      } catch (err) {
        setError(t('cart.loadError') || `Failed to load cart: ${err.message}`);
      }
    };
    fetchCart();
  }, [t, getToken, isSignedIn]);

  // Handle input changes for billing fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  // Handle checkout submission
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      setError(t('auth.notSignedIn') || 'You must be signed in');
      return;
    }
    if (!stripe || !elements) {
      setError(t('checkout.stripeError') || 'Stripe is not initialized');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error(t('auth.noToken') || 'No JWT token available');
      }

      // Step 1: Create order via CoCart
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_WOO_SITE_URL}/wp-json/cocart/v2/checkout`,
        {
          billing_address: billing,
          shipping_address: billing, // Adjust if shipping differs
          payment_method: 'stripe',
          customer_note: '',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const orderId = orderResponse.data.order_id;
      const orderTotal = parseFloat(orderResponse.data.totals.total) / 100; // Convert from cents

      // Step 2: Create Stripe Payment Intent via custom endpoint
      const paymentIntentResponse = await axios.post(
        `${import.meta.env.VITE_WOO_SITE_URL}/wp-json/wc-stripe/v1/payment_intent`,
        {
          order_id: orderId,
          amount: Math.round(orderTotal * 100), // Convert to cents
          currency: 'usd', // Adjust based on your store's currency
          description: `Order #${orderId} from Your Store`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { client_secret } = paymentIntentResponse.data;

      // Step 3: Confirm payment with Stripe JS SDK
      const paymentResult = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${billing.first_name} ${billing.last_name}`,
            email: billing.email,
            address: {
              line1: billing.address_1,
              city: billing.city,
              state: billing.state,
              postal_code: billing.postcode,
              country: billing.country,
            },
          },
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
        setProcessing(false);
        return;
      }

      // Step 4: Finalize order if payment succeeds
      if (paymentResult.paymentIntent.status === 'succeeded') {
        await axios.put(
          `${import.meta.env.VITE_WOO_SITE_URL}/wp-json/wc/v3/orders/${orderId}`,
          { status: 'processing' },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        // Clear cart
        await axios.post(
          `${import.meta.env.VITE_WOO_SITE_URL}/wp-json/cocart/v2/cart/clear`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        onClose();
        window.location.href = '/thank-you'; // Adjust as needed
      }
    } catch (err) {
      setError(t('cart.checkoutError') || `Checkout failed: ${err.message}`);
    }
    setProcessing(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('checkout.title') || 'Checkout'}</DialogTitle>
        </DialogHeader>
        {cart ? (
          <form onSubmit={handleCheckout}>
            <div className="space-y-4">
              <h3>{t('cart.title') || 'Cart'}</h3>
              <ul>
                {cart.items.map((item: any) => (
                  <li key={item.item_key} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>€{(item.totals.line_total / 100).toFixed(2)}</span>
                  </li>
                ))}
                <li className="font-bold">
                  <span>{t('cart.total') || 'Total'}</span>
                  <span>€{(cart.totals.total / 100).toFixed(2)}</span>
                </li>
              </ul>
              <h3>{t('checkout.billingDetails') || 'Billing Details'}</h3>
              <div className="grid gap-4">
                <input
                  type="text"
                  name="first_name"
                  placeholder={t('checkout.firstName') || 'First Name'}
                  value={billing.first_name}
                  onChange={handleInputChange}
                  required
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder={t('checkout.lastName') || 'Last Name'}
                  value={billing.last_name}
                  onChange={handleInputChange}
                  required
                  className="p-2 border rounded"
                />
                <input
                  type="email"
                  name="email"
                  placeholder={t('checkout.email') || 'Email'}
                  value={billing.email}
                  onChange={handleInputChange}
                  required
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="address_1"
                  placeholder={t('checkout.address') || 'Address'}
                  value={billing.address_1}
                  onChange={handleInputChange}
                  required
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="city"
                  placeholder={t('checkout.city') || 'City'}
                  value={billing.city}
                  onChange={handleInputChange}
                  required
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="state"
                  placeholder={t('checkout.state') || 'State'}
                  value={billing.state}
                  onChange={handleInputChange}
                  required
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="postcode"
                  placeholder={t('checkout.postcode') || 'Postcode'}
                  value={billing.postcode}
                  onChange={handleInputChange}
                  required
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="country"
                  placeholder={t('checkout.country') || 'Country (e.g., US)'}
                  value={billing.country}
                  onChange={handleInputChange}
                  required
                  className="p-2 border rounded"
                />
              </div>
              <h3>{t('checkout.payment') || 'Payment'}</h3>
              <CardElement options={{ style: { base: { fontSize: '16px', color: '#000', '::placeholder': { color: '#aab7c4' } } } }} />
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                {t('checkout.cancel') || 'Cancel'}
              </Button>
              <Button type="submit" disabled={!stripe || processing || !isSignedIn}>
                {processing ? t('checkout.processing') || 'Processing...' : t('checkout.payNow') || 'Pay Now'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <p>{t('cart.loading') || 'Loading cart...'}</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Wrap the component with Stripe Elements
const WrappedCheckout = (props: { onClose: () => void }) => (
  <Elements stripe={stripePromise}>
    <Checkout {...props} />
  </Elements>
);

export default WrappedCheckout;