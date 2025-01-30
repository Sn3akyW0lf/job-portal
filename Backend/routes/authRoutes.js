import express from 'express';
import {
    registerUser,
    loginUser
} from '../controllers/auth.js';
// import authorization from '../middlewares/authMiddleware.js';
import rateLimit from 'express-rate-limit';

// IP Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})

// Router Object
const router = express.Router();

// Routes

// Register Route || POST
router.post('/register', limiter, registerUser);

// Login Route || POST
router.post('/login', limiter, loginUser);

// Exporting Router
export default router;