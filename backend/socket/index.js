import { Server } from "socket.io";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

// Store io instance globally
let ioInstance = null;

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [process.env.WEBSITE_DOMAIN],
            credentials: true,
        }
    });

    // Store the instance for later use
    ioInstance = io;

    // Auth middleware
    io.use((socket, next) => {
        const { publicKey } = socket.handshake.auth;
        if (!publicKey) return next(new Error("Authentication error"));
        socket.userPublicKey = publicKey;
        next();
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.userPublicKey);
        
        // Join user's personal room for notifications
        socket.join(`user_${socket.userPublicKey}`);
        
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
    
    return io;
};

// Export function to get io instance
export const getIO = () => {
    if (!ioInstance) {
        throw new Error("Socket.io not initialized!");
    }
    return ioInstance;
};