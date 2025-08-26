import { useState } from 'react';
import { FiUserPlus, FiLoader, FiKey } from 'react-icons/fi';
import { outgoingRequest } from "../../api/friends.js";

export default function AddFriend() {
    const [publicKey, setPublicKey] = useState("");
    const [noteMessage, setNoteMessage] = useState("");
    const [success, setSuccess] = useState(null); // true | false | null
    const [loading, setLoading] = useState(false);

    const handleSendRequest = async () => {
        const cleanPK = publicKey.replace(/\s+/g, "").toLowerCase();
        setLoading(true);
        setNoteMessage("");
        setSuccess(null);

        try {
            const res = await outgoingRequest(cleanPK);
            setNoteMessage(res.message);
            setSuccess(res.success);
            if (res.success) {
                setTimeout(() => {
                    setNoteMessage("");
                    setSuccess(null);
                }, 5000);
            }
        } catch (error) {
            setNoteMessage(error.response?.data?.message || "Something went wrong");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setNoteMessage("");
        setSuccess(null);
        setPublicKey(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendRequest();
        }
    };
    
    return (
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text)] mb-3 sm:mb-4 flex items-center">
                <FiUserPlus className="mr-2 sm:mr-3 text-[var(--color-main)]" />
                Add New Friend
            </h2>

            {noteMessage && (
                <div
                    className={`mb-3 sm:mb-4 p-3 rounded-lg sm:rounded-xl flex items-center shadow-sm sm:shadow-md border ${success
                            ? "bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]/30"
                            : "bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error)]/30"
                        }`}
                >
                    {success ? (
                        <FiCheckCircle className="mr-2 flex-shrink-0" size={16} />
                    ) : (
                        <FiAlertCircle className="mr-2 flex-shrink-0" size={16} />
                    )}
                    <span className="text-xs sm:text-sm">{noteMessage}</span>
                </div>
            )}

            <div className="flex flex-col gap-2 sm:gap-3">
                <div className="relative">
                    <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" size={16} />
                    <input
                        type="text"
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter friend's public key"
                        className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base
                            bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg sm:rounded-xl 
                            text-[var(--color-text)] placeholder-[var(--color-text-light)] 
                            focus:outline-none focus:ring-2 focus:ring-[var(--color-main)]/50 
                            focus:border-[var(--color-main)] transition-all"
                    />
                </div>

                <button
                    onClick={handleSendRequest}
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main-hover)] 
                        text-[var(--color-text-inverse)] font-medium rounded-lg sm:rounded-xl 
                        hover:from-[var(--color-main-hover)] hover:to-[var(--color-main-light)]
                        disabled:opacity-70 disabled:cursor-not-allowed transition-all 
                        flex items-center justify-center shadow-sm sm:shadow-lg shadow-[var(--color-main)]/10
                        text-sm sm:text-base"
                >
                    {loading ? (
                        <>
                            <FiLoader className="animate-spin mr-2" size={16} />
                            Sending...
                        </>
                    ) : (
                        <>
                            <FiUserPlus className="mr-2" size={16} />
                            Send Request
                        </>
                    )}
                </button>
            </div>

            <p className="text-xs text-[var(--color-text-light)] mt-2 sm:mt-3">
                Enter your friend's public key to send them a friend request
            </p>
        </div>
    );
}