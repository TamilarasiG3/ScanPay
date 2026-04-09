import QRCode from 'qrcode';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';

export const getShopBySlug = async (req, res) => {
  const admin = await Admin.findOne({ shopSlug: req.params.shopSlug }).select('shopName shopSlug');
  if (!admin) return res.status(404).json({ message: 'Shop not found' });
  const products = await Product.find({ adminId: admin._id }).select('name price stock');
  res.json({ shop: admin, products });
};

export const generateShopQr = async (req, res) => {
  const targetUrl = `${process.env.FRONTEND_URL}/shop/${req.admin.shopSlug}`;
  const qrCodeDataUrl = await QRCode.toDataURL(targetUrl);
  res.json({ qrCodeDataUrl, targetUrl });
};
