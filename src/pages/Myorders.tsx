import React, { useCallback, useEffect, useState } from "react";
import swal from "sweetalert";
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

interface MyOrdersProps {
  loggedInUserData: string;
  setPageLoading: (loading: boolean) => void;
}

const MyOrders: React.FC<MyOrdersProps> = ({ loggedInUserData, setPageLoading }) => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [singleOrder, setSingleOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = useCallback(async () => {
    setPageLoading(true);
    try {
      const user = JSON.parse(loggedInUserData);
      const email = user.email; // Use billing email

      // Fetch orders by email instead of user ID
      const res = await fetch(`/wp-json/wc/v3/orders?customer=${email}`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setPageLoading(false);
    }
  }, [loggedInUserData, setPageLoading]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleView = (order: Order) => {
    setSingleOrder(order);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const confirm = await swal({
      title: t("myOrders.deleteConfirmTitle", "Are you sure?"),
      text: t("myOrders.deleteConfirmText", "Do you really want to delete this order?"),
      icon: "warning",
      dangerMode: true,
      buttons: [t("common.cancel", "Cancel"), t("common.delete", "Delete")],
    });
    if (confirm) {
      await fetch(`/wp-json/wc/v3/orders/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchOrders();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t("myOrders.title", "My Orders")}</h1>

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
                    <td className="p-2">{o.currency_symbol || "$"} {o.total || "0.00"}</td>
                    <td className="p-2">
                      {o.line_items?.length ? (
                        <ul className="list-disc pl-5">
                          {o.line_items.map((i) => <li key={i.id}>{i.name} ({i.quantity})</li>)}
                        </ul>
                      ) : "—"}
                    </td>
                    <td className="p-2">
                      <button className="bg-blue-500 px-2 py-1 text-white rounded" onClick={() => handleView(o)}>View</button>
                      {o.status === "completed" && (
                        <button className="bg-red-600 px-2 py-1 text-white rounded ml-2" onClick={() => handleDelete(o.id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && singleOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow max-w-lg w-full" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">Order {singleOrder.id}</h2>
              <p>Status: {singleOrder.status}</p>
              <p>Total: {singleOrder.currency_symbol || "$"} {singleOrder.total || "0.00"}</p>
              <ul className="list-disc pl-5">
                {singleOrder.line_items?.map((i) => <li key={i.id}>{i.name} ({i.quantity})</li>)}
              </ul>
              <button className="mt-4 bg-gray-300 px-4 py-2 rounded" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
