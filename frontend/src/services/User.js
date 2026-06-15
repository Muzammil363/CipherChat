import { apiRequest } from "./api";

export const fetchProfile = async () => {
    return apiRequest("/user/profile");
};

export const updatePassword = async (oldPassword, newPassword) => {
    return null;
};

export const updateName = async (newName) => {
    await apiRequest("/user/updateProfile", {
        method: "PATCH",
        body: JSON.stringify({ fullName: newName })
    });
    return true;
};

export const updateProfile = async (url) => {
    await apiRequest("/user/updateProfile", {
        method: "PATCH",
        body: JSON.stringify({ profilePic: url })
    });
    return true;
};

export const getContacts = async () => {
    const data = await apiRequest("/user/contacts");
    return data.contacts;
};

export const getConversations = async () => {
    const data = await apiRequest("/api/conversations");
    return data.conversations;
};

export const getGroupMembers = async (chatId) => {
    const data = await apiRequest(`/api/groups/${encodeURIComponent(chatId)}/members`);
    return data.members;
};

export const createGroup = async ({ name, memberEmails }) => {
    const data = await apiRequest("/api/groups", {
        method: "POST",
        body: JSON.stringify({ name, memberEmails })
    });
    return data.conversation;
};

export const leaveGroup = async (chatId) => {
    await apiRequest(`/api/groups/${encodeURIComponent(chatId)}/leave`, {
        method: "POST"
    });
    return true;
};

export const clearUnread = async (clearTo) => {
    await apiRequest(`/api/chat/clear/${encodeURIComponent(clearTo)}`, {
        method: "PATCH"
    });
    return true;
};

export const clearConversationUnread = async (chatId) => {
    await apiRequest(`/api/chat/conversation/${encodeURIComponent(chatId)}/clear-unread`, {
        method: "PATCH"
    });
    return true;
};
