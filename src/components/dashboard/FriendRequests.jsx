import { useEffect, useState } from 'react';
import { FiSearch, FiCheck, FiX } from 'react-icons/fi';
import { incomingRequests, approveRequest, rejectRequest } from '../../api/friends.js';
import NoteMessageStruct from '../NoteMessageStruct.jsx';

export default function FriendRequests() {
    const [searchQuery, setSearchQuery] = useState('');
    const [requests, setRequests] = useState([]);
    const [noteMessage, setNoteMessage] = useState("");
    const [success, setSuccess] = useState(null);

    // all incoming requests
    const incomingReqs = async () => {
        try {
            const res = await incomingRequests();
            setRequests(res.incomingRequests);
        } catch (error) {
            console.log(error);
            setNoteMessage(error.response?.data?.message || "sth went wrong");
        }
    }
    useEffect(() => {
        incomingReqs();
    }, [])

    // accept or reject
    const handleRequest = async (pk, action) => {
        try {
            const res = action === "approve" ? await approveRequest(pk) : await rejectRequest(pk);
            setNoteMessage(res.message);
            setSuccess(true);
            incomingReqs();
        } catch (error) {
            setNoteMessage( error.response?.data?.message || `Failed to ${action === "approve" ? "approve" : "reject"} request`);
            setSuccess(false);
        }
    };


    const filteredRequests = requests.filter(request =>
        request.publicKey.toLowerCase().includes(searchQuery.toLowerCase())
    );    

    return (
        <div className="h-full overflow-y-auto scrollbar-hide">
            <div className="p-4 flex items-center justify-between">
                <div className="relative w-full">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                    <input
                        type="text"
                        placeholder="Search by public key..."
                        className="pl-10 pr-4 py-2 w-full border border-[var(--color-main)] rounded-lg text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div>
                <NoteMessageStruct message={noteMessage} success={success} onClear={() => { setNoteMessage(""); setSuccess(null);}} />
                {filteredRequests.length > 0 ? (
                    <div className="space-y-4 pb-42">
                        {filteredRequests.map(request => (
                            <div key={request.id} className="p-3 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg)]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-[var(--color-text-inverse)] font-semibold text-sm">
                                            {request.publicKey.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-[var(--color-text)] font-mono">{request.publicKey}</h3>
                                            <p className="text-xs text-[var(--color-text-light)]">{new Date(request.timeStamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleRequest(request.publicKey, "approve")}
                                            className="bg-[var(--color-success)] hover:bg-[#15803d] text-[var(--color-text-inverse)] p-2 rounded-full transition-colors"
                                            title="Approve request"
                                        >
                                            <FiCheck size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleRequest(request.publicKey, "reject")}
                                            className="bg-[var(--color-error)] hover:bg-[#b91c1c] text-[var(--color-text-inverse)] p-2 rounded-full transition-colors"
                                            title="Reject request"
                                        >
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