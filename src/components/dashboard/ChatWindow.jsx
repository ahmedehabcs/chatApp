import { useState, useEffect, useRef, useCallback } from 'react';
import { getMessage } from "../../api/messages.js";
import useAuth from "../../hooks/useAuth.jsx";
import useSocket from '../../hooks/useSocket.jsx';
import ChatHeader from './chat/ChatHeader.jsx';
import MessageInput from './chat/MessageInput.jsx';
import MessageBubble from './chat/MessageBubble.jsx';
import { EmptyChatState, NoMessagesState } from './chat/EmptyState.jsx';

export default function ChatWindow({ selectedFriend, setSelectedFriend, showChat, setShowChat }) {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [noteMessage, setNoteMessage] = useState();
    const [success, setSuccess] = useState(null);
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);
    const { user: myPublicKey } = useAuth();

    const socketRef = useSocket(myPublicKey);
    const [currentChatId, setCurrentChatId] = useState(null);

    /* Non-changeable functions */
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

    const handleBackToFriends = useCallback(() => {
        setShowChat(false);
        setSelectedFriend(null);
        if (window.history.state?.chatOpen) {
            window.history.back();
        }
    }, [setShowChat, setSelectedFriend]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [newMessage, currentChatId]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const handleSendMessage = useCallback(() => {
        if (!newMessage.trim() || !currentChatId) return;
        socketRef.current.emit("sendMessage", { chatId: currentChatId, text: newMessage.trim() });
        setNewMessage('');
    }, [newMessage, currentChatId, socketRef]);

    const onClearNoteMessage = useCallback(() => {
        setNoteMessage("");
        setSuccess(null);
    }, []);

    /* Socket and message handling */
    useEffect(() => {
        if (!selectedFriend || !socketRef.current) return;
        const socket = socketRef.current;
        const joinChatRoom = async () => {
            try {
                const res = await getMessage(selectedFriend.publicKey);
                setMessages(res.messages);
                setCurrentChatId(res.chat);
                socket.emit("joinChat", { otherPublicKey: selectedFriend.publicKey });
                setTimeout(scrollToBottom, 100);
            } catch (err) {
                console.error("Failed to join chat:", err);
            }
        };
        joinChatRoom();
        const handleNewMessage = (msg) => {
            setMessages(prev => [...prev, msg]);
            setTimeout(scrollToBottom, 100);
        };
        socket.on("newMessage", handleNewMessage);
        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [selectedFriend, socketRef, scrollToBottom]);

    if (!selectedFriend) {
        return (
            <div className={`flex flex-col h-full ${showChat ? 'block w-full' : 'hidden lg:block w-full'}`}>
                <EmptyChatState />
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full ${showChat ? 'block w-full' : 'hidden lg:block w-full'}`}>
            <ChatHeader selectedFriend={selectedFriend} handleBackToFriends={handleBackToFriends} noteMessage={noteMessage} success={success} onClearNoteMessage={onClearNoteMessage} />

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto pb-15 scrollbar-none flex flex-col">
                {messages.length > 0 ? (
                    messages.map((message, index) => {
                        const time = new Date(message.createdAt).toLocaleTimeString([], {  hour: "numeric",  minute: "2-digit",  hour12: true });
                        const isOwnMessage = message.sender === myPublicKey;
                        return (
                            <MessageBubble key={index} message={message} isOwnMessage={isOwnMessage} time={time} />
                        );
                    })
                ) : (
                    <NoMessagesState />
                )}
                <div ref={messagesEndRef} />
            </div>
            <MessageInput newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} handleKeyDown={handleKeyDown} textareaRef={textareaRef} />
        </div>
    );
}