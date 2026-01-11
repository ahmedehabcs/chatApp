import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

let globalSocket = null;

export default function useSocket() {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!globalSocket) {
            globalSocket = io(import.meta.env.VITE_BACKEND_URL, {
                withCredentials: true,
                transports: ["websocket"],
            });
        }

        socketRef.current = globalSocket;
    }, []);

    return socketRef;
}