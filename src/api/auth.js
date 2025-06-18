// my-webshop/frontend/src/api/auth.js
import axios from 'axios';

// The base URL for your WordPress REST API, e.g., "https://lifeisnatural.eu/wp-json/"
// Ensure REACT_APP_WOO_API_URL is configured in your .env file
const WP_REST_BASE_URL = process.env.REACT_APP_WOO_API_URL
    ? process.env.REACT_APP_WOO_API_URL.replace('/wc/v3/', '/') // Adjust to get base wp-json/ URL
    : '';

// The endpoint on your custom WordPress plugin that exchanges Clerk JWT for WP JWT
const CLERK_TO_WP_JWT_ENDPOINT = `${WP_REST_BASE_URL}react-woo/v1/auth-jwt`;

if (!WP_REST_BASE_URL) {
    console.error("REACT_APP_WOO_API_URL is not defined. Cannot determine WordPress REST API base URL.");
}

/**
 * Function to exchange a Clerk JWT for a WordPress JWT.
 * This is called after a user authenticates with Clerk in the frontend.
 *
 * @param {string} clerkToken The JWT token obtained from Clerk.
 * @returns {Promise<object>} A promise that resolves to an object containing the WordPress JWT, user ID, etc.
 */
export const getWordPressToken = async (clerkToken) => {
    try {
        // Send the Clerk token in the Authorization header as a Bearer token.
        // The WordPress permission_callback `rwc_clerk_auth_and_set_user` will validate this.
        const response = await axios.post(
            CLERK_TO_WP_JWT_ENDPOINT,
            {}, // Empty body as token is in header
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${clerkToken}`,
                },
            }
        );
        return response.data; // Expected: { token: "...", user_id: "...", user_email: "..." }
    } catch (error) {
        console.error(
            'Error exchanging Clerk token for WordPress JWT:',
            error.response ? error.response.data : error.message
        );
        throw error;
    }
};

// Optional: Axios instance for making authenticated calls to standard WooCommerce/WordPress REST API
// You'll set the WordPress JWT here after you obtain it.
// This instance will be used for actions like adding to cart, checkout, etc.
export const authenticatedWcApi = axios.create({
    baseURL: process.env.REACT_APP_WOO_API_URL, // Standard WC API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Sets the WordPress JWT for subsequent authenticated API calls.
 * This should be called once you receive the WordPress JWT from getWordPressToken.
 * @param {string} wpJwt The WordPress JWT.
 */
export const setWordPressJwt = (wpJwt) => {
    if (wpJwt) {
        authenticatedWcApi.defaults.headers.common['Authorization'] = `Bearer ${wpJwt}`;
    } else {
        delete authenticatedWcApi.defaults.headers.common['Authorization'];
    }
};
