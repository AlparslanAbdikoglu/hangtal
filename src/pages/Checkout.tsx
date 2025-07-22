import React, { useState, ChangeEvent, FormEvent } from "react";
import { createAnOrder } from "../lib/api.js"; // your order creation function
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Billing {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

interface CheckoutData {
  customer_id: string | number;
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: Billing;
}

interface Product {
  id: number;
  product_id: number;
  name: string;
  price?: string; // fallback price string
  regular_price?: string;
  sale_price?: string | null;
  quantity: number;
  variation_id?: number | null;
  images?: { src: string }[];
}

interface CheckoutProps {
  clearCartItem: () => void;
  loggedInUserData: string; // JSON string user data from your auth system
  cartItems: Product[];
}

const Checkout: React.FC<CheckoutProps> = ({
  clearCartItem,
  loggedInUserData,
  cartItems,
}) => {
  const navigate = useNavigate();

  // Calculate total price from cart items (use sale_price > regular_price > price)
  const totalPrice = cartItems.reduce((sum, item) => {
    const priceStr = item.sale_price || item.regular_price || item.price || "0";
    const priceNum = parseFloat(priceStr);
    return sum + priceNum * item.quantity;
  }, 0);

  const userData = JSON.parse(loggedInUserData || "{}");

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    customer_id: userData.id || "",
    payment_method: "cod",
    payment_method_title: "Cash on Delivery",
    set_paid: false,
    billing: {
      first_name: "",
      last_name: "",
      address_1: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
      email: userData.email || "",
      phone: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [useStripe, setUseStripe] = useState(false); // toggle payment method

  // Update billing form fields
  const handleOnChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCheckoutData((prev) => ({
      ...prev,
      billing: {
        ...prev.billing,
        [name]: value,
      },
    }));
  };

  // Handle form submit or stripe checkout button
  const handleCheckoutSubmit = async (event: FormEvent | React.MouseEvent) => {
    if ("preventDefault" in event) event.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (useStripe) {
      // Stripe Hosted Checkout flow
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://api.lifeisnatural.eu/wp-json/wc/v3/stripe-checkout",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cart_items: cartItems.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                variation_id: item.variation_id || null,
              })),
              user_email: checkoutData.billing.email,
              user_id: userData.id || undefined,
              success_url: window.location.origin + "/payment-success",
              cancel_url: window.location.origin + "/cart",
              billing: checkoutData.billing, // optional billing info
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.checkout_url) {
          window.location.href = data.checkout_url;
        } else {
          toast.error(data.error || "Failed to create Stripe checkout session");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Checkout error:", error);
        toast.error("Network error occurred");
        setIsLoading(false);
      }
      return;
    }

    // Cash on Delivery - create order directly
    setIsLoading(true);
    try {
      await createAnOrder(checkoutData);
      toast.success("Order has been placed successfully.");
      clearCartItem();
      navigate("/products");
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <div className="text-center py-10">Your cart is empty.</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Checkout</h1>

      <div className="mb-4">
        <label className="form-label me-3">
          <input
            type="radio"
            name="payment_method"
            value="cod"
            checked={!useStripe}
            onChange={() => setUseStripe(false)}
          />{" "}
          Cash on Delivery
        </label>
        <label className="form-label">
          <input
            type="radio"
            name="payment_method"
            value="stripe"
            checked={useStripe}
            onChange={() => setUseStripe(true)}
          />{" "}
          Pay with Stripe
        </label>
      </div>

      {!useStripe && (
        <form onSubmit={handleCheckoutSubmit}>
          {/* Billing fields here... (same as before) */}
          {/* ... */}

          <div className="text-center">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </form>
      )}

      {useStripe && (
        <div>
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <ul className="mb-4">
            {cartItems.map((item) => (
              <li key={item.id} className="mb-2">
                {item.name} x {item.quantity}
              </li>
            ))}
          </ul>
          <div className="mb-4 font-semibold">Total: €{totalPrice.toFixed(2)}</div>
          <button
            onClick={handleCheckoutSubmit}
            className="btn btn-primary"
            disabled={isLoading || cartItems.length === 0}
          >
            {isLoading ? "Redirecting..." : "Proceed to Stripe Checkout"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
