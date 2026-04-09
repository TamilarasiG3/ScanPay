import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client.js';

const OrderSuccessPage = () => {
  const [params] = useSearchParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const sessionId = params.get('session_id');
    if (!sessionId) return;
    api.get(`/orders/confirm/${sessionId}`).then((res) => setOrder(res.data));
  }, []);

  return (
    <main className="container">
      <section className="panel">
        <h1>Order Confirmation</h1>
        {!order ? <p>Verifying payment...</p> : (
          <>
            <p>Payment status: <b>{order.paymentStatus}</b></p>
            <p>Order ID: {order._id}</p>
            <p>Amount Paid: ${order.amount.toFixed(2)}</p>
          </>
        )}
      </section>
    </main>
  );
};

export default OrderSuccessPage;
