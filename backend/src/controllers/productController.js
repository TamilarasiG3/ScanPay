import Product from '../models/Product.js';

export const getMyProducts = async (req, res) => {
  const products = await Product.find({ adminId: req.admin._id }).sort({ createdAt: -1 });
  res.json(products);
};

export const createProduct = async (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || price == null || stock == null) {
    return res.status(400).json({ message: 'name, price, stock are required' });
  }
  const product = await Product.create({
    adminId: req.admin._id,
    name,
    price,
    stock
  });
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, adminId: req.admin._id });
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const { name, price, stock } = req.body;
  if (name != null) product.name = name;
  if (price != null) product.price = price;
  if (stock != null) product.stock = stock;
  await product.save();
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, adminId: req.admin._id });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Deleted' });
};

export const getShopProducts = async (req, res) => {
  const products = await Product.find({ adminId: req.admin._id }).select('name price stock');
  res.json({
    shop: {
      shopName: req.admin.shopName,
      shopSlug: req.admin.shopSlug
    },
    products
  });
};
