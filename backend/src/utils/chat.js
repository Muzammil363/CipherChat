import { Messages } from "../models/Messages.js";
import { Chat } from "../models/ChatData.js";

export const generateChatId = (user1, user2) => {
    return [user1, user2].sort().join("_");
};

export const toClientMessage = (message, currentUser) => {
    const userPayload = message.encryptedFor?.find(entry => entry.userEmail === currentUser);
    return {
        _id: message._id,
        chatId: message.chatId,
        mid: message.mid,
        sender: message.sender,
        message: userPayload?.ciphertext || message.message,
        createdAt: message.createdAt
    };
};

export const assertConversationMember = (conversation, email) => {
    return conversation
        && conversation.members.includes(email)
        && !conversation.leftMembers.includes(email);
};

export const saveConversationMessage = async ({ chatId, sender, encryptedFor, message, mid }) => {
    const conversation = await Chat.findOne({ chatId });
    if (!assertConversationMember(conversation, sender)) {
        const error = new Error("Conversation not found");
        error.statusCode = 404;
        throw error;
    }

    const activeMembers = conversation.members.filter(member => !conversation.leftMembers.includes(member));
    const targetPayloads = Array.isArray(encryptedFor)
        ? encryptedFor.filter(entry => activeMembers.includes(entry.userEmail) && entry.ciphertext)
        : [];

    if (!message && targetPayloads.length === 0) {
        const error = new Error("Message cannot be empty");
        error.statusCode = 400;
        throw error;
    }

    const createdAt = String(mid || Date.now());
    const fallbackMessage = message || targetPayloads[0]?.ciphertext;
    const newMessage = await Messages.create({
        chatId,
        mid: new Date(Number(mid) || Date.now()),
        sender,
        message: fallbackMessage,
        encryptedFor: targetPayloads,
        createdAt
    });

    const unreadCounts = activeMembers.map(member => {
        const existing = conversation.unreadCounts.find(entry => entry.user === member);
        return {
            user: member,
            count: member === sender ? 0 : (existing?.count || 0) + 1
        };
    });

    conversation.lastMessage = {
        message: fallbackMessage,
        sender
    };
    conversation.createdAt = createdAt;
    conversation.unreadCounts = unreadCounts;
    await conversation.save();

    return { conversation, message: newMessage };
};
