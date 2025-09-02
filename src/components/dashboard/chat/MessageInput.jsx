import { FiSend } from 'react-icons/fi';

export default function MessageInput({ handleSendMessage, handleKeyDown, textareaRef }){
    return (
        <div className="p-4">
            <div className="flex items-end">
                <div className="flex-1 relative">
                    <textarea ref={textareaRef} onKeyDown={handleKeyDown} autoFocus placeholder="Type your message..." className="w-full border border-[var(--color-main)] rounded-full px-4 py-3 pr-12 text-sm resize-none transition-all duration-200 min-h-[44px] max-h-[120px] overflow-hidden" rows={1} />
                    <button onClick={handleSendMessage} className="absolute right-[5px] bottom-[14px] bg-[var(--color-main)] hover:bg-[var(--color-main-hover)] text-[var(--color-text-inverse)] p-2 rounded-full transition-all duration-200 flex items-center justify-center w-8 h-8" title="send message">
                        <FiSend className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};