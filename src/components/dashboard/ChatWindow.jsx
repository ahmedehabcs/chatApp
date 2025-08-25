import { useState, useEffect, useRef } from 'react';
import { FiArrowLeft, FiSend, FiMessageSquare } from 'react-icons/fi';
import { sendMessage, getMessage } from "../../api/messages.js";
import NoteMessageStruct from '../NoteMessageStruct.jsx';
import useAuth from "../../hooks/useAuth.jsx";

export default function ChatWindow({ selectedFriend, setSelectedFriend, showChat, setShowChat }) {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [noteMessage, setNoteMessage] = useState();
    const [success, setSuccess] = useState(null);
    const counter = useRef(2);
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);
    const { user: myPublicKey } = useAuth();

    /* non changable functions */
    useEffect(() => {
        const handleBrowserBack = (event) => {
            if (showChat) {
                handleBackToFriends();
                window.history.pushState(null, '', window.location.pathname);
            }
        };
        window.addEventListener('popstate', handleBrowserBack);
        if (showChat) {
            window.history.pushState({ chatOpen: true }, '');
        }
        return () => {
            window.removeEventListener('popstate', handleBrowserBack);
            if (showChat && window.history.state?.chatOpen) {
                window.history.back();
            }
        };
    }, [showChat]);
    const handleBackToFriends = () => {
        setShowChat(false);
        setSelectedFriend(null);
        if (window.history.state?.chatOpen) {
            window.history.back();
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    /* non changable functions */



    const handleSendMessage = async () => {
        try {
            const res = await sendMessage(selectedFriend, newMessage);
            setNewMessage('');
            handleGetMessage();
            setSuccess(null);
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            setNoteMessage(error.response?.data?.message || `Failed to send messages`);
            setSuccess(false);
        }
    };

    const handleGetMessage = async () => {
        if (!selectedFriend) return;
        try {
            const res = await getMessage(selectedFriend);
            if (counter.current !== res.messages.length) {
                counter.current = res.messages.length;
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
            setMessages(res.messages);
            setSuccess(null);
        } catch (error) {
            setNoteMessage(error.response?.data?.message || `Failed to get messages`);
            setSuccess(false);
        }
    };


    useEffect(() => {
        if (!selectedFriend) return;
        setMessages([]);
        const interval = setInterval(() => {
            handleGetMessage();
        }, 1000);
        return () => clearInterval(interval);
    }, [selectedFriend]);


    return (
        <div className={`flex flex-col h-full ${showChat ? 'block w-full' : 'hidden lg:block w-full'}`}>
            {selectedFriend ? (
                <>
                    {/* Header */}
                    <div className="p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <button onClick={handleBackToFriends} className="lg:hidden p-2 text-[var(--color-text-light)] hover:bg-[var(--color-main-bg)] rounded-full transition-colors" title="Back to friends list" >
                                <FiArrowLeft size={20} />
                            </button>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--color-main)] flex items-center justify-center text-[var(--color-text-inverse)] font-semibold text-sm md:text-base">
                                {selectedFriend.substring(0, 2).toUpperCase()}
                            </div>
                            <h3 className="text-sm md:text-base font-medium text-[var(--color-text)] font-mono truncate">
                                {selectedFriend}
                            </h3>
                        </div>
                        {/* Right Section: Status/NoteMessage */}
                        <div className="flex-shrink-0">
                            <NoteMessageStruct message={noteMessage} success={success} onClear={() => { setNoteMessage(""); setSuccess(null); }} />
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto pb-12 scrollbar-none">
                        {messages.length > 0 ? (
                            messages.map((message, index) => (
                                <div key={index} className={`flex ${message.sender === myPublicKey ? 'justify-end' : 'justify-start'} mb-4`}>
                                    <div
                                        className={`max-w-xs md:max-w-md rounded-lg p-3 text-sm md:text-base ${message.sender === myPublicKey
                                            ? 'bg-[var(--color-main)] text-[var(--color-text-inverse)] rounded-br-none'
                                            : 'bg-[var(--color-surface)] text-[var(--color-text)] rounded-bl-none border border-[var(--color-border)]'
                                            }`}
                                    >
                                        {message.text}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-light)] p-4 text-center">
                                <h3 className="text-lg md:text-xl font-medium mb-2 text-[var(--color-text)]">
                                    No chat found!
                                </h3>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4">
                        <div className="flex items-end">
                            <div className="flex-1 relative">
                                <textarea
                                    ref={textareaRef}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={window.innerWidth >= 768 ? handleKeyDown : undefined}
                                    placeholder="Type your message..."
                                    className="w-full border border-[var(--color-main)] rounded-xl px-4 py-3 pr-12 text-sm resize-none transition-all duration-200 min-h-[44px] max-h-[120px] overflow-hidden"
                                    rows={1}
                                />
                                <button onClick={handleSendMessage} className="absolute right-[7px] bottom-3 bg-[var(--color-main)] hover:bg-[var(--color-main-hover)] text-[var(--color-text-inverse)] p-2 rounded-full transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-main)] shadow-md flex items-center justify-center w-8 h-8" title="send message">
                                    <FiSend className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-light)] p-4 text-center">
                    <FiMessageSquare size={48} className="mb-4 text-[var(--color-main-light)]" />
                    <h3 className="text-lg md:text-xl font-medium mb-2 text-[var(--color-text)]">
                        Select a friend to start chatting
                    </h3>
                    <p className="text-sm md:text-base">
                        Choose a conversation from your friends list to begin messaging
                    </p>
                </div>
            )}
        </div>
    );
}