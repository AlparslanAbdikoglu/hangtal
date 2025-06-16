
import axios from "axios";

const woocommerceApi = axios.create({
  baseURL: import.meta.env.VITE_WOO_API_URL,
  auth: {
    username: import.meta.env.VITE_WC_CONSUMER_KEY,
    password: import.meta.env.VITE_WC_CONSUMER_SECRET,
  },
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async () => {
  const response = await woocommerceApi.get("/products");
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await woocommerceApi.post("/orders", orderData);
  return response.data;
};
