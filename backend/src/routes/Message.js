import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMessagesForId,sendMessageForId } from "../controllers/MessageController.js";

const router=express.Router();

router.get('/inbox/:id',authMiddleware,getMessagesForId);
router.post('/send/:id',authMiddleware,sendMessageForId);

export default router;