import React, { useEffect, useState } from "react";
import { getOrdersByUserId, getSingleOrderData, deleteOrderById } from "../lib/api";
import swal from "sweetalert";

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
    <div className="container">
      <h1>My Orders</h1>
      <button className="btn btn-primary mb-3 float-end" onClick={handleRefreshOrders}>
        Refresh Orders
      </button>
      <div id="orders-container">
        {orderItems.length > 0 ? (
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{new Date(order.date_created).toLocaleDateString()}</td>
                  <td>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</td>
                  <td>{order.currency_symbol} {order.total}</td>
                  <td>
                    <ul>
                      {order.line_items.map((item) => (
                        <li key={item.id}>
                          {item.name} ({item.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <button
                      className="btn btn-info me-2"
                      onClick={() => getSingleOrderInformation(order.id)}
                    >
                      View
                    </button>
                    {order.status === "completed" && (
                      <button
                        className="btn btn-danger"
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
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      {/* Modal */}
      {showDetailsModal && singleOrderData && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Order ID:</strong> {singleOrderData.id}</p>
                <p><strong>Date:</strong> {new Date(singleOrderData.date_created).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {singleOrderData.status}</p>
                <p><strong>Total:</strong> {singleOrderData.currency_symbol}{singleOrderData.total}</p>
                <p><strong>Items:</strong></p>
                <ul>
                  {singleOrderData.line_items.map((item) => (
                    <li key={item.id}>{item.name} ({item.quantity})</li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
