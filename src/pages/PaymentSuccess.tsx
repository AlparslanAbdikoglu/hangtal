import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getOrderBySessionId } from "../lib/api";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id") || localStorage.getItem("last_session_id");

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      try {
        const data = await getOrderBySessionId(sessionId);
        setOrder(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [sessionId]);

  if (!sessionId) {
    return <div className="p-6 text-center">Missing session ID.</div>;
  }

  return (
    <div className="p-6">
      {order ? (
        <>
          <h1 className="text-2xl font-bold">Order Successful 🎉</h1>
          <p>Order ID: {order.id}</p>
          <p>Total: {order.total}</p>
        </>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
};

export default PaymentSuccess;
