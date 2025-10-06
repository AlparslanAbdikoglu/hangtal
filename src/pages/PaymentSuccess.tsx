import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  date_created: string;
  status: string;
  total?: string;
  currency_symbol?: string;
  line_items?: LineItem[];
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

    if (!sessionId) {
      setError("Hiányzó session ID.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      try {
        // Your custom WP REST endpoint returns the order by Stripe session ID
        const res = await fetch(`/wp-json/stripe/v1/order-by-session/${sessionId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data: Order = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError("Nem sikerült betölteni a rendelést.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId]);

  if (loading) return <div className="text-center mt-10">Betöltés...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
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

            {order && (
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <p className="font-semibold mb-2">Rendelés ID: {order.id}</p>
                <p className="mb-2">Dátum: {new Date(order.date_created).toLocaleDateString()}</p>
                <p className="mb-2">Státusz: {order.status}</p>
                <p className="font-semibold mb-2">
                  Fizetett összeg: {order.currency_symbol || "€"} {order.total || "0.00"}
                </p>
                <div>
                  <p className="font-semibold mb-1">Termékek:</p>
                  <ul className="list-disc pl-5">
                    {order.line_items?.map(i => (
                      <li key={i.id}>
                        {i.name} ({i.quantity})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="space-y-2 mt-4">
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
