import express from 'express';
import authorization from '../middlewares/authMiddleware.js';
import {
    updateUser
} from '../controllers/user.js';

// Router Object
const router = express.Router();

// Routes

// Get Users || GET

// Update User || PUT
router.put('/update-user', authorization, updateUser)

export default router;