import test from "node:test";
import assert from "node:assert/strict";
import { generateChatId, toClientMessage } from "./chat.js";

test("generateChatId is stable regardless of user order", () => {
    assert.equal(
        generateChatId("b@example.com", "a@example.com"),
        generateChatId("a@example.com", "b@example.com")
    );
});

test("toClientMessage returns only the current user's encrypted payload", () => {
    const message = {
        _id: "1",
        chatId: "chat-1",
        mid: new Date(1),
        sender: "a@example.com",
        message: "fallback",
        encryptedFor: [
            { userEmail: "a@example.com", ciphertext: "for-a" },
            { userEmail: "b@example.com", ciphertext: "for-b" }
        ],
        createdAt: "1"
    };

    assert.equal(toClientMessage(message, "b@example.com").message, "for-b");
});
