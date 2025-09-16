import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const handleMessageEvents = (io, socket) => {
    socket.on("joinChat", async ({ otherPublicKey }) => {
        const userpk = socket.userPublicKey;
        if (!otherPublicKey) {
            return socket.emit("error", { message: "Other user public key required" });
        }

        let chat = await Chat.findOne({ participants: { $all: [userpk, otherPublicKey] } });
        if (!chat) {
            chat = new Chat({ participants: [userpk, otherPublicKey] });
            await chat.save();
        }
        socket.join(chat.chatId);
        const messages = await Message.find({ chatId: chat.chatId }).sort({ createdAt: 1 }).lean();
        socket.emit("chatHistory", messages);
        socket.emit("joinedChat", { chatId: chat.chatId });
    });

    socket.on("sendMessage", async ({ chatId, ciphertexts, signature }) => {
        try {
            const sender = socket.userPublicKey;
            if (!chatId) return socket.emit("error", { message: "Chat ID is required" });
            if (!ciphertexts?.sender || !ciphertexts?.recipient || !signature) {
                return socket.emit("error", { message: "Missing required message fields" });
            }
            const chat = await Chat.findOne({ chatId });
            if (!chat) return socket.emit("error", { message: "Chat does not exist" });
            if (!chat.participants.includes(sender)) return socket.emit("error", { message: "You are not part of this chat" });
            const newMessage = new Message({
                chatId,
                sender,
                ciphertexts,
                signature,
            });
            await newMessage.save();
            io.to(chatId).emit("newMessage", newMessage);
        } catch (err) {
            console.error("sendMessage error:", err);
            socket.emit("error", { message: "Failed to send message" });
        }
    });
};