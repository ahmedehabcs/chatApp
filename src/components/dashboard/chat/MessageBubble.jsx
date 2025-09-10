import { FiCheck, FiX } from "react-icons/fi";

export default function MessageBubble({ message, isOwnMessage, time }) {
    return (
        <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
            <div
                className={`max-w-xs md:max-w-md rounded-lg p-2 text-sm md:text-base break-words whitespace-pre-wrap ${isOwnMessage ? "bg-[var(--color-main-heavy)] text-[var(--color-text)] rounded-br-none" : "bg-[var(--color-surface)] text-[var(--color-text)] rounded-bl-none border border-[var(--color-border)]"}`}>
                <p>{message.plaintext || "[Decryption failed]"}</p>
                <span
                    className={`block text-[10px] text-[var(--color-text)] mt-1 ${isOwnMessage ? "text-right" : "text-left"}`}>
                    {time}{" "}
                    {message.verified ? (
                        <FiCheck className="inline text-[var(--color-success)]" />
                    ) : (
                        <FiX className="inline text-[var(--color-error)]" />
                    )}
                </span>
            </div>
        </div>
    );
}