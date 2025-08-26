import { useState } from 'react';
import { FiUserPlus, FiLoader } from 'react-icons/fi';
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
        <div className="p-4">
            <h2 className="text-lg md:text-xl font-semibold text-[var(--color-text)] mb-3 flex items-center">
                <FiUserPlus className="mr-2" /> Add Friend
            </h2>

            {noteMessage && (
                <div
                    className={`mb-3 px-4 py-2 rounded-md text-sm shadow-sm border
                        ${success
                            ? "bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]"
                            : "bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error)]"
                        }`}
                >
                    {noteMessage}
                </div>
            )}

            <div className="flex items-center">
                <input
                    type="text"
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter public key"
                    className="flex-1 border border-[var(--color-main)] rounded-lg px-4 py-2 text-sm md:text-base"
                />

                <button
                    onClick={handleSendRequest}
                    disabled={loading}
                    className="relative text-[var(--color-main)] px-4 py-2 rounded-lg text-sm md:text-base transition-colors flex items-center justify-center min-w-[100px] disabled:opacity-70"
                >
                    {loading ? (
                        <FiLoader className="animate-spin h-5 w-5" />
                    ) : (
                        "Send Request"
                    )}
                </button>
            </div>
        </div>
    );
}
