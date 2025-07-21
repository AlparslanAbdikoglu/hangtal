import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { myStoreHook } from "@/MyStoreContext";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const Cart = () => {
  const {
    cart,
    isAuthenticated,
    removeItemsFromCart,
  } = myStoreHook();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const total = cart.reduce((acc, item) => acc + parseFloat(item.price), 0).toFixed(2);

  if (cart.length === 0) {
    return <div className="p-8 text-center text-gray-500">Your cart is empty.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <ul className="space-y-4">
        {cart.map((item) => (
          <li key={item.id} className="flex items-center justify-between border p-4 rounded">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-500">${item.price}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItemsFromCart(item)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-right">
        <p className="text-xl font-bold">Total: ${total}</p>
        <Button className="mt-4" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default Cart;
