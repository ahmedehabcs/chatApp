import { useState } from "react";
import { formatPrivateKey } from "../../utils/FormatPublicKey";

export default function PrivateKeyPopup({ setPrivateKey, privateKeyPop, setShowPrivateKeyPop }) {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const rawValue = inputValue.trim();
        if (!rawValue) return;
        setPrivateKey(formatPrivateKey(rawValue));
        setShowPrivateKeyPop(false);
        setInputValue(null);
    };

    const handleClose = () => {
        setShowPrivateKeyPop(false);
        setInputValue(null);
    };

    if (!privateKeyPop) return null;

    return (
        <div onClick={handleClose} className="fixed p-4 inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md rounded-2xl bg-[var(--color-bg-dark)] border border-[var(--color-border)] p-6 shadow-xl">
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Enter Your Private Key</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Private Key"
                        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-main)] focus:outline-none"
                    />
                    <p className="text-sm text-[var(--color-text-light)]">This private key stays on your device. Never share it with anyone.</p>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={handleClose} className="rounded-md bg-[var(--color-surface)] px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-border)] transition">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!inputValue?.trim()}
                            className="rounded-md bg-[var(--color-main)] px-4 py-2 text-white hover:bg-[var(--color-main-hover)] transition disabled:opacity-50"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}