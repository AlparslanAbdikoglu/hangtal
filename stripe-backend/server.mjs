import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

app.options('*', cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/api/checkout-session/:id', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    res.json(session);
  } catch (error) {
    console.error('Error fetching Stripe session:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/create-checkout-session', async (req, res) => {
  console.log('POST /create-checkout-session body:', req.body);

  try {
    const { products, userEmail } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const WOO_API_BASE = process.env.WOO_API_BASE_URL || '';
    const WOO_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
    const WOO_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';

    const detailedProducts = await Promise.all(
      products.map(async (product) => {
        const response = await fetch(
          `${WOO_API_BASE}/products/${product.id}?consumer_key=${WOO_CONSUMER_KEY}&consumer_secret=${WOO_CONSUMER_SECRET}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch product ${product.id}: ${response.statusText}`);
        }

        const data = await response.json();
        return {
          ...data,
          quantity: product.quantity || 1,
        };
      })
    );

    const lineItems = detailedProducts.map(product => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: product.name,
          images: product.images?.map(img => img.src) || [],
        },
        unit_amount: Math.round(parseFloat(product.price || product.regular_price) * 100),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `https://api.lifeisnatural.eu/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://api.lifeisnatural.eu/cart/`,
      customer_email: userEmail || undefined,
    });

    res.json({ id: session.id, url: session.url });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/create-order', async (req, res) => {
  const { items, billing, totalPrice } = req.body;

  if (!billing || !billing.first_name || !billing.email) {
    return res.status(400).json({ error: 'Incomplete billing information' });
  }

  try {
    const WOO_API_BASE = process.env.WOO_API_BASE_URL || '';
    const WOO_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
    const WOO_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';

    const response = await fetch(`${WOO_API_BASE}/orders`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${WOO_CONSUMER_KEY}:${WOO_CONSUMER_SECRET}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_method: 'stripe',
        payment_method_title: 'Stripe',
        set_paid: false,
        billing,
        line_items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('WooCommerce API error:', response.status, errorBody);
      return res.status(response.status).json({ error: errorBody });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Error creating WooCommerce order:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`✅ Stripe backend running on port ${PORT}`));
