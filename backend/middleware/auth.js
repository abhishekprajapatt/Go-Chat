import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided', error: true });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await UserModel.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token', error: true });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed', error: true });
  }
};