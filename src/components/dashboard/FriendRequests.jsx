import { useEffect, useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { incomingRequests, approveRequest, rejectRequest } from '../../api/friends.js';
import NoteMessageStruct from '../NoteMessageStruct.jsx';
import truncatePublicKey from "../../utils/truncatePublicKey.js";

export default function FriendRequests({ setTotalFriend, showChat }) {
    const [requests, setRequests] = useState([]);
    const [noteMessage, setNoteMessage] = useState("");
    const [success, setSuccess] = useState(null);

    const incomingReqs = async () => {
        try {
            const res = await incomingRequests();
            setRequests(res.incomingRequests);
            setTotalFriend(prev => ({ ...prev, requests: res.incomingRequests.length }));
        } catch (error) {
            setNoteMessage(error.response?.data?.message || "something went wrong!");
        }
    }

    useEffect(() => {
        incomingReqs();
        const isLargeScreen = window.innerWidth >= 1024;
        if (showChat && !isLargeScreen) return;
        const interval = setInterval(() => {
            incomingReqs();
        }, 6000);
        return () => clearInterval(interval);
    }, [showChat]);

    // accept or reject
    const handleRequest = async (pk, action) => {
        try {
            const res = action === "approve" ? await approveRequest(pk) : await rejectRequest(pk);
            setNoteMessage(res.message);
            setSuccess(true);
            incomingReqs();
        } catch (error) {
            setNoteMessage(error.response?.data?.message || `Failed to ${action === "approve" ? "approve" : "reject"} request`);
            setSuccess(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto scrollbar-hide">
            <div>
                <NoteMessageStruct message={noteMessage} success={success} onClear={() => { setNoteMessage(""); setSuccess(null); }} />
                {requests.length > 0 ? (
                    <div className="space-y-4 pb-42">
                        {requests.map((request, index) => (
                            <div key={request.id} className="p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <p className="w-10 h-10 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-[var(--color-text-inverse)] font-semibold text-sm">{index + 1}</p>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-[var(--color-text)] font-mono">
                                                {truncatePublicKey(request.publicKey)}
                                            </h3>
                                            <p className="text-xs text-[var(--color-text-light)]">{new Date(request.timeStamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleRequest(request.publicKey, "approve")} className="bg-[var(--color-success)] hover:bg-[#15803d] text-[var(--color-text-inverse)] p-2 rounded-full transition-colors" title="Approve request">
                                            <FiCheck size={16} />
                                        </button>
                                        <button onClick={() => handleRequest(request.publicKey, "reject")} className="bg-[var(--color-error)] hover:bg-[#b91c1c] text-[var(--color-text-inverse)] p-2 rounded-full transition-colors" title="Reject request">
                                            <FiX size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="text-sm text-[var(--color-text-light)]">No pending requests</p>
                    </div>
                )}
            </div>
        </div>
    );
}