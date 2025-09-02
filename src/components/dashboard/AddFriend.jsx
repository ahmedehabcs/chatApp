import { useEffect, useState, lazy } from 'react';
import { FiUserPlus, FiLoader } from 'react-icons/fi';
import { outgoingRequest } from "../../api/friends.js";
import { useParams, useNavigate } from "react-router-dom";
import formatPublicKey from '../../utils/FormatPublicKey.js';
import NoteMessageStruct from '../NoteMessageStruct.jsx';
const AddFriendInput = lazy(() => import("./AddFriendInput.jsx"));

export default function AddFriend() {
    const [inputValue, setInputValue] = useState("");
    const [noteMessage, setNoteMessage] = useState("");
    const [success, setSuccess] = useState(null); // true | false | null
    const [loading, setLoading] = useState(false);
    const { key } = useParams();
    const navigate = useNavigate();

    const isPublicKey = (str) => str?.trim().startsWith("-----BEGIN");
    useEffect(() => {
        if (key) {
            handleSendRequest({ raw: key });
        }
    }, [key]);

    const handleSendRequest = async ({ raw } = {}) => {
        const value = raw?.trim() || inputValue?.trim();
        if (!value) return;
        const payload = isPublicKey(value) ? { receiverPublicKey: formatPublicKey(value) } : { receiverId: value };
        setLoading(true);
        setNoteMessage("");
        setSuccess(null);

        try {
            const res = await outgoingRequest(payload);
            setNoteMessage(res.message);
            setSuccess(res.success);
        } catch (error) {
            setNoteMessage(error.response?.data?.message || "Something went wrong");
            setSuccess(false);
        } finally {
            setLoading(false);
            navigate("/dashboard", { replace: true });
            setInputValue("");
        }
    };

    const handleInputChange = (e) => {
        setNoteMessage("");
        setSuccess(null);
        setInputValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSendRequest();
    };

    return (
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text)] mb-3 sm:mb-4 flex items-center">
                <FiUserPlus className="mr-2 sm:mr-3 text-[var(--color-main)]" />
                Add New Friend
            </h2>
            <NoteMessageStruct message={noteMessage} success={success} onClear={() => { setNoteMessage(""); setSuccess(null); }}/>
            <div className="flex flex-col gap-2 sm:gap-3">
                <AddFriendInput handleInputChange={handleInputChange} handleKeyPress={handleKeyPress} publicKey={inputValue} setPublicKey={setInputValue} />
                <button onClick={() => handleSendRequest()} disabled={loading} className="w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main-hover)] text-[var(--color-text-inverse)] font-medium rounded-lg sm:rounded-xl hover:from-[var(--color-main-hover)] hover:to-[var(--color-main-light)] disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-sm sm:shadow-lg shadow-[var(--color-main)]/10 text-sm sm:text-base">
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
                Enter your friend's public key or scan the QR/link to send a friend request
            </p>
        </div>
    );
}