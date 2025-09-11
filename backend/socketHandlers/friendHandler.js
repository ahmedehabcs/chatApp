import User from "../models/User.js";

export function handleFriendEvents(io, socket) {
    const userPublicKey = socket.userPublicKey;
    
    // ---- FRIENDS ----
    socket.on("friend:list", async () => {
        const user = await User.findOne({ publicKey: userPublicKey });
        if (user) {
            socket.emit("friend:list:response", user.friends);
        }
    });

    // ---- REQUESTS ----
    socket.on("request:list", async () => {
        const user = await User.findOne({ publicKey: userPublicKey });
        if (user) {
            socket.emit("request:list:response", user.incomingRequests);
        }
    });
}