import Stripe from 'stripe';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { emitOrderUpdate } from '../services/socket.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { shopSlug, items, customerEmail } = req.body;
  const admin = await Admin.findOne({ shopSlug });
  if (!admin) return res.status(404).json({ message: 'Shop not found' });
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: 'No items selected' });
  }

  const normalized = [];
  let total = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || String(product.adminId) !== String(admin._id)) {
      return res.status(400).json({ message: 'Invalid product in cart' });
    }
    const qty = Number(item.quantity || 0);
    if (qty < 1 || qty > product.stock) {
      return res.status(400).json({ message: `Invalid quantity for ${product.name}` });
    }

    const lineTotal = product.price * qty;
    normalized.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: qty,
      lineTotal
    });
    total += lineTotal;
  }

  const order = await Order.create({
    adminId: admin._id,
    shopSlug,
    customerEmail,
    items: normalized,
    amount: total,
    paymentStatus: 'pending'
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: customerEmail,
    success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/shop/${shopSlug}`,
    line_items: normalized.map((p) => ({
      quantity: p.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(p.price * 100),
        product_data: { name: p.name }
      }
    })),
    metadata: {
      orderId: String(order._id),
      adminId: String(admin._id)
    }
  });

  order.paymentSessionId = session.id;
  await order.save();

  res.status(201).json({ checkoutUrl: session.url, orderId: order._id });
};

export const confirmOrderBySession = async (req, res) => {
  const { sessionId } = req.params;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const order = await Order.findOne({ paymentSessionId: session.id });
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (session.payment_status === 'paid' && order.paymentStatus !== 'paid') {
    order.paymentStatus = 'paid';
    await order.save();

    for (const line of order.items) {
      await Product.findByIdAndUpdate(line.productId, { $inc: { stock: -line.quantity } });
    }

    emitOrderUpdate(order.adminId.toString(), { orderId: order._id, status: 'paid' });
  }

  res.json(order);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ adminId: req.admin._id }).sort({ createdAt: -1 });
  res.json(orders);
};
