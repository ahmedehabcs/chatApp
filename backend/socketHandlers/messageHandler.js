import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";

export const handleMessageEvents = (io, socket) => {

    socket.on("joinChat", async ({ otherPublicKey }) => {
        try {
            const userpk = sanitizeInput(socket.userPublicKey);
            const targetpk = sanitizeInput(otherPublicKey);

            if (!targetpk) {
                return socket.emit("error", { message: "Other user public key required" });
            }
            if (userpk === targetpk) {
                return socket.emit("error", { message: "You cannot chat with yourself" });
            }

            let chat = await Chat.findOne({ participants: { $all: [userpk, targetpk] } });
            if (!chat) {
                chat = new Chat({ participants: [userpk, targetpk] });
                await chat.save();
            }

            if (!chat.participants.includes(userpk)) {
                return socket.emit("error", { message: "You are not authorized for this chat" });
            }

            if (!chat.chatId) {
                return socket.emit("error", { message: "Chat is corrupted (no chatId)" });
            }

            socket.join(chat.chatId);

            const messages = await Message.find({ chatId: chat.chatId })
                .sort({ createdAt: 1 })
                .lean();

            socket.emit("chatHistory", messages);
            socket.emit("joinedChat", { chatId: chat.chatId });

        } catch (err) {
            socket.emit("error", { message: "Failed to join chat" });
        }
    });

    socket.on("sendMessage", async ({ chatId, ciphertexts, signature }) => {
        try {
            const sender = sanitizeInput(socket.userPublicKey);
            const safeChatId = sanitizeInput(chatId);

            if (!safeChatId) {
                return socket.emit("error", { message: "Chat ID is required" });
            }
            if (!ciphertexts?.sender || !ciphertexts?.recipient || !signature) {
                return socket.emit("error", { message: "Missing required message fields" });
            }

            const safeCiphertexts = {
                sender: sanitizeInput(ciphertexts.sender),
                recipient: sanitizeInput(ciphertexts.recipient),
            };
            const safeSignature = sanitizeInput(signature);

            const chat = await Chat.findOne({ chatId: safeChatId });
            if (!chat) {
                return socket.emit("error", { message: "Chat does not exist" });
            }
            if (!chat.participants.includes(sender)) {
                return socket.emit("error", { message: "You are not part of this chat" });
            }

            const newMessage = new Message({
                chatId: safeChatId,
                sender,
                ciphertexts: safeCiphertexts,
                signature: safeSignature,
            });
            await newMessage.save();

            io.to(safeChatId).emit("newMessage", newMessage);

        } catch (err) {
            socket.emit("error", { message: "Failed to send message" });
        }
    });

    socket.on("deleteMessage", async ({ messageId }) => {
        try {
            const userpk = sanitizeInput(socket.userPublicKey);
            const safeMessageId = sanitizeInput(messageId);

            if (!safeMessageId) {
                return socket.emit("error", { message: "Message ID is required" });
            }

            const message = await Message.findById(safeMessageId);
            if (!message) return socket.emit("error", { message: "Message not found" });
            if (message.sender !== userpk) {
                return socket.emit("error", { message: "You can only delete your own messages" });
            }

            const chat = await Chat.findOne({ chatId: message.chatId });
            if (!chat) return socket.emit("error", { message: "Chat not found" });
            if (!chat.participants.includes(userpk)) {
                return socket.emit("error", { message: "You are not a participant in this chat" });
            }

            message.ciphertexts = undefined;
            message.signature = undefined;
            message.deleted = true;
            await message.save();

            io.to(message.chatId).emit("messageDeleted", {
                _id: message._id,
                chatId: message.chatId,
                sender: message.sender,
                createdAt: message.createdAt,
                deleted: true,
            });
        } catch (err) {
            console.error("deleteMessage error:", err);
            socket.emit("error", { message: "Failed to delete message" });
        }
    });
};