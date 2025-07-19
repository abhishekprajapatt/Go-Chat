import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], unique: true, trim: true },
    password: { type: String, required: [true, 'Password is required'] },
    profilePic: { type: String, default: '' },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', userSchema);