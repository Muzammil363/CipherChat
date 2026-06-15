import express from "express"
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMessagesForId
    ,sendMessageForId
    ,clearUnread,
    clearConversationUnread,
    clearChat,
    deleteMessage
 } from "../controllers/MessageController.js";
import { createRateLimit } from "../middleware/rateLimit.js";

const router=express.Router();
const messageRateLimit = createRateLimit({ windowMs: 60_000, max: 120 });

router.get('/inbox/:id/messages', authMiddleware, getMessagesForId);
router.post('/send/:id',authMiddleware,messageRateLimit,sendMessageForId);
router.patch('/clear/:user',authMiddleware,clearUnread);
router.patch('/conversation/:id/clear-unread',authMiddleware,clearConversationUnread);
router.delete('/clearChat/:id',authMiddleware,clearChat);
router.delete('/deleteMessage/:id',authMiddleware,deleteMessage);

export default router;
