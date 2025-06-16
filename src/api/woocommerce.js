// my-webshop/frontend/src/api/woocommerce.js

import axios from 'axios';

// Ensure the REACT_APP_WOO_API_URL environment variable is set
const WOO_API_URL = process.env.REACT_APP_WOO_API_URL;

if (!WOO_API_URL) {
    console.error("REACT_APP_WOO_API_URL is not defined. Please check your Dockerfile/docker-compose.yml.");
}

const woocommerceApi = axios.create({
    baseURL: WOO_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add Authorization header if a token exists in local storage
woocommerceApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('woocommerce_jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getProducts = async () => {
    try {
        const response = await woocommerceApi.get('/products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const createOrder = async (orderData) => {
    try {
        const response = await woocommerceApi.post('/orders', orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error.response ? error.response.data : error.message);
        throw error;
    }
};