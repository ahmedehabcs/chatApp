import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import URL from "../components/URL.jsx";

export default function useSocket(publicKey) {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!publicKey) return;
        socketRef.current = io(URL, {
            auth: { publicKey },
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [publicKey]);

    return socketRef;
}