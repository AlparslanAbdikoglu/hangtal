import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import swal from "sweetalert";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { getOrdersByUserId, getSingleOrderData, deleteOrderById } from "../lib/api";
import { useTranslation } from "react-i18next";

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

interface MyOrdersProps {
  loggedInUserData: string;
  setPageLoading: (loading: boolean) => void;
}

const MyOrders: React.FC<MyOrdersProps> = ({ loggedInUserData, setPageLoading }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);
  const [showRecent, setShowRecent] = useState(false);

  const user = loggedInUserData ? JSON.parse(loggedInUserData) : null;
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  // ✅ Fetch all WooCommerce orders for the logged-in user
  const fetchOrders = async () => {
    if (!user?.id) return;
    setPageLoading(true);
    try {
      const data = await getOrdersByUserId(user.id);
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setPageLoading(false);
    }
  };

  // ✅ If redirected from Stripe success, fetch the latest Stripe session and highlight it
  const fetchStripeSession = async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(
        `https://zvukovaakademia.sk/wp-json/stripe/v1/checkout-session/${sessionId}`
      );
      const session = await res.json();
      if (session.metadata?.order_id) {
        const order = await getSingleOrderData(session.metadata.order_id);
        setRecentOrder(order);
        setShowRecent(true);
      }
    } catch (err) {
      console.error("Failed to fetch Stripe session/order:", err);
    }
  };

  // Delete order
  const handleDelete = (id: number) => {
    swal({
      title: t("myOrders.deleteConfirmTitle", "Are you sure?"),
      text: t("myOrders.deleteConfirmText", "Do you really want to delete this order?"),
      icon: "warning",
      dangerMode: true,
      buttons: [t("common.cancel", "Cancel"), t("common.delete", "Delete")],
    }).then(async (confirm) => {
      if (confirm) {
        await deleteOrderById(id);
        fetchOrders();
      }
    });
  };

  useEffect(() => {
    fetchOrders();
    fetchStripeSession();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t("myOrders.title", "My Orders")}</h1>

        {/* ✅ Show recent Stripe order success */}
        {showRecent && recentOrder && (
          <Card className="mb-10 border-green-500 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">
                {t("payment.successTitle", "Fizetés sikeres!")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p>{t("payment.successText", "Köszönjük a vásárlást! A rendelését feldolgoztuk.")}</p>
              <p className="text-sm text-gray-500">
                {t("payment.confirmationText", "Hamarosan kapni fog egy email megerősítést.")}
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">
                  {t("payment.amountPaid", "Fizetett összeg")}: {recentOrder.currency_symbol || "€"}{" "}
                  {recentOrder.total}
                </p>
              </div>

              <div className="text-left bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{t("payment.items", "Rendelt termékek")}:</h3>
                <ul className="list-disc pl-6">
                  {recentOrder.line_items?.map((i) => (
                    <li key={i.id}>
                      {i.name} ({i.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ✅ Order list */}
        {orders.length === 0 ? (
          <div className="text-center text-gray-600 py-20">
            {t("myOrders.noOrders", "You have no orders yet.")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">{t("myOrders.date", "Date")}</th>
                  <th className="p-2 text-left">{t("myOrders.status", "Status")}</th>
                  <th className="p-2 text-left">{t("myOrders.total", "Total")}</th>
                  <th className="p-2 text-left">{t("myOrders.items", "Items")}</th>
                  <th className="p-2 text-left">{t("myOrders.actions", "Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="p-2">{o.id}</td>
                    <td className="p-2">{new Date(o.date_created).toLocaleDateString()}</td>
                    <td className="p-2">{o.status}</td>
                    <td className="p-2">
                      {o.currency_symbol || "€"} {o.total || "0.00"}
                    </td>
                    <td className="p-2">
                      {o.line_items?.length ? (
                        <ul className="list-disc pl-5">
                          {o.line_items.map((i) => (
                            <li key={i.id}>
                              {i.name} ({i.quantity})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-2">
                      {o.status === "completed" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(o.id)}
                        >
                          {t("common.delete", "Delete")}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
