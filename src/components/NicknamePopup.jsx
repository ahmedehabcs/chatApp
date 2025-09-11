import { useState, useEffect } from "react";
import { FiX, FiEdit2, FiCheck, FiUser, FiAlertCircle } from "react-icons/fi";
import { nicknameApi } from "../api/friends.js";

export default function NicknamePopup({ friend, setNoteMessage, setSuccess, setClosePopUp }) {
    const [value, setValue] = useState(friend?.nickname || "");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [charCountColor, setCharCountColor] = useState("var(--color-text-light)");

    useEffect(() => {
        if (value.length === 30) {
            setCharCountColor("var(--color-error)");
        } else if (value.length > 25) {
            setCharCountColor("var(--color-warning)");
        } else {
            setCharCountColor("var(--color-text-light)");
        }
    }, [value]);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue.length <= 30) {
            setValue(inputValue);
            setError(null);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let pop = value.trim().replace(/\s+/g, " ");
        if (!pop) {
            setError("Nickname cannot be empty.");
            setSuccess(false);
            setIsLoading(false);
            return;
        }

        if (pop.length > 30) {
            setError("Nickname must be 30 characters or less.");
            setSuccess(false);
            setIsLoading(false);
            return;
        }

        try {
            const res = await nicknameApi(friend.publicKey, pop);
            setNoteMessage(res.message);
            setSuccess(true);
            setClosePopUp();
        } catch (error) {
            console.log(error);
            setError("Something went wrong.");
            setSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-bg-dark)]/80 backdrop-blur-sm z-50 p-4">
            <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] w-full max-w-md relative shadow-lg shadow-[var(--color-main)]/10">
                {/* Close Button */}
                <button onClick={setClosePopUp} className="absolute top-4 right-4 text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors">
                    <FiX size={20} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-full bg-gradient-to-br from-[var(--color-main)] to-[var(--color-main-light)] text-[var(--color-text-inverse)]">
                        <FiEdit2 size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-[var(--color-text)]">
                        Change Nickname
                    </h2>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-[var(--color-error-bg)] border border-[var(--color-error)]/30 text-[var(--color-error)] flex items-center gap-2">
                        <FiAlertCircle size={16} />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Input Field */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[var(--color-text-light)]">
                            <FiUser size={18} />
                        </div>
                        <input type="text" value={value} onChange={handleInputChange} className="pl-10 pr-12 py-3 w-full rounded-xl bg-[var(--color-bg-dark)] border border-[var(--color-border)]  text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-main)]/50  focus:border-[var(--color-main)] transition-all placeholder-[var(--color-text-light)]" placeholder="Enter nickname..." autoFocus maxLength={30} />
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium`} style={{ color: charCountColor }}>
                            {value.length}/30
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-end pt-2">
                        <button type="button" onClick={setClosePopUp} className="px-5 py-2.5 rounded-xl bg-[var(--color-border)] text-[var(--color-text-light)] hover:bg-[var(--color-bg-dark)] hover:text-[var(--color-text)] transition-all flex items-center gap-2">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading || value.length > 30 || value.trim().length === 0} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main-hover)] text-[var(--color-text-inverse)] font-medium  hover:from-[var(--color-main-hover)] hover:to-[var(--color-main-light)] disabled:opacity-50 disabled:cursor-not-allowed  transition-all flex items-center gap-2 shadow-lg shadow-[var(--color-main)]/20">
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-[var(--color-text-inverse)]/30 border-t-[var(--color-text-inverse)] rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FiCheck size={16} />
                                    Save
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};