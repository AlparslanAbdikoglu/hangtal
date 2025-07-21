import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price?: string;
  quantity: number;
}

interface PaymentSuccessProps {
  cart: Product[];
  clearCart: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ cart, clearCart }) => {
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => {
    const priceNum = item.price ? parseFloat(item.price) : 0;
    return sum + priceNum * item.quantity;
  }, 0);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

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
            <p className="font-semibold">Fizetett összeg: {total.toFixed(2)} Ft</p>
          </div>
          <div className="space-y-2">
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Vissza a főoldalra
            </Button>
            <Button
              onClick={() => navigate("/products")}
              variant="outline"
              className="w-full"
            >
              További vásárlás
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
