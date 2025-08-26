import { FiMessageSquare } from 'react-icons/fi';

export const EmptyChatState = () => (
    <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-light)] p-4 text-center">
        <FiMessageSquare size={48} className="mb-4 text-[var(--color-main-light)]" />
        <h3 className="text-lg md:text-xl font-medium mb-2 text-[var(--color-text)]">
            Select a friend to start chatting
        </h3>
        <p className="text-sm md:text-base">
            Choose a conversation from your friends list to begin messaging
        </p>
    </div>
);

export const NoMessagesState = () => (
    <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-light)] p-4 text-center">
        <h3 className="text-lg md:text-xl font-medium mb-2 text-[var(--color-text)]">
            No chat found!
        </h3>
    </div>
);