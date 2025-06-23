// my-webshop/frontend/src/api/auth.js

import axios from 'axios';

// Use the base URL from your WooCommerce API URL and adjust the path
const WOO_API_BASE_URL = process.env.REACT_APP_WOO_API_URL.replace('/wc/v3/', ''); // Gets https://your_domain/wp-json/
const WOO_BRIDGE_URL = `${WOO_API_BASE_URL}clerk-woo-bridge/v1/authenticate`; // Appends your custom bridge endpoint

if (!WOO_API_BASE_URL) {
    console.error("REACT_APP_WOO_API_URL is not defined. Cannot determine bridge URL.");
}

const authApi = axios.create({
    baseURL: WOO_BRIDGE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getWordPressToken = async (clerkToken) => {
    try {
        const response = await authApi.post('', { clerkToken }); // POST to the base URL (which is the endpoint)
        return response.data; // Should contain { token: "...", user_id: "..." }
    } catch (error) {
        console.error('Error getting WordPress JWT:', error.response ? error.response.data : error.message);
        throw error;
    }
};