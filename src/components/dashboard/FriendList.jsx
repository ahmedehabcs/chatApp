import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { FiTrash2 } from 'react-icons/fi';
import { listFriends, removeFriend } from "../../api/friends.js";
import NoteMessageStruct from '../NoteMessageStruct.jsx';

export default function FriendList({ onSelectFriend, selectedFriend, setSelectedFriend, showChat, setShowChat }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [friends, setFriends] = useState([]);
    const [noteMessage, setNoteMessage] = useState("");
    const [success, setSuccess] = useState(null);

    // list friends
    const friendList = async () => {
        try {
            const res = await listFriends();
            setFriends(res.friends);
        } catch (error) {
            setNoteMessage(error.response?.data?.message || `Failed to list your friend`);
        }
    }

    useEffect(() => {
        friendList();
    }, [])

    // remove friend
    const handleRemoveFriend = async (pk) => {
        const confirmed = window.confirm("Are you sure you want to remove this friend?");
        if (!confirmed) return;
        try {
            const res = await removeFriend(pk);
            setSelectedFriend(null);
            setShowChat(false);
            friendList();
            setSuccess(res.success);
            setNoteMessage(res.message);
        } catch (error) {
            setSuccess(false);
            setNoteMessage(error.response?.data?.message || "Failed to remove friend");
        }
    };

    const filteredFriends = (friends ?? []).filter(friend =>
        friend.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`relative h-full flex flex-col ${showChat ? 'hidden lg:block' : 'block'}`}>
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
            <div className="flex-1 min-h-0 overflow-hidden pb-42">
                <div className="h-full overflow-y-auto scrollbar-hide">
                    <NoteMessageStruct message={noteMessage} success={success} onClear={() => { setNoteMessage(""); setSuccess(null);}}/>
                    <div className="divide-y divide-[var(--color-border)]">
                        {filteredFriends.map(friend => (
                            <div key={friend} className={`p-4 flex items-center justify-between cursor-pointer hover:bg-[var(--color-main-bg)] transition-all duration-200 ${selectedFriend === friend ? 'bg-[var(--color-main-bg)]' : ''}`} onClick={() => onSelectFriend(friend)}>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--color-main)] flex items-center justify-center text-[var(--color-text-inverse)] font-semibold text-sm md:text-base">
                                        {friend.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm md:text-base font-medium text-[var(--color-text)] font-mono">{friend}</h3>
                                        <p className="text-xs md:text-sm text-[var(--color-text-light)] truncate max-w-[150px] md:max-w-xs">
                                            Start a conversation...
                                        </p>
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    <button title='add alice' className='p-2 text-[var(--color-secondary)] hover:bg-[var(--color-secondary-bg)] rounded-full transition-colors'>
                                        <MdOutlineDriveFileRenameOutline />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRemoveFriend(friend); }} className="p-2 text-[var(--color-error)] hover:bg-[var(--color-error-bg)] rounded-full transition-colors" title='remove friend'>
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredFriends.length === 0 && (
                            <div className="p-8 text-center">
                                <p className="text-[var(--color-text-light)]">No friends found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}