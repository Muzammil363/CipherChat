import { apiRequest } from "./api";

export const deleteContact = async (email) => {
    await apiRequest(`/user/contact/${encodeURIComponent(email)}`, {
        method: "DELETE"
    });
    return true;
};

export const clearChat = async (email) => {
    await apiRequest(`/api/chat/clearChat/${encodeURIComponent(email)}`, {
        method: "DELETE"
    });
    return true;
};

export const deleteMessage = async (id) => {
    await apiRequest(`/api/chat/deleteMessage/${encodeURIComponent(id)}`, {
        method: "DELETE"
    });
    return true;
};
