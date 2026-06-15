import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createRateLimit } from "../middleware/rateLimit.js";
import {
    createGroup,
    getConversationMessages,
    getConversations,
    getGroupMembers,
    leaveGroup,
    sendConversationMessage
} from "../controllers/conversationController.js";

const router = express.Router();
const messageRateLimit = createRateLimit({ windowMs: 60_000, max: 120 });

router.use(authMiddleware);

router.get("/conversations", getConversations);
router.get("/conversations/:id/messages", getConversationMessages);
router.post("/conversations/:id/messages", messageRateLimit, sendConversationMessage);

router.post("/groups", createGroup);
router.get("/groups/:id/members", getGroupMembers);
router.post("/groups/:id/leave", leaveGroup);

export default router;
