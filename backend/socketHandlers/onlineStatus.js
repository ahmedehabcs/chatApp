const onlineUsers = new Map();

export const handleOnlineStatus = (io, socket) => {
    const publicKey = socket.userPublicKey;
    onlineUsers.set(publicKey, socket.id);
    socket.broadcast.emit("userOnline", { publicKey, online: true });
    socket.on("checkOnlineStatus", ({ publicKey: targetPublicKey }) => {
        const isOnline = onlineUsers.has(targetPublicKey);
        socket.emit("userOnline", {
            publicKey: targetPublicKey,
            online: isOnline
        });
    });
    socket.on("disconnect", (reason) => {
        onlineUsers.delete(publicKey);
        socket.broadcast.emit("userOffline", { publicKey, online: false });
    });
};