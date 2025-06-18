import axios from "axios";
import { authenticatedWcApi } from './auth'; // Import the authenticated Axios instance

// --- Public (Unauthenticated) Product API Calls ---
// This instance is for fetching products that do NOT require authentication.
// It points to your custom '/public-products' endpoint.
const publicProductsApi = axios.create({
  baseURL: process.env.REACT_APP_WOO_API_URL
    ? process.env.REACT_APP_WOO_API_URL.replace('/wc/v3/', '/') + 'react-woo/v1/'
    : '', // e.g., https://lifeisnatural.eu/wp-json/react-woo/v1/
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetches products for public display (does not require authentication).
 * Uses the custom `/public-products` endpoint from your WordPress plugin.
 *
 * @param {object} params Query parameters like page, per_page, category, s.
 * @returns {Promise<Array>} A promise that resolves to an array of product data.
 */
export const getPublicProducts = async (params = {}) => {
  try {
    const response = await publicProductsApi.get("/public-products", { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching public products:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// --- Authenticated API Calls (using WordPress JWT) ---

/**
 * Creates an order in WooCommerce. Requires the user to be authenticated
 * and the WordPress JWT to be set via `setWordPressJwt`.
 * This calls the standard WooCommerce REST API endpoint.
 *
 * @param {object} orderData The order details to send.
 * @returns {Promise<object>} A promise that resolves to the created order data.
 */
export const createOrder = async (orderData) => {
  try {
    // authenticatedWcApi already has the baseURL and headers configured,
    // and its Authorization header will be set dynamically by setWordPressJwt.
    const response = await authenticatedWcApi.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Example for fetching an authenticated user's orders (standard WC endpoint)
/**
 * Fetches orders for the currently authenticated user.
 * Requires the user to be authenticated and the WordPress JWT to be set.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of orders.
 */
export const getMyOrders = async () => {
    try {
        // Example: Fetching orders for the user associated with the JWT
        // You might need to filter by customer_id if the endpoint doesn't automatically
        // scope to the authenticated user.
        const response = await authenticatedWcApi.get("/orders", {
            // params: { customer: <wp_user_id> } // If needed, get wp_user_id from auth.js response
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user orders:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// You can add more authenticated functions here for cart, customer profile, etc.
