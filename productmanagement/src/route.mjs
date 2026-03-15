import express from 'express';
import { registerUser, login, getProfile, updateProfile } from './controllers/userController.mjs';
import { authentication, authorization } from './auth/authentication.mjs';

const router = express.Router();

//User Routes
router.post('/register', registerUser);
router.post('/login', login);
router.get('/user/:userId/profile', authentication, getProfile);
router.put('/user/:userId/profile',authentication,authorization, updateProfile)

export default router;