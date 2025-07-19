import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';
import { uploadFileToCloudinary } from '../config/cloudinary.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const register = [
  upload.single('profilePic'),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required', error: true });
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists', error: true });
      }

      let profilePicUrl = '';
      if (req.file) {
        const result = await uploadFileToCloudinary(req.file);
        profilePicUrl = result.secure_url;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({ name, email, password: hashedPassword, profilePic: profilePicUrl });
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

      res.status(201).json({ message: 'User registered successfully', data: user, success: true });
    } catch (error) {
      res.status(500).json({ message: error.message, error: true });
    }
  },
];

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found', error: true });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials', error: true });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.status(200).json({ message: 'Login successful', data: user, token, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found', error: true });
    }
    res.status(200).json({ message: 'User fetched successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, profilePic } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { name, profilePic },
      { new: true, runValidators: true }
    ).select('-password');
    res.status(200).json({ message: 'User updated successfully', data: user, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const uploadProfilePic = [
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded', error: true });
      }
      const result = await uploadFileToCloudinary(req.file);
      res.status(200).json({ message: 'Profile picture uploaded', data: { url: result.secure_url }, success: true });
    } catch (error) {
      res.status(500).json({ message: error.message, error: true });
    }
  },
];

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.body;
    const users = await UserModel.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { email: new RegExp(query, 'i') },
      ],
    }).select('-password');
    res.status(200).json({ message: 'Users found', data: users, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token').status(200).json({ message: 'Logged out successfully', success: true });
};