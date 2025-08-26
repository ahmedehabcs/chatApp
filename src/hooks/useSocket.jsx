import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket(publicKey) {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!publicKey) return;
        socketRef.current = io("http://localhost:3000", {
            auth: { publicKey },
        });

        socketRef.current.on("connect", () => {
            console.log("Socket connected:", socketRef.current.id);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [publicKey]);

    return socketRef;
}