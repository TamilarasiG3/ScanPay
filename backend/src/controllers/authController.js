import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { signToken } from '../utils/token.js';

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const signup = async (req, res) => {
  const { name, email, password, shopName } = req.body;
  if (!name || !email || !password || !shopName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existing = await Admin.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already in use' });

  const shopSlugBase = slugify(shopName);
  let shopSlug = shopSlugBase;
  let suffix = 1;
  while (await Admin.exists({ shopSlug })) {
    suffix += 1;
    shopSlug = `${shopSlugBase}-${suffix}`;
  }

  const hashed = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ name, email, password: hashed, shopName, shopSlug });

  res.status(201).json({
    token: signToken(admin._id),
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      shopName: admin.shopName,
      shopSlug: admin.shopSlug
    }
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

  const matched = await bcrypt.compare(password, admin.password);
  if (!matched) return res.status(401).json({ message: 'Invalid credentials' });

  res.json({
    token: signToken(admin._id),
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      shopName: admin.shopName,
      shopSlug: admin.shopSlug
    }
  });
};

export const profile = async (req, res) => {
  res.json({ admin: req.admin });
};
