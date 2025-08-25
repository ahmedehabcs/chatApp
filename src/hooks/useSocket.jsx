import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket(publicKey) {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!publicKey) return;
        socketRef.current = io("https://h1zslq1r-3000.euw.devtunnels.ms", {
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