import { useState } from "react";
import { FiClipboard } from "react-icons/fi";
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

    const handlePaste = async () => {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText) setInputValue(clipboardText);
    };

    if (!privateKeyPop) return null;

    return (
        <div onClick={handleClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md rounded-2xl bg-[var(--color-bg-dark)] border border-[var(--color-border)] p-6 shadow-xl">
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">Enter Your Private Key</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Private Key" className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-[var(--color-text)] pr-12 focus:ring-2 focus:ring-[var(--color-main)] focus:outline-none transition" autoFocus />
                        <button type="button" onClick={handlePaste} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] hover:text-[var(--color-main)] transition" title="Paste from clipboard">
                            <FiClipboard size={20} />
                        </button>
                    </div>
                    <p className="text-sm text-[var(--color-text-light)]">
                        This private key stays on your device. Never share it with anyone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={handleClose} className="rounded-md bg-[var(--color-surface)] px-4 py-2 text-[var(--color-text)] hover:bg-[var(--color-border)] transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={!inputValue?.trim()} className="rounded-md bg-[var(--color-main)] px-4 py-2 text-white hover:bg-[var(--color-main-hover)] transition disabled:opacity-50">
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}