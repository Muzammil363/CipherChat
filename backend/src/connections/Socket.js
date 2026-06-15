import { socketMap } from "../index.js";
import { io } from "../index.js";
import { User } from "../models/User.js";
import { Chat } from "../models/ChatData.js";
import { generateChatId, saveConversationMessage, toClientMessage } from "../utils/chat.js";
import { ensureDirectConversation } from "../controllers/conversationController.js";

const findUserSocketByEmail = (email) => socketMap.get(email);

const emitToMembers = (members, event, payload, exceptEmail) => {
    members.forEach(member => {
        if (member === exceptEmail) return;
        const socketId = findUserSocketByEmail(member);
        if (socketId) {
            io.to(socketId).emit(event, payload);
        }
    });
};

const handleConversationSend = async (socket, data) => {
    const sender = socket.email;
    const chatId = data.chatId || data.conversationId;
    if (!chatId) return;

    const result = await saveConversationMessage({
        chatId,
        sender,
        encryptedFor: data.encryptedFor,
        message: data.message,
        mid: data.time || data.mid
    });

    const activeMembers = result.conversation.members.filter(
        member => !result.conversation.leftMembers.includes(member)
    );

    activeMembers.forEach(member => {
        if (member === sender) return;
        const socketId = findUserSocketByEmail(member);
        if (socketId) {
            io.to(socketId).emit("message:receive", {
                conversationId: chatId,
                chatId,
                message: toClientMessage(result.message, member),
                fromMail: sender
            });
        }
    });
};

export const socketActions = (socket) => {
    User.findOneAndUpdate(
        { email: socket.email },
        { status: "online", lastSeen: null },
        { new: true }
    ).catch(error => console.error("Failed to mark socket user online", error));

    socket.on("message:send", async (data) => {
        try {
            await handleConversationSend(socket, data);
        } catch (error) {
            socket.emit("message:error", { message: error.message || "Unable to send message" });
        }
    });

    socket.on("send", async (data) => {
        try {
            const sender = socket.email;
            const sendTo = data.sendTo;
            if (!sendTo) return;

            const conversation = await ensureDirectConversation(sender, sendTo);
            await handleConversationSend(socket, {
                chatId: conversation.chatId,
                encryptedFor: data.encryptedFor,
                message: data.message,
                time: data.time
            });
        } catch (error) {
            socket.emit("message:error", { message: error.message || "Unable to send message" });
        }
    });

    socket.on("typing:start", async (data) => {
        const chatId = data.chatId || data.conversationId;
        const conversation = await Chat.findOne({ chatId });
        if (!conversation || !conversation.members.includes(socket.email)) return;

        const activeMembers = conversation.members.filter(
            member => !conversation.leftMembers.includes(member)
        );
        emitToMembers(activeMembers, "typing", { from: socket.email, chatId }, socket.email);
    });

    socket.on("typing", async (data) => {
        const sendTo = data.to;
        if (!sendTo) return;
        const chatId = generateChatId(socket.email, sendTo);
        const socketId = findUserSocketByEmail(sendTo);
        if (socketId) {
            io.to(socketId).emit("typing", { from: socket.email, chatId });
        }
    });

    socket.on("deleted", (data) => {
        const emitTo = data.to;
        if (!emitTo) return;
        const socketId = findUserSocketByEmail(emitTo);
        if (socketId) {
            io.to(socketId).emit("deletedId", { id: data.id });
        }
    });

    socket.on("disconnect", async () => {
        if (socketMap.get(socket.email) === socket.id) {
            socketMap.delete(socket.email);
            await User.findOneAndUpdate(
                { email: socket.email },
                { status: "offline", lastSeen: Date.now() },
                { new: true }
            );
        }
    });
};
