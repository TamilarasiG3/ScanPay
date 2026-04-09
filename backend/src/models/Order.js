import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    shopSlug: { type: String, required: true },
    customerEmail: String,
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        price: Number,
        quantity: Number,
        lineTotal: Number
      }
    ],
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    paymentSessionId: String
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
