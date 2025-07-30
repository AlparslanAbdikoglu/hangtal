import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { myStoreHook } from "@/MyStoreContext";
import { createAnOrder } from "@/lib/api";
import { toast } from "react-toastify";
import { Navbar } from "@/components/Navbar";  // <-- added
import { Footer } from "@/components/Footer";  // <-- added

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

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCartItem, loggedInUserData } = myStoreHook();
  const userData = loggedInUserData || {};

  const [useStripe, setUseStripe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    customer_id: userData?.id || "",
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
      email: userData?.email || "",
      phone: "",
    },
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({
      ...prev,
      billing: {
        ...prev.billing,
        [name]: value,
      },
    }));
  };

  const totalPrice = cart.reduce((total, item) => {
    const price =
      parseFloat(item.sale_price || item.regular_price || item.price || "0") *
      (item.quantity || 1);
    return total + price;
  }, 0);

  const handleCheckoutSubmit = async (
    e: FormEvent | React.MouseEvent
  ) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsLoading(true);

    if (useStripe) {
      // Stripe Hosted Checkout Flow
      try {
        const response = await fetch(
          "https://api.lifeisnatural.eu/wp-json/wc/v3/stripe-checkout",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cart_items: cart.map((item) => ({
                product_id: item.id,
                quantity: item.quantity || 1,
                variation_id: item.variation_id || null,
              })),
              user_email: checkoutData.billing.email,
              user_id: userData?.id || undefined,
              success_url: window.location.origin + "/payment-success",
              cancel_url: window.location.origin + "/cart",
              billing: checkoutData.billing,
            }),
          }
        );

        const data = await response.json();
        if (response.ok && data.checkout_url) {
          window.location.href = data.checkout_url;
        } else {
          toast.error(data.error || "Stripe session failed.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to initiate Stripe checkout.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // COD Order Flow
    try {
      await createAnOrder(checkoutData);
      toast.success("Order placed successfully.");
      clearCartItem();
      navigate("/products");
    } catch (error) {
      console.error(error);
      toast.error("Order creation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-10 text-lg">Your cart is empty.</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* Payment method toggle */}
        <div className="mb-6">
          <label className="mr-4 cursor-pointer">
            <input
              type="radio"
              name="payment"
              checked={!useStripe}
              onChange={() => setUseStripe(false)}
              className="mr-2"
            />
            Cash on Delivery
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="payment"
              checked={useStripe}
              onChange={() => setUseStripe(true)}
              className="mr-2"
            />
            Pay with Stripe
          </label>
        </div>

        {/* Billing Form - show only for COD */}
        {!useStripe && (
          <form onSubmit={handleCheckoutSubmit} className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                name="first_name"
                placeholder="First Name"
                onChange={handleInputChange}
                className="border p-2"
                required
                value={checkoutData.billing.first_name}
              />
              <input
                name="last_name"
                placeholder="Last Name"
                onChange={handleInputChange}
                className="border p-2"
                required
                value={checkoutData.billing.last_name}
              />
              <input
                name="address_1"
                placeholder="Address"
                onChange={handleInputChange}
                className="border p-2"
                required
                value={checkoutData.billing.address_1}
              />
              <input
                name="city"
                placeholder="City"
                onChange={handleInputChange}
                className="border p-2"
                required
                value={checkoutData.billing.city}
              />
              <input
                name="state"
                placeholder="State"
                onChange={handleInputChange}
                className="border p-2"
                value={checkoutData.billing.state}
              />
              <input
                name="postcode"
                placeholder="Postcode"
                onChange={handleInputChange}
                className="border p-2"
                required
                value={checkoutData.billing.postcode}
              />
              <input
                name="country"
                placeholder="Country"
                onChange={handleInputChange}
                className="border p-2"
                required
                value={checkoutData.billing.country}
              />
              <input
                name="phone"
                placeholder="Phone"
                onChange={handleInputChange}
                className="border p-2"
                required
                value={checkoutData.billing.phone}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        )}

        {/* Cart Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Image</th>
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-left">Unit Price</th>
                  <th className="p-2 text-left">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  const price = parseFloat(
                    item.sale_price || item.regular_price || item.price || "0"
                  );
                  return (
                    <tr key={item.id} className="border-t">
                      <td className="p-2">
                        <img
                          src={item.images?.[0]?.src || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover"
                        />
                      </td>
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">€{price.toFixed(2)}</td>
                      <td className="p-2">{item.quantity || 1}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 font-bold text-right">
            Total: €{totalPrice.toFixed(2)}
          </div>

          {/* Stripe Payment Button */}
          {useStripe && (
            <div className="mt-6 text-center">
              <button
                onClick={handleCheckoutSubmit}
                className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700"
                disabled={isLoading}
              >
                {isLoading ? "Redirecting..." : "Proceed to Stripe Checkout"}
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Checkout;
