import express from 'express';
import { getConversation } from '../controller/messageController.js';
import { auth } from '../middleware/auth.js';
import { getUser, login, logout, register, searchUsers, updateUser, uploadProfilePic } from '../controller/userController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', auth, getUser);
router.put('/update', auth, updateUser);
router.post('/upload-profile', auth, uploadProfilePic);
router.post('/search', auth, searchUsers);
router.get('/logout', auth, logout);
router.get('/conversations', auth, getConversation);

export default router;