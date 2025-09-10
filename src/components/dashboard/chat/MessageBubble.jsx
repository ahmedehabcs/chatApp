export default function MessageBubble({ message, isOwnMessage, time }) {
    return (
        <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
            <div
                className={`max-w-xs md:max-w-md rounded-lg p-2 text-sm md:text-base break-words whitespace-pre-wrap ${isOwnMessage ? "bg-[var(--color-main)] text-[var(--color-text-inverse)] rounded-br-none" : "bg-[var(--color-surface)] text-[var(--color-text)] rounded-bl-none border border-[var(--color-border)]"}`}>
                <p>{message.plaintext || "[Decryption failed]"}</p>
                <span
                    className={`block text-[10px] mt-1 ${ isOwnMessage ? "text-right text-[var(--color-text-inverse)]" : "text-left text-[var(--color-text-light)]"}`}>
                    {time} {message.verified ? "✔" : "✖"}
                </span>
            </div>
        </div>
    );
}