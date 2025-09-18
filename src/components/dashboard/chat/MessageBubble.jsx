import { FiCheck, FiX, FiTrash2 } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSocket from "../../../hooks/useSocket";

export default function MessageBubble({ message, isOwnMessage, time }) {
    const [showMenu, setShowMenu] = useState(false);
    const touchTimer = useRef(null);
    const bubbleRef = useRef(null);
    const socketRef = useSocket();

    const openMenu = () => {
        if (!isOwnMessage || message.deleted) return;
        setShowMenu(true);
    };

    const handleToggle = () => {
        if (!isOwnMessage || message.deleted) return;
        setShowMenu((s) => !s);
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        openMenu();
    };

    const handleTouchStart = () => {
        touchTimer.current = setTimeout(() => openMenu(), 500);
    };
    const handleTouchEnd = () => {
        if (touchTimer.current) {
            clearTimeout(touchTimer.current);
            touchTimer.current = null;
        }
    };
    const handleTouchMove = () => {
        if (touchTimer.current) {
            clearTimeout(touchTimer.current);
            touchTimer.current = null;
        }
    };

    // only one menu open globally
    useEffect(() => {
        if (!showMenu) return;
        const closeThis = () => setShowMenu(false);

        if (MessageBubble.currentlyOpen && typeof MessageBubble.currentlyOpen.fn === "function") {
            try {
                MessageBubble.currentlyOpen.fn();
            } catch { }
        }
        MessageBubble.currentlyOpen = { fn: closeThis, id: message._id };

        const handlePointerDown = (e) => {
            if (!bubbleRef.current) return;
            if (!bubbleRef.current.contains(e.target)) {
                closeThis();
            }
        };
        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            if (MessageBubble.currentlyOpen && MessageBubble.currentlyOpen.fn === closeThis) {
                MessageBubble.currentlyOpen = null;
            }
        };
    }, [showMenu, message._id, isOwnMessage]);

    // 🔹 emit delete request to server
    const handleDelete = () => {
        if (!socketRef.current) return;
        socketRef.current.emit("deleteMessage", { messageId: message._id });
        setShowMenu(false);
    };

    return (
        <div ref={bubbleRef} className={`relative flex flex-col ${isOwnMessage ? "items-end" : "items-start"} mb-4`}>
            {/* Main message bubble */}
            <div
                onClick={handleToggle}
                onContextMenu={handleContextMenu}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                className={`max-w-xs md:max-w-md rounded-lg p-2 text-sm md:text-base break-words whitespace-pre-wrap ${isOwnMessage
                    ? `${showMenu ? "bg-[var(--color-success)]" : "bg-[var(--color-main-heavy)]"} text-[var(--color-text)] rounded-br-none`
                    : "bg-[var(--color-surface)] text-[var(--color-text)] rounded-bl-none border border-[var(--color-border)]"
                    }`}
            >
                <p>
                    {message.deleted
                        ? "This message was deleted"
                        : message.plaintext || "[Decryption failed]"}
                </p>
                <span
                    className={`block text-[10px] text-[var(--color-text)] mt-1 ${isOwnMessage ? "text-right" : "text-left"
                        }`}
                >
                    {time}{" "}
                    {message.verified && !message.deleted ? (
                        <FiCheck className="inline text-[var(--color-success)]" />
                    ) : !message.deleted ? (
                        <FiX className="inline text-[var(--color-error)]" />
                    ) : null}
                </span>
            </div>
            <AnimatePresence>
                {showMenu && isOwnMessage && !message.deleted && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="overflow-hidden mt-2 w-full max-w-[240px] rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl"
                    >
                        <div className="flex flex-col gap-3 p-4">
                            <button className="self-end w-8 h-8 flex items-center justify-center rounded-full  bg-[var(--color-border)]/40 hover:bg-[var(--color-border)]/70  text-[var(--color-text-light)] hover:text-[var(--color-text)]  transition-colors" onClick={() => setShowMenu(false)}>
                                <FiX size={16} />
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--color-error-bg)] to-[var(--color-error)]  text-[var(--color-text)] font-medium text-sm  shadow-md hover:from-[var(--color-error)] hover:to-[var(--color-error-bg)]  active:scale-95 transition-all" onClick={handleDelete}>
                                <FiTrash2 size={16} />
                                Delete message
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}