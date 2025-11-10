// backend/routes/auth.routes.js
import express from 'express';
import { loginUser, registerUser, searchUsers } from '../controllers/auth.controller.js';
import { verifyTokens } from "../middleware/auth.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser); // ✅ Add this line
router.get('/search', verifyTokens, searchUsers);

export default router;
