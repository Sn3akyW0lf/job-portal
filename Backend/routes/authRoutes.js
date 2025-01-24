import express from 'express';
import {
    registerUser,
    loginUser
} from '../controllers/auth.js';
import authorization from '../middlewares/authMiddleware.js';

// Router Object
const router = express.Router();

// Routes

// Register Route || POST
router.post('/register', registerUser);

// Login Route || POST
router.post('/login', authorization, loginUser);

// Exports Router
export default router;