import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
