import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';

export const getUserDetailsFromToken = async (token) => {
  try {
    if (!token) return { logout: true };

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) return { logout: true };

    return user;
  } catch (error) {
    return { logout: true };
  }
};
