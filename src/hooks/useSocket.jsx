import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import URL from "../components/URL.jsx";

let globalSocket = null;

export default function useSocket(publicKey) {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!publicKey) return;

        if (!globalSocket) {
            globalSocket = io(URL, {
                auth: { publicKey },
                transports: ["websocket"],
            });
        }

        socketRef.current = globalSocket;
    }, [publicKey]);

    return socketRef;
}