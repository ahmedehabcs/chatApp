import { FiSend } from 'react-icons/fi';

const MessageInput = ({ newMessage, setNewMessage, handleSendMessage, handleKeyDown, textareaRef }) => {
    return (
        <div className="p-4">
            <div className="flex items-end">
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="w-full border border-[var(--color-main)] rounded-xl px-4 py-3 pr-12 text-sm resize-none transition-all duration-200 min-h-[44px] max-h-[120px] overflow-hidden"
                        rows={1}
                    />
                    <button 
                        onClick={handleSendMessage} 
                        className="absolute right-[7px] bottom-3 bg-[var(--color-main)] hover:bg-[var(--color-main-hover)] text-[var(--color-text-inverse)] p-2 rounded-full transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-main)] shadow-md flex items-center justify-center w-8 h-8" 
                        title="send message"
                    >
                        <FiSend className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
export default MessageInput;