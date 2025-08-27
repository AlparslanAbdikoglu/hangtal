import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [totalAmount, setTotalAmount] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    localStorage.removeItem("cart");

    const fetchSessionDetails = async () => {
      try {
        const res = await fetch(
          `https://zvukovaakademia.sk/wp-json/stripe/v1/checkout-session/${sessionId}`
        );
        if (!res.ok) {
          throw new Error(`Server responded with status ${res.status}`);
        }
        const data = await res.json();
        if (data.amount_total) {
          setTotalAmount((data.amount_total / 100).toFixed(2));
        } else {
          throw new Error("No amount_total in session");
        }
      } catch (err) {
        setError("Failed to load payment info.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchSessionDetails();
    else {
      setError("Missing session ID.");
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
          <p className="text-sm text-gray-500">
            Hamarosan kapni fog egy email megerősítést a rendelés részleteivel.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">Fizetett összeg: {totalAmount} €</p>
          </div>
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
  );
};

export default PaymentSuccess;
