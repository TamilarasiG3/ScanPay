import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import api, { API_URL } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import ProductForm from '../components/ProductForm.jsx';

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [qr, setQr] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [pRes, oRes, qRes] = await Promise.all([
      api.get('/products'),
      api.get('/orders/admin'),
      api.get('/shops/admin/qr')
    ]);
    setProducts(pRes.data);
    setOrders(oRes.data);
    setQr(qRes.data);
  };

  useEffect(() => {
    load();
    const socket = io(API_URL);
    socket.emit('admin:join', admin.id);
    socket.on('order:update', load);
    return () => socket.disconnect();
  }, []);

  const saveProduct = async (payload) => {
    if (editing) {
      await api.put(`/products/${editing._id}`, payload);
      setEditing(null);
    } else {
      await api.post('/products', payload);
    }
    load();
  };

  const removeProduct = async (id) => {
    await api.delete(`/products/${id}`);
    load();
  };

  const analytics = useMemo(() => ({
    totalOrders: orders.length,
    paidOrders: orders.filter((o) => o.paymentStatus === 'paid').length,
    revenue: orders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.amount, 0)
  }), [orders]);

  return (
    <main className="container">
      <header className="panel">
        <h1>{admin.shopName} Dashboard</h1>
        <p>Customer Link: <a href={`/shop/${admin.shopSlug}`}>/shop/{admin.shopSlug}</a></p>
        <button onClick={logout}>Logout</button>
      </header>

      <section className="grid3">
        <div className="panel"><h3>Total Orders</h3><p>{analytics.totalOrders}</p></div>
        <div className="panel"><h3>Paid Orders</h3><p>{analytics.paidOrders}</p></div>
        <div className="panel"><h3>Revenue</h3><p>${analytics.revenue.toFixed(2)}</p></div>
      </section>

      {qr && (
        <section className="panel">
          <h3>Shop QR Code</h3>
          <img src={qr.qrCodeDataUrl} alt="Shop QR" width="180" />
          <p><a href={qr.targetUrl} target="_blank">{qr.targetUrl}</a></p>
        </section>
      )}

      <ProductForm onSubmit={saveProduct} initial={editing} onCancel={() => setEditing(null)} />

      <section className="panel">
        <h3>Products</h3>
        <table>
          <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td><td>${p.price.toFixed(2)}</td><td>{p.stock}</td>
                <td>
                  <button onClick={() => setEditing(p)}>Edit</button>
                  <button onClick={() => removeProduct(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <h3>Orders & Payments</h3>
        <table>
          <thead><tr><th>Time</th><th>Items</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>{o.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}</td>
                <td>${o.amount.toFixed(2)}</td>
                <td>{o.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default AdminDashboard;
