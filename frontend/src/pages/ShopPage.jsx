import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client.js';

const ShopPage = () => {
  const { shopSlug } = useParams();
  const [shopData, setShopData] = useState(null);
  const [cart, setCart] = useState({});
  const [email, setEmail] = useState('');

  useEffect(() => {
    api.get(`/shops/${shopSlug}`).then((res) => setShopData(res.data));
  }, [shopSlug]);

  const total = useMemo(() => {
    if (!shopData) return 0;
    return shopData.products.reduce((sum, p) => sum + p.price * (cart[p._id] || 0), 0);
  }, [shopData, cart]);

  const checkout = async () => {
    const items = Object.entries(cart)
      .filter(([, q]) => q > 0)
      .map(([productId, quantity]) => ({ productId, quantity }));
    const { data } = await api.post('/orders/checkout-session', { shopSlug, items, customerEmail: email });
    window.location.href = data.checkoutUrl;
  };

  if (!shopData) return <main className="container"><p>Loading...</p></main>;

  return (
    <main className="container">
      <section className="panel">
        <h1>{shopData.shop.shopName}</h1>
        <p>Select products and pay securely using Stripe (test mode).</p>
      </section>

      <section className="panel">
        <input type="email" placeholder="Customer email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <table>
          <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Qty</th></tr></thead>
          <tbody>
            {shopData.products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td><td>${p.price.toFixed(2)}</td><td>{p.stock}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max={p.stock}
                    value={cart[p._id] || 0}
                    onChange={(e) => setCart({ ...cart, [p._id]: Number(e.target.value) })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Total: ${total.toFixed(2)}</h3>
        <button onClick={checkout} disabled={!total || !email}>Pay Now</button>
      </section>
    </main>
  );
};

export default ShopPage;
