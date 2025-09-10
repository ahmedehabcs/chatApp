import { useState, useEffect, useRef, useCallback } from 'react';
import { getMessage } from "../../api/messages.js";
import { EmptyChatState, NoMessagesState } from './chat/EmptyState.jsx';
import { encryptMessage, decryptMessage, signMessage, verifySignature } from "../../utils/cryptoHelpers.js";
import { validatePrivateKey } from '../../utils/validatePrivateKey.js';
import useAuth from "../../hooks/useAuth.jsx";
import useSocket from '../../hooks/useSocket.jsx';
import ChatHeader from './chat/ChatHeader.jsx';
import MessageInput from './chat/MessageInput.jsx';
import MessageBubble from './chat/MessageBubble.jsx';

export default function ChatWindow({ privateKey, selectedFriend, setSelectedFriend, showChat, setShowChat }) {
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
    const scrollToBottom = useCallback(() => {
        const container = messagesEndRef.current?.parentNode;
        if (container) container.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    const onClearNoteMessage = useCallback(() => {
        setNoteMessage("");
        setSuccess(null);
    }, []);
    /* Non-changeable functions */

    const handleSendMessage = useCallback(async () => {
        const text = textareaRef.current?.value.trim();
        if (!text || !currentChatId || !privateKey) return;

        const isValidKey = await validatePrivateKey(user?.publicKey, privateKey);
        if (!isValidKey) {
            setNoteMessage("Invalid private key — please provide a valid one.");
            return;
        }

        try {
            const ciphertextForMe = await encryptMessage(user.publicKey, text);
            const ciphertextForFriend = await encryptMessage(selectedFriend.publicKey, text);
            const signature = await signMessage(privateKey, text);
            socketRef.current.emit("sendMessage", {
                chatId: currentChatId,
                ciphertexts: {
                    sender: ciphertextForMe,
                    recipient: ciphertextForFriend,
                },
                signature,
                sender: user?.publicKey,
            });
            textareaRef.current.value = "";
        } catch (err) {
            console.error(err);
            setNoteMessage("Failed to send message securely");
        }
    }, [currentChatId, socketRef, selectedFriend, privateKey, user]);

    const handleKeyDown = useCallback((e) => {
        if (!user) return;
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage, user]);

    useEffect(() => {
        if (!selectedFriend || !socketRef.current || !privateKey) return;
        const socket = socketRef.current;

        const joinChatRoom = async () => {
            try {
                const res = await getMessage(selectedFriend.publicKey);
                const decryptedMessages = await Promise.all(
                    res.messages.map(async (msg) => {
                        try {
                            // pick the right ciphertext
                            const ciphertext =
                                msg.sender === user?.publicKey
                                    ? msg.ciphertexts.sender
                                    : msg.ciphertexts.recipient;

                            const plaintext = await decryptMessage(privateKey, ciphertext);
                            const isValid = await verifySignature(
                                msg.sender,
                                plaintext,
                                msg.signature
                            );

                            return { ...msg, plaintext, verified: isValid };
                        } catch (err) {
                            return { ...msg, plaintext: "[Decryption failed]", verified: false };
                        }
                    })
                );

                setMessages(decryptedMessages);
                setCurrentChatId(res.chat);
                socket.emit("joinChat", { otherPublicKey: selectedFriend.publicKey });
                setTimeout(scrollToBottom, 100);
            } catch (err) {
                setNoteMessage(err.response?.data?.message || "Failed to join chat");
            }
        };

        joinChatRoom();

        const handleNewMessage = async (msg) => {
            try {
                const ciphertext =
                    msg.sender === user?.publicKey
                        ? msg.ciphertexts.sender
                        : msg.ciphertexts.recipient;

                const decrypted = await decryptMessage(privateKey, ciphertext);
                const isValid = await verifySignature(msg.sender, decrypted, msg.signature);

                setMessages((prev) => [
                    ...prev,
                    { ...msg, plaintext: decrypted, verified: isValid },
                ]);

                setTimeout(scrollToBottom, 100);
            } catch (err) {
                setMessages((prev) => [
                    ...prev,
                    { ...msg, plaintext: "[Decryption failed]", verified: false },
                ]);
            }
        };

        socket.on("newMessage", handleNewMessage);
        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [selectedFriend, socketRef, scrollToBottom, privateKey]);


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
                        const isOwnMessage = message.sender === user?.publicKey;
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