import { Server } from "socket.io";
import socketAuth from "../middlewares/socketAuth.js";
import { handleMessageEvents } from "../socketHandlers/messageHandler.js";
import { handleOnlineStatus } from "../socketHandlers/onlineStatus.js";
import { handleFriendEvents } from "../socketHandlers/friendHandler.js";
let ioInstance = null;

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [process.env.WEBSITE_DOMAIN],
            credentials: true,
        }
    });
    ioInstance = io;

    io.use(socketAuth);

    io.on("connection", (socket) => {        
        socket.join(`user_${socket.userPublicKey}`);
        handleOnlineStatus(io, socket);
        handleMessageEvents(io, socket);
        handleFriendEvents(io, socket);
    });
    return io;
};

export const getIO = () => {
    if (!ioInstance) {
        throw new Error("Socket.io not initialized!");
    }
    return ioInstance;
};