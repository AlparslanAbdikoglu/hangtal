require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use your secret key from env
const fetch = require('node-fetch');

const app = express();

const YOUR_DOMAIN = process.env.DOMAIN || 'http://api.lifeisnatural.eu'; // Default to your API domain

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// POST /create-checkout-session expects body: { products: [{ id, quantity }], userEmail }

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { products, userEmail } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // WooCommerce API credentials and base url - from env
    const WOO_API_BASE = process.env.WOO_API_BASE_URL; // e.g., https://api.lifeisnatural.eu
    const WOO_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
    const WOO_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

    // Fetch detailed product info from WooCommerce for each product in cart
    const detailedProducts = await Promise.all(
      products.map(async (product) => {
        const url = `${WOO_API_BASE}/products/${product.id}?consumer_key=${WOO_CONSUMER_KEY}&consumer_secret=${WOO_CONSUMER_SECRET}`;
        const response = await fetch(url);

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

    // Construct line items compatible with Stripe's checkout session
    const lineItems = detailedProducts.map((product) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: product.name,
          images: product.images?.map(img => img.src) || [],
        },
        unit_amount: Math.round(parseFloat(product.price || product.regular_price) * 100), // price in cents
      },
      quantity: product.quantity,
    }));

    // Create the Stripe checkout session dynamically
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cart`,
      customer_email: userEmail || undefined,
    });

    // Send the URL back to the client for redirect
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
