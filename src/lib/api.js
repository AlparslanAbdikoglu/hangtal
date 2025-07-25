import axios from "axios";
import CryptoJS from "crypto-js";

const CONSUMER_KEY = import.meta.env.VITE_WOO_CONSUMER_KEY;
const CONSUMER_SECRET = import.meta.env.VITE_WOO_CONSUMER_SECRET;
const PROJECT_URL = import.meta.env.VITE_PROJECT_URL;
const API_URL = import.meta.env.VITE_WOO_API_URL;
const WP_USER_API_URL = `${PROJECT_URL}wp-json/wp/v2/users`;
const WP_ADMIN_USERNAME = import.meta.env.WP_ADMIN_USERNAME;
const WP_ADMIN_PASSWORD = import.meta.env.WP_ADMIN_PASSWORD;


// Function to generate OAuth signature
const generateOAuthSignature = (url, method = 'GET', params = {}) => {
    const nonce = Math.random().toString(36).substring(2);
    const timestamp = Math.floor(Date.now() / 1000);
  
    const oauthParams = {
      oauth_consumer_key: CONSUMER_KEY,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_version: '1.0',
    };
  
    const allParams = { ...oauthParams, ...params };
  
    const paramString = Object.keys(allParams)
      .sort()
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`)
      .join('&');
  
    const baseUrl = url.split('?')[0]; // Ensure no query params in the base URL
    const baseString = `${method.toUpperCase()}&${encodeURIComponent(baseUrl)}&${encodeURIComponent(paramString)}`;
    const signingKey = `${encodeURIComponent(CONSUMER_SECRET)}&`;
  
    const signature = CryptoJS.HmacSHA1(baseString, signingKey).toString(CryptoJS.enc.Base64);
  
    return { ...oauthParams, oauth_signature: encodeURIComponent(signature) };
};

const api = axios.create({
    baseURL: API_URL
})

// Get all Products from WooCommerce Store
export const getAllProducts = async() => {

    try{

      const url = `${API_URL}/products`
      const oauthParams = generateOAuthSignature(url)
      const response = await api.get("/products", {
        params: oauthParams
      })

      return response.data

    } catch(error){
      console.log(error)
    }
}

// Read Single Product Data by ID
export const getSingleProductData = async (productID) => {

  try{
    const url = `${API_URL}/products/${productID}`
    const oauthParams = generateOAuthSignature(url)
    const response = await api.get(`/products/${productID}`, {
      params: oauthParams
    })
    return response.data
  } catch(error){
    console.log(error)
  }
}

// Register User API
export const registerStoreUser = async(userInfo) => {
  try {
   const authHeader = "Basic " + btoa(`${WP_ADMIN_USERNAME}:${WP_ADMIN_PASSWORD}`);

const response = await api.post(WP_USER_API_URL, userInfo, {
  headers: {
    Authorization: authHeader
  }
});
    return response.data;
  } catch (error) {
    console.log(error);
  }
}


// Login User API
export const loginUser = async(userInfo) => {
  try{

    const response = await api.post(`${PROJECT_URL}wp-json/jwt-auth/v1/token`, userInfo)
    return response.data
  } catch(error){
    console.log(error)
  }
}

// Create an Order in WooCommerce
export const createAnOrder = async(userInfo) => {
  try{

    const cartItems = JSON.parse(localStorage.getItem("cart")) || []
    
    // Check cart items
    if(!cartItems.length){
      console.log("Cart is empty")
      return false
    }

    const lineItems = cartItems.map( (item) => ({
      product_id: item.id,
      quantity: item.quantity
    }) )

    const data = {
      ...userInfo,
      line_items: lineItems
    }

    const url = `${API_URL}/orders`

    const oauthParams = generateOAuthSignature(url, "POST")

    // Generate Oauth Header
    const oauthHeader = Object.keys(oauthParams)
    .map( (key) => `${key}=${encodeURIComponent(oauthParams[key])}` )
    .join(", ")

    const response = await api.post("/orders", data, {
      headers: {
        Authorization: `OAuth ${oauthHeader}`
      }
    })

    return response.data
  } catch(error){
    console.log(error)
  }
}

// To get User Data
export const getLoggedInUserData = async(token) => {

  try{

    const response = await api.get(`${WP_USER_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.data
  } catch(error){
    console.log(error)
  }
}

// Fetch all Orders by User Id
export const getOrdersByUserId = async(userid) => {

  try{

    const url = `${API_URL}/orders`

    const oauthParams = generateOAuthSignature(url, "GET", {
      customer: userid
    })

    const response = await api.get("/orders", {
      params: {
        ...oauthParams,
        customer: userid
      }
    })

    return response.data
  } catch(error){
    console.log(error)
  }
}

// Get Single Order Data
export const getSingleOrderData = async(orderId) => {
  try{

    const url = `${API_URL}/orders/${orderId}`

    const oauthParams = generateOAuthSignature(url)

    const response = await api.get(`/orders/${orderId}`, {
      params: oauthParams
    })

    return response.data
  } catch(error){
    console.log(error)
  }
}

// Delete Order by Order Id
export const deleteOrderById = async(orderId) => {
  try{
    const url = `${API_URL}/orders/${orderId}`

    const oauthParams = generateOAuthSignature(url, "DELETE")
    
    // Generate OAuth Header
    const oauthHeader = Object.keys(oauthParams).map( (key) => `${key}="${ encodeURIComponent(oauthParams[key]) }"` ).join(", ")

    const response = await api.delete(`/orders/${orderId}`, {
      headers: {
        Authorization: `OAuth ${oauthHeader}`
      }
    })

    return response.data
  } catch(error){
    console.log(error)
  }
}