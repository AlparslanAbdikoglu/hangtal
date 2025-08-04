import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { myStoreHook } from "@/MyStoreContext";
import { toast } from "react-toastify";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
  billing: Billing;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCartItem, loggedInUserData } = myStoreHook();
  const userData = loggedInUserData || {};

  const [isLoading, setIsLoading] = useState(false);

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    customer_id: userData?.id || "",
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

  const handleCheckoutSubmit = async (e: FormEvent | React.MouseEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsLoading(true);

    try {
      // Call your WordPress backend to create a Stripe checkout session
      const response = await fetch(
        "https://zvukovaakademia.sk/wp-json/stripe/v1/create-checkout-session", // Adjust to your WP REST endpoint
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            products: cart.map((item) => ({
              id: item.id,
              quantity: item.quantity || 1,
            })),
            userEmail: checkoutData.billing.email,
            billing: checkoutData.billing, // optionally send billing info
            customer_id: checkoutData.customer_id,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url; // redirect to Stripe checkout
      } else {
        toast.error(data.error || "Stripe session creation failed.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate Stripe checkout.");
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center text-lg">
          Your cart is empty.
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-5xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

          {/* Billing Form */}
          <form onSubmit={handleCheckoutSubmit} className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                "first_name",
                "last_name",
                "address_1",
                "city",
                "state",
                "postcode",
                "country",
                "phone",
                "email",
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  type={field === "email" ? "email" : "text"}
                  placeholder={field
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                  onChange={handleInputChange}
                  className="border p-2"
                  required={true}
                  value={(checkoutData.billing as any)[field]}
                />
              ))}
            </div>

            <button
              type="submit"
              className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700"
              disabled={isLoading}
            >
              {isLoading ? "Redirecting to Stripe..." : "Pay with Stripe"}
            </button>
          </form>

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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
