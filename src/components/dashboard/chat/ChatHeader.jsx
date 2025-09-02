import NoteMessageStruct from "../../NoteMessageStruct.jsx";
import truncatePublicKey from '../../../utils/truncatePublicKey.js';
import { FiArrowLeft } from 'react-icons/fi';
import { CiUser } from "react-icons/ci";

export default function ChatHeader({ selectedFriend, handleBackToFriends, noteMessage, success, onClearNoteMessage }){
    return (
        <div className="p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
                <button onClick={handleBackToFriends} className="lg:hidden p-2 text-[var(--color-text-light)] hover:bg-[var(--color-surface)] rounded-full transition-colors" title="Back to friends list">
                    <FiArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--color-main)] flex items-center justify-center text-[var(--color-text-inverse)] font-semibold text-sm md:text-base">
                    <CiUser size={20} />
                </div>
                <h3 className="text-[10px] md:text-base font-medium text-[var(--color-text)] font-mono truncate">
                    {truncatePublicKey(selectedFriend.nickname ?? selectedFriend.publicKey)}
                </h3>
            </div>
            <div className="flex-shrink-0">
                <NoteMessageStruct message={noteMessage} success={success} onClear={onClearNoteMessage} />
            </div>
        </div>
    );
};