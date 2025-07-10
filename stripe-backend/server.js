require('dotenv').config({ path: './.env' });
const express = require('express');
const fetch = require('node-fetch'); // If not installed, `npm install node-fetch@2`

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());

// Stripe checkout endpoint (yours)
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, userEmail } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.DOMAIN}/success.html`,
      cancel_url: `${process.env.DOMAIN}/cancel.html`,
      customer_email: userEmail || undefined,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// WooCommerce proxy endpoint
app.get('/api/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const response = await fetch(
      `${process.env.WOO_API_BASE}/products/${productId}?consumer_key=${process.env.WOO_CONSUMER_KEY}&consumer_secret=${process.env.WOO_CONSUMER_SECRET}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: `WooCommerce API error: ${response.statusText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('WooCommerce proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// You can add more WooCommerce proxy endpoints (categories, products list, etc.)

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
