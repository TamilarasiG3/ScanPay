import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    shopName: { type: String, required: true },
    shopSlug: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

export default mongoose.model('Admin', adminSchema);
