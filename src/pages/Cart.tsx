import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { myStoreHook } from "@/MyStoreContext";
import { Navbar } from "@/components/Navbar";
import { FaRegFrown } from "react-icons/fa"; // sad icon

interface Product {
  id: number;
  name: string;
  price: string;
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
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(cart || []);
  }, [cart]);

  const handleStripeCheckout = async () => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/cart");
      return navigate("/login");
    }

    try {
      const token = localStorage.getItem("jwtToken"); // Adjust if needed
      const response = await fetch(
  "https://api.lifeisnatural.eu/wp-json/myplugin/v1/create-checkout-session",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cart: cartItems }),
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Stripe session URL not found.");
      }
    } catch (error) {
      console.error("Stripe checkout failed:", error);
    }
  };

  const renderProductPrice = (product: Product) => {
    return product.sale_price ? (
      <>
        <span className="line-through text-gray-400 mr-2">
          ${product.regular_price}
        </span>
        <span className="text-red-600">${product.sale_price}</span>
      </>
    ) : (
      <>${product.regular_price || product.price}</>
    );
  };

  const calculateTotalItemsPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(item.sale_price || item.regular_price || "0");
        const quantity = item.quantity || 1;
        return total + price * quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-8">
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
                  <tr key={index} className="border-t">
                    <td className="p-3">
                      <img
                        src={item?.images?.[0]?.src}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{renderProductPrice(item)}</td>
                    <td className="p-3">{item.quantity || 1}</td>
                    <td className="p-3">
                      <button
                        onClick={() => removeItemsFromCart(item)}
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
                className="bg-yellow-600 text-white px-6 py-2 rounded-full hover:bg-yellow-700 transition"
                onClick={handleStripeCheckout}
              >
                {t("cart.checkout")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
