import { Server } from "socket.io";
import { handleMessageEvents } from "../socketHandlers/messageHandler.js";

let ioInstance = null;

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [process.env.WEBSITE_DOMAIN],
            credentials: true,
        }
    });

    ioInstance = io;

    // Auth middleware
    io.use((socket, next) => {
        const { publicKey } = socket.handshake.auth;
        if (!publicKey) return next(new Error("Authentication error"));
        socket.userPublicKey = publicKey;
        next();
    });

    io.on("connection", (socket) => {        
        socket.join(`user_${socket.userPublicKey}`);

        // Register event groups
        handleMessageEvents(io, socket);
    });

    return io;
};

export const getIO = () => {
    if (!ioInstance) {
        throw new Error("Socket.io not initialized!");
    }
    return ioInstance;
};