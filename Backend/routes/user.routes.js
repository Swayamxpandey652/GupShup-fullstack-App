import express from "express";
import { searchUsers } from "../controllers/user.controller.js";
import {verifyTokens} from "../middleware/verifyTokens.js";

const router = express.Router();

// Protected route
router.get("/search", verifyTokens, searchUsers);

export default router;
