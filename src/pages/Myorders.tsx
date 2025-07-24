import React, { useEffect, useState } from "react";
import { getOrdersByUserId, getSingleOrderData, deleteOrderById } from "../lib/api";
import swal from "sweetalert";
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
  total: string;
  currency_symbol: string;
  line_items: LineItem[];
}

interface MyOrdersProps {
  loggedInUserData: string;
  setPageLoading: (loading: boolean) => void;
}

const MyOrders: React.FC<MyOrdersProps> = ({ loggedInUserData, setPageLoading }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderItems, setOrderItems] = useState<Order[]>([]);
  const [singleOrderData, setSingleOrderData] = useState<Order | null>(null);

  const fetchAllOrders = async () => {
    setPageLoading(true);
    try {
      const user = JSON.parse(loggedInUserData);
      const response = await getOrdersByUserId(user.id);
      setOrderItems(response);
      localStorage.setItem("orderItems", JSON.stringify(response));
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    const cachedOrders = localStorage.getItem("orderItems");
    if (cachedOrders) {
      setOrderItems(JSON.parse(cachedOrders));
    } else {
      fetchAllOrders();
    }
  }, []);

  const handleRefreshOrders = () => {
    fetchAllOrders();
  };

  const getSingleOrderInformation = async (orderID: number) => {
    setPageLoading(true);
    try {
      const response = await getSingleOrderData(orderID);
      setSingleOrderData(response);
      setShowDetailsModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  const deleteSingleOrderData = (orderID: number) => {
    setPageLoading(true);
    swal({
      title: "Are you sure?",
      text: "Do you really want to delete this order?",
      icon: "warning",
      dangerMode: true,
      buttons: ["Cancel", "Delete"],
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await deleteOrderById(orderID);
          await fetchAllOrders();
          swal("Deleted!", "The order has been deleted.", "success");
        } catch (error) {
          console.error(error);
        } finally {
          setPageLoading(false);
        }
      } else {
        setPageLoading(false);
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">My Orders</h1>

          <div className="flex justify-end mb-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition"
              onClick={handleRefreshOrders}
            >
              Refresh Orders
            </button>
          </div>

          <div>
            {orderItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-6 text-left text-sm font-semibold">Order ID</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold">Date</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold">Status</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold">Total</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold">Items</th>
                      <th className="py-3 px-6 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orderItems.map((order) => (
                      <tr key={order.id}>
                        <td className="py-3 px-6">{order.id}</td>
                        <td className="py-3 px-6">{new Date(order.date_created).toLocaleDateString()}</td>
                        <td className="py-3 px-6 capitalize">{order.status}</td>
                        <td className="py-3 px-6">{order.currency_symbol} {order.total}</td>
                        <td className="py-3 px-6">
                          <ul className="list-disc pl-5">
                            {order.line_items.map((item) => (
                              <li key={item.id}>{item.name} ({item.quantity})</li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-3 px-6">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mr-2"
                            onClick={() => getSingleOrderInformation(order.id)}
                          >
                            View
                          </button>
                          {order.status === "completed" && (
                            <button
                              className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                              onClick={() => deleteSingleOrderData(order.id)}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-700 text-lg">No orders found.</p>
            )}
          </div>

          {/* Modal */}
          {showDetailsModal && singleOrderData && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowDetailsModal(false)}
            >
              <div
                className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center border-b px-6 py-4">
                  <h2 className="text-xl font-semibold">Order Details</h2>
                  <button
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => setShowDetailsModal(false)}
                    aria-label="Close modal"
                  >
                    &#x2715;
                  </button>
                </div>
                <div className="px-6 py-4">
                  <p><strong>Order ID:</strong> {singleOrderData.id}</p>
                  <p><strong>Date:</strong> {new Date(singleOrderData.date_created).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {singleOrderData.status}</p>
                  <p><strong>Total:</strong> {singleOrderData.currency_symbol}{singleOrderData.total}</p>
                  <p><strong>Items:</strong></p>
                  <ul className="list-disc pl-6">
                    {singleOrderData.line_items.map((item) => (
                      <li key={item.id}>{item.name} ({item.quantity})</li>
                    ))}
                  </ul>
                </div>
                <div className="border-t px-6 py-4 flex justify-end">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;
