import { useEffect, useRef } from "react";

export default function NoteMessageStruct({ message, success, duration = 5000, onClear }) {
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (!message) return;

        // Clear any existing timeout so it "renews" if a new message comes in
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            if (onClear) onClear(); // let parent reset state
        }, duration);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [message, duration, onClear]);
    if (!message) return null;
    return (
        <div className={`mb-3 px-4 py-2 rounded-md text-sm shadow-sm border break-words whitespace-pre-wrap ${success ? "bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]" : "bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error)]"}`}>
            {message}
        </div>
    );
}