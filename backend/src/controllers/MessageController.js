import { Messages } from "../models/Messages.js";
import { User } from "../models/User.js";
import { generateChatId, saveConversationMessage, toClientMessage } from "../utils/chat.js";
import { Chat } from "../models/ChatData.js";
import { ensureDirectConversation } from "./conversationController.js";

export const getMessagesForId = async (req, res) => {
    const { id: email } = req.params;
    const { cursor, limit = 20 } = req.query;
    try {
        const chatId = generateChatId(email, req.user);
        const conversation = await Chat.findOne({ chatId });
        if (!conversation || !conversation.members.includes(req.user)) {
            return res.status(200).json({ messages: [], nextCursor: null });
        }

        const query = { chatId };
        if (cursor) {
            query._id = { $lt: cursor };
        }

        const messages = await Messages.find(query)
            .sort({ _id: -1 })
            .limit(parseInt(limit));

        return res.status(200).json({
            messages: messages.map(message => toClientMessage(message, req.user)),
            nextCursor: messages.length ? messages[messages.length - 1]._id : null,
        });
    } catch (err) {
        console.error("Failed to load messages", err);
        res.status(500).json({ error: "Failed to load messages" });
    }
};

export const sendMessageForId = async (req, res) => {
    const sendTo = req.params.id;
    const sentBy = req.user;
    const { encryptedFor, message, mid } = req.body;

    try {
        const receiver = await User.findOne({ email: sendTo });
        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        const conversation = await ensureDirectConversation(sentBy, sendTo);
        await saveConversationMessage({
            chatId: conversation.chatId,
            sender: sentBy,
            encryptedFor,
            message,
            mid
        });

        return res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Failed to send direct message", error);
        return res.status(error.statusCode || 500).json({ message: error.message || "Server side error while sending message" });
    }
};

export const clearUnread = async (req, res) => {
    try {
        const clearTo = req.params.user;
        const currentUser = req.user;
        const chatId = generateChatId(clearTo, currentUser);

        const chat = await Chat.findOne({ chatId });
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        if (!chat.members.includes(currentUser)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        chat.unreadCounts = chat.unreadCounts.map(entry => (
            entry.user === currentUser ? { ...entry, count: 0 } : entry
        ));
        await chat.save();
        return res.status(200).json({ message: "Unread count cleared" });
    } catch (err) {
        return res.status(500).json({ message: "Sever side error while clearing unread" });
    }
};

export const clearConversationUnread = async (req, res) => {
    try {
        const chat = await Chat.findOne({ chatId: req.params.id });
        if (!chat || !chat.members.includes(req.user)) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        chat.unreadCounts = chat.unreadCounts.map(entry => (
            entry.user === req.user ? { ...entry, count: 0 } : entry
        ));
        await chat.save();
        return res.status(200).json({ message: "Unread count cleared" });
    } catch (err) {
        return res.status(500).json({ message: "Sever side error while clearing unread" });
    }
};

export const clearChat = async (req, res) => {
    try {
        const loggedIn = req.user;
        const email = req.params.id;
        const chatId = generateChatId(email, loggedIn);
        const chat = await Chat.findOne({ chatId });

        if (!chat || !chat.members.includes(loggedIn)) {
            return res.status(404).json({ message: "Chat not found" });
        }

        await Chat.deleteOne({ chatId });
        await Messages.deleteMany({ chatId });
        return res.status(200).json({ message: "deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server side error" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const id = req.params.id;
        const message = await Messages.findOne({ mid: new Date(Number(id) || id) }) || await Messages.findOne({ mid: id });

        if (!message) {
            return res.status(404).json({ msg: "Message not found" });
        }

        if (message.sender !== req.user) {
            return res.status(403).json({ msg: "Forbidden" });
        }

        const del = await Messages.deleteOne({ _id: message._id });
        if (del.acknowledged && del.deletedCount > 0) {
            return res.status(200).json({
                success: true,
                message: "Message deleted successfully"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Cannot delete message"
        });
    } catch (error) {
        console.error("Failed to delete message", error);
        return res.status(500).json({ message: "Server side error while deleting message" });
    }
};
