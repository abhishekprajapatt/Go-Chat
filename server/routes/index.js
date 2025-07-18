import express from 'express';
import { checkEmail, checkPassword, logout, registerUser, searchUser, updateUserDetails, userDetails } from '../controller/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/email', checkEmail);
router.post('/password', checkPassword);
router.get('/user-details', userDetails);
router.get('/logout', logout);
router.post('/update-user', updateUserDetails);
router.post('/search-user', searchUser);


export default router;