import jwt from 'jsonwebtoken';

export const signToken = (adminId) =>
  jwt.sign({ adminId }, process.env.JWT_SECRET, { expiresIn: '7d' });
