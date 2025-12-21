import React, { useState } from "react";
import { useMyStore } from "@/MyStoreContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Checkout: React.FC = () => {
  const { cart, loggedInUserData } = useMyStore();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!cart.length) return toast.error(t("checkout.emptyCart"));
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://zvukovaakademia.sk/wp-json/stripe/v1/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            products: cart.map((i) => ({ id: i.id, quantity: i.quantity || 1 })),
            userEmail: loggedInUserData?.email || "",
            customer_id: loggedInUserData?.id || "",
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data.url) window.location.href = data.url;
      else toast.error(data.error || t("checkout.stripeFailed"));
    } catch (err) {
      console.error(err);
      toast.error(t("checkout.stripeFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!cart.length)
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center text-lg">
          {t("checkout.emptyCart")}
        </main>
        <Footer />
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">{t("checkout.title")}</h1>

          <p className="mb-6 text-gray-700">
            {t(
              "checkout.disclaimer",
              "You will be redirected to Stripe's secure checkout page to complete your purchase."
            )}
          </p>

          <button
            onClick={handleCheckout}
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 font-semibold transition-colors w-full"
            disabled={isLoading}
          >
            {isLoading ? t("checkout.redirecting") : t("checkout.payButton")}
          </button>

          <div className="mt-6 text-left text-gray-600">
            <h2 className="font-semibold mb-2">{t("checkout.cartSummary")}</h2>
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => {
                const price =
                  parseFloat(item.sale_price || item.regular_price || item.price || "0") *
                  (item.quantity || 1);
                return (
                  <li key={item.id} className="py-2 flex justify-between">
                    <span>{item.name} ({item.quantity || 1})</span>
                    <span>€{price.toFixed(2)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 font-bold text-right">
              {t("checkout.total")}: €
              {cart
                .reduce(
                  (total, item) =>
                    total +
                    parseFloat(item.sale_price || item.regular_price || item.price || "0") *
                      (item.quantity || 1),
                  0
                )
                .toFixed(2)}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
