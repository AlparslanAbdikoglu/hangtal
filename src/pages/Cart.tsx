import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { myStoreHook } from "@/MyStoreContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer"; // <-- import Footer
import { FaRegFrown } from "react-icons/fa";
import { toast } from "react-toastify";

interface Product {
  id: number;
  name: string;
  price: string | number;
  regular_price?: string;
  sale_price?: string;
  quantity?: number;
  images?: { src: string }[];
  [key: string]: any;
}

const Cart = () => {
  const { t } = useTranslation();
  const { isAuthenticated, cart, removeItemsFromCart } = myStoreHook();
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(cart || []);
  }, [cart]);

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
    const regular = parseFloat(
      (product.regular_price ?? product.price ?? "0").toString()
    );
    const sale = product.sale_price
      ? parseFloat(product.sale_price.toString())
      : undefined;

    return sale !== undefined ? (
      <>
        <span className="line-through text-gray-400 mr-2">${regular.toFixed(2)}</span>
        <span className="text-red-600">${sale.toFixed(2)}</span>
      </>
    ) : (
      <>${regular.toFixed(2)}</>
    );
  };

  const calculateTotalItemsPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const regular = parseFloat(
          (item.regular_price ?? item.price ?? "0").toString()
        );
        const sale = item.sale_price
          ? parseFloat(item.sale_price.toString())
          : undefined;
        const price = sale !== undefined ? sale : regular;
        const quantity = item.quantity || 1;
        return total + price * quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-8 min-h-[70vh]">
        <h1 className="text-2xl font-bold mb-6">{t("cart.title")}</h1>

        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500">
            <FaRegFrown className="mx-auto mb-4 text-6xl" />
            <p>{t("cart.emptyMessage")}</p>
            <table className="min-w-full border mt-6">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">{t("cart.image")}</th>
                  <th className="p-3 border-b">{t("cart.product")}</th>
                  <th className="p-3 border-b">{t("cart.unitPrice")}</th>
                  <th className="p-3 border-b">{t("cart.quantity")}</th>
                  <th className="p-3 border-b">{t("cart.action")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 text-center text-gray-400" colSpan={5}>
                    {t("cart.noItems")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">{t("cart.image")}</th>
                  <th className="p-3 border-b">{t("cart.product")}</th>
                  <th className="p-3 border-b">{t("cart.unitPrice")}</th>
                  <th className="p-3 border-b">{t("cart.quantity")}</th>
                  <th className="p-3 border-b">{t("cart.action")}</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={item.id ?? index} className="border-t">
                    <td className="p-3">
                      <img
                        src={item?.images?.[0]?.src || "/placeholder.svg"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{renderProductPrice(item)}</td>
                    <td className="p-3">{item.quantity || 1}</td>
                    <td className="p-3">
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
              <h3 className="text-xl font-semibold">
                {t("cart.total")}: ${calculateTotalItemsPrice()}
              </h3>

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
