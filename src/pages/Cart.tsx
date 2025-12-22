import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMyStore } from "@/MyStoreContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer"; // <-- import Footer
import { FaRegFrown } from "react-icons/fa";
import { toast } from "react-toastify";
import { DEFAULT_CURRENCY, formatMoney, getCurrencyInfo } from "@/utils/currency";

interface Product {
  id: number;
  name: string;
  price: string | number;
  regular_price?: string;
  sale_price?: string;
  quantity?: number;
  images?: { src: string }[];
  currency?: string;
  currency_symbol?: string;
  currency_code?: string;
  prices?: { currency_code?: string; currency_symbol?: string };
  price_html?: string;
  meta_data?: { key: string; value: unknown }[];
  [key: string]: unknown;
}

const Cart = () => {
  const { t } = useTranslation();
  const { isAuthenticated, cart, removeItemsFromCart } = useMyStore();
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(cart || []);
  }, [cart]);

  const cartCurrency = useMemo(
    () => (cartItems.length ? getCurrencyInfo(cartItems[0]) : DEFAULT_CURRENCY),
    [cartItems]
  );

  const parsePrices = (product: Product) => {
    const regular = parseFloat((product.regular_price ?? product.price ?? "0").toString());
    const sale = product.sale_price ? parseFloat(product.sale_price.toString()) : undefined;
    return { regular, sale };
  };

  const handleStripeCheckout = () => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/cart");
      return navigate("/login");
    }

    if (cartItems.length === 0) {
      toast.error(t("cart.emptyMessage") || "Your cart is empty.");
      return;
    }

    navigate("/checkout");
  };

  const renderProductPrice = (product: Product) => {
    const { regular, sale } = parsePrices(product);
    const currency = getCurrencyInfo(product);

    return sale !== undefined ? (
      <>
        <span className="line-through text-gray-400 mr-2">
          {formatMoney(regular, currency)}
        </span>
        <span className="text-red-600">{formatMoney(sale, currency)}</span>
      </>
    ) : (
      <>{formatMoney(regular, currency)}</>
    );
  };

  const calculateTotalItemsPrice = () => {
    const total = cartItems.reduce((current, item) => {
      const { regular, sale } = parsePrices(item);
      const price = sale !== undefined ? sale : regular;
      const quantity = item.quantity || 1;
      return current + price * quantity;
    }, 0);

    return formatMoney(total, cartCurrency);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-8 min-h-[70vh]">
        <h1 className="text-2xl font-bold mb-6">{t("cart.title")}</h1>

        {cartItems.length === 0 ? (
          <div className="text-center text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <FaRegFrown className="mx-auto mb-4 text-6xl text-gray-500" />
            <p>{t("cart.emptyMessage")}</p>
            <table className="min-w-full border mt-6">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">{t("cart.image")}</th>
                  <th className="p-3 border-b">{t("cart.product")}</th>
                  <th className="p-3 border-b">{t("cart.unitPrice")}</th>
                  <th className="p-3 border-b text-center">{t("cart.quantity")}</th>
                  <th className="p-3 border-b">{t("cart.action")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={5}>
                    {t("cart.noItems")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t("cart.itemsSection")}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-indigo-700 font-semibold border border-indigo-100">
                  Stripe
                </span>
                <span>{t("cart.secureStripe", "Secure checkout powered by Stripe")}</span>
              </div>
            </div>

            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-900">
                  <th className="p-3 border-b">{t("cart.image")}</th>
                  <th className="p-3 border-b">{t("cart.product")}</th>
                  <th className="p-3 border-b">{t("cart.unitPrice")}</th>
                  <th className="p-3 border-b text-center">{t("cart.quantity")}</th>
                  <th className="p-3 border-b">{t("cart.action")}</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={item.id ?? index} className="border-t text-gray-900">
                    <td className="p-3">
                      <img
                        src={item?.images?.[0]?.src || "/placeholder.svg"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-between sm:block">
                        <span>{item.name}</span>
                        <button
                          onClick={() =>
                            removeItemsFromCart({
                              ...item,
                              price: item.price.toString(),
                            })
                          }
                          className="text-red-600 hover:text-red-800 sm:hidden ml-2"
                        >
                          {t("cart.remove")}
                        </button>
                      </div>
                    </td>
                    <td className="p-3">{renderProductPrice(item)}</td>
                    <td className="p-3 text-center">{item.quantity || 1}</td>
                    <td className="p-3 hidden sm:table-cell">
                      <button
                        onClick={() =>
                          removeItemsFromCart({
                            ...item,
                            price: item.price.toString(),
                          })
                        }
                        className="text-red-600 hover:text-red-800"
                      >
                        {t("cart.remove")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-6 gap-4">
              <div className="flex flex-col gap-1 text-gray-900">
                <h3 className="text-xl font-semibold">
                  {t("cart.total")}: {calculateTotalItemsPrice()}
                </h3>
                <span className="text-sm text-gray-700">{t("cart.reviewItems")}</span>
              </div>

              <button
                onClick={handleStripeCheckout}
                disabled={loading || cartItems.length === 0}
                className={`bg-yellow-600 text-white px-6 py-2 rounded-full hover:bg-yellow-700 transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? t("cart.processing") || "Processing..." : t("cart.checkout")}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer /> {/* Add Footer at the bottom */}
    </>
  );
};

export default Cart;
