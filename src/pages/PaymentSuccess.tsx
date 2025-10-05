import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface LineItem {
  id: number;
  name: string;
  quantity: number;
}

interface Order {
  id: number;
  status: string;
  total?: string;
  currency_symbol?: string;
  line_items?: LineItem[];
  date_created?: string;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    localStorage.removeItem("cart");

    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setError("Missing session ID.");
        setLoading(false);
        return;
      }

      try {
        // Fetch Stripe session
        const sessionRes = await fetch(
          `/wp-json/stripe/v1/checkout-session/${sessionId}`
        );
        if (!sessionRes.ok) throw new Error("Failed to fetch Stripe session.");
        const session = await sessionRes.json();

        // Get WooCommerce order ID from metadata
        const orderId = session.metadata?.order_id;
        if (!orderId) throw new Error("No order ID in session metadata.");

        // Fetch WooCommerce order data
        const orderRes = await fetch(`/wp-json/wc/v3/orders/${orderId}`);
        if (!orderRes.ok) throw new Error("Failed to fetch order details.");
        const orderData = await orderRes.json();

        setOrder(orderData);
      } catch (err) {
        console.error(err);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Fizetés sikeres!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Köszönjük a vásárlást! A rendelését feldolgoztuk.
            </p>
            <p className="text-sm text-gray-500">
              Hamarosan kapni fog egy email megerősítést a rendelés részleteivel.
            </p>

            {order && (
              <div className="text-left bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">
                  Rendelés száma: {order.id} | Status: {order.status}
                </p>
                <p className="font-semibold mb-2">
                  Fizetett összeg: {order.currency_symbol || "$"} {order.total || "0.00"}
                </p>
                <ul className="list-disc pl-5">
                  {order.line_items?.map(item => (
                    <li key={item.id}>
                      {item.name} ({item.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-2">
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Vissza a főoldalra
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full"
              >
                További vásárlás
              </Button>
              <Button
                onClick={() => navigate("/my-orders")}
                variant="secondary"
                className="w-full"
              >
                Rendeléseim megtekintése
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
