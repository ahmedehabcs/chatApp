import { Server } from "socket.io";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [process.env.WEBSITE_DOMAIN],
            credentials: true,
        }
    });

    // Auth middleware
    io.use((socket, next) => {
        const { publicKey } = socket.handshake.auth;
        if (!publicKey) return next(new Error("Authentication error"));
        socket.userPublicKey = publicKey;
        next();
    });

    io.on("connection", (socket) => {
        // Join a chat room
        socket.on("joinChat", async ({ otherPublicKey }) => {
            const userpk = socket.userPublicKey;
            let chat = await Chat.findOne({ participants: { $all: [userpk, otherPublicKey] } });

            if (!chat) {
                chat = new Chat({ participants: [userpk, otherPublicKey] });
                await chat.save();
            }

            socket.join(chat.chatId);
        });

        // Handle sending messages
        socket.on("sendMessage", async ({ chatId, text }) => {
            const sender = socket.userPublicKey;
            if (!chatId || !text) return;

            const newMessage = new Message({ chatId, sender, text });
            await newMessage.save();

            io.to(chatId).emit("newMessage", newMessage);
        });
        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.userPublicKey);
        });
    });
};