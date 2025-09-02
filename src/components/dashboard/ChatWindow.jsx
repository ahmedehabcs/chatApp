import { useState, useEffect, useRef, useCallback } from 'react';
import { getMessage } from "../../api/messages.js";
import { EmptyChatState, NoMessagesState } from './chat/EmptyState.jsx';
import useAuth from "../../hooks/useAuth.jsx";
import useSocket from '../../hooks/useSocket.jsx';
import ChatHeader from './chat/ChatHeader.jsx';
import MessageInput from './chat/MessageInput.jsx';
import MessageBubble from './chat/MessageBubble.jsx';

export default function ChatWindow({ selectedFriend, setSelectedFriend, showChat, setShowChat }) {
    const [messages, setMessages] = useState([]);
    const [noteMessage, setNoteMessage] = useState();
    const [success, setSuccess] = useState(null);
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [currentChatId, setCurrentChatId] = useState(null);
    const { user } = useAuth();
    const socketRef = useSocket(user?.publicKey);
    
    /* Non-changeable functions */
    useEffect(() => {
        const handleBrowserBack = (event) => {
            if (showChat) {
                handleBackToFriends();
                window.history.pushState(null, '', window.location.pathname);
            }
        };
        window.addEventListener('popstate', handleBrowserBack);
        if (showChat) window.history.pushState({ chatOpen: true }, '');

        return () => {
            window.removeEventListener('popstate', handleBrowserBack);
            if (showChat && window.history.state?.chatOpen) window.history.back();
        };
    }, [showChat]);
    const handleBackToFriends = useCallback(() => {
        setShowChat(false);
        setSelectedFriend(null);
        if (window.history.state?.chatOpen) window.history.back();
    }, [setShowChat, setSelectedFriend]);
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [currentChatId]);
    const scrollToBottom = useCallback(() => {
        const container = messagesEndRef.current?.parentNode;
        if (container) container.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    const handleSendMessage = useCallback(() => {
        const text = textareaRef.current?.value.trim();
        if (!text || !currentChatId) return;
        socketRef.current.emit("sendMessage", { chatId: currentChatId, text });
        textareaRef.current.value = "";
    }, [currentChatId, socketRef]);
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
                setNoteMessage(err.response?.data?.message || "Failed to join chat");
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
            <div className="flex-1 p-4 overflow-y-auto pb-5 scrollbar-none flex flex-col-reverse">
                {messages.length > 0 ? (
                    [...messages].reverse().map((message, index) => {
                        const time = new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
                        const isOwnMessage = message.sender === user.publicKey;
                        return (
                            <MessageBubble key={index} message={message} isOwnMessage={isOwnMessage} time={time} />
                        );
                    })
                ) : (
                    <NoMessagesState />
                )}
                <div ref={messagesEndRef} />
            </div>
            <MessageInput handleSendMessage={handleSendMessage} handleKeyDown={handleKeyDown} textareaRef={textareaRef} />
        </div>
    );
}