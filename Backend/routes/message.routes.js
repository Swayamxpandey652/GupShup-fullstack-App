import express from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller.js';
import { verifyTokens } from '../middleware/auth.js';

const router = express.Router();

router.post('/send', verifyTokens, sendMessage);
router.get('/:user_id', verifyTokens, getMessages); // user you're chatting with

export default router;
