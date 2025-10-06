import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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

interface PurchaseHistoryProps {
  loggedInUserData: string;
  setPageLoading: (loading: boolean) => void;
}

const PurchaseHistory: React.FC<PurchaseHistoryProps> = ({ loggedInUserData, setPageLoading }) => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    setPageLoading(true);
    try {
      const user = JSON.parse(loggedInUserData);
      const res = await fetch(
        `/wp-json/stripe/v1/orders-by-user/${user.id}`, // <-- your custom REST endpoint
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      // Only show completed orders
      setOrders(data.filter((o: Order) => o.status === "completed"));
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t("myOrders.title","Rendeléseim")}</h1>
        {orders.length === 0 ? (
          <div className="text-center text-gray-600 py-20">
            {t("myOrders.noOrders","Nincs még rendelés.")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">{t("myOrders.date","Dátum")}</th>
                  <th className="p-2 text-left">{t("myOrders.status","Státusz")}</th>
                  <th className="p-2 text-left">{t("myOrders.total","Összeg")}</th>
                  <th className="p-2 text-left">{t("myOrders.items","Termékek")}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-t">
                    <td className="p-2">{o.id}</td>
                    <td className="p-2">{new Date(o.date_created).toLocaleDateString()}</td>
                    <td className="p-2">{o.status}</td>
                    <td className="p-2">{o.currency_symbol || "€"} {o.total || "0.00"}</td>
                    <td className="p-2">
                      {o.line_items?.length ? (
                        <ul className="list-disc pl-5">
                          {o.line_items.map(i => <li key={i.id}>{i.name} ({i.quantity})</li>)}
                        </ul>
                      ) : "—"}
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

export default PurchaseHistory;
