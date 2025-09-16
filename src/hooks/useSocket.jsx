import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import URL from "../components/URL.jsx";

let globalSocket = null;

export default function useSocket() {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!globalSocket) {
            globalSocket = io(URL, {
                withCredentials: true,
                transports: ["websocket"],
            });
        }

        socketRef.current = globalSocket;
    }, []);

    return socketRef;
}