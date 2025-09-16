import { useState, useEffect, useRef, useCallback } from 'react';
import { EmptyChatState, NoMessagesState } from './EmptyState.jsx';
import { encryptMessage, decryptMessage, signMessage, verifySignature } from "../../../utils/messageFlow.js";
import { validatePrivateKey } from '../../../utils/validatePrivateKey.js';
import { groupMessagesByDay } from "../../../utils/groupMessagesByDay.js";
import useAuth from "../../../hooks/useAuth.jsx";
import useSocket from '../../../hooks/useSocket.jsx';
import ChatHeader from './ChatHeader.jsx';
import MessageInput from './MessageInput.jsx';
import MessageDayGroup from './MessageDayGroup.jsx';

export default function ChatWindow({ privateKey, selectedFriend, setSelectedFriend, showChat, setShowChat }) {
    const [messages, setMessages] = useState([]);
    const [noteMessage, setNoteMessage] = useState();
    const [success, setSuccess] = useState(null);
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [currentChatId, setCurrentChatId] = useState(null);
    const { user } = useAuth();
    const socketRef = useSocket();

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


    const initialLoad = useRef(true);
    useEffect(() => {
        if (!selectedFriend || !socketRef.current || !showChat) return;
        const socket = socketRef.current;
        initialLoad.current = true;

        // join chat room
        socket.emit("joinChat", { otherPublicKey: selectedFriend.publicKey });

        // ⬇️ first load: history
        socket.on("chatHistory", async (msgs) => {
            const decryptedMessages = await Promise.all(
                msgs.map(async (msg) => {
                    try {
                        const ciphertext = msg.sender === user?.publicKey ? msg.ciphertexts.sender : msg.ciphertexts.recipient;
                        const plaintext = await decryptMessage(privateKey, ciphertext);
                        const isValid = await verifySignature(msg.sender, plaintext, msg.signature);
                        return { ...msg, plaintext, verified: isValid };
                    } catch {
                        return { ...msg, plaintext: "[Decryption failed]", verified: false };
                    }
                })
            );
            setMessages(decryptedMessages);
            setCurrentChatId(msgs.length ? msgs[0].chatId : null);
            initialLoad.current = false;
        });

        // ⬇️ realtime new messages
        socket.on("newMessage", async (msg) => {
            try {
                const ciphertext = msg.sender === user?.publicKey ? msg.ciphertexts.sender : msg.ciphertexts.recipient;
                const decrypted = await decryptMessage(privateKey, ciphertext);
                const isValid = await verifySignature(msg.sender, decrypted, msg.signature);
                setMessages((prev) => {
                    const updated = [...prev, { ...msg, plaintext: decrypted, verified: isValid }];
                    if (!initialLoad.current) setTimeout(scrollToBottom, 100);
                    return updated;
                });
            } catch {
                setMessages((prev) => [...prev, { ...msg, plaintext: "[Decryption failed]", verified: false }]);
            }
        });

        return () => {
            socket.off("chatHistory");
            socket.off("newMessage");
        };
    }, [selectedFriend, socketRef, showChat]);

    // online status
    useEffect(() => {
        if (!socketRef.current || !selectedFriend) return;
        const socket = socketRef.current;

        const timeoutId = setTimeout(() => {
            socket.emit("checkOnlineStatus", { publicKey: selectedFriend.publicKey });
        }, 1000);

        const handleUserOnline = ({ publicKey, online }) => {
            setSelectedFriend(prev => {
                if (!prev) return prev;
                if (prev.publicKey === publicKey) return { ...prev, online };
                return prev;
            });
        };

        socket.on("userOnline", handleUserOnline);
        socket.on("userOffline", handleUserOnline);

        return () => {
            clearTimeout(timeoutId);
            socket.off("userOnline", handleUserOnline);
            socket.off("userOffline", handleUserOnline);
        };
    }, [socketRef, selectedFriend, setSelectedFriend]);


    if (!selectedFriend) {
        return (
            <div className={`flex flex-col h-full ${showChat ? 'block w-full' : 'hidden lg:block w-full'}`}>
                <EmptyChatState />
            </div>
        );
    }

    const grouped = groupMessagesByDay(messages);
    const days = Object.keys(grouped).sort(
        (a, b) => new Date(a) - new Date(b)
    );

    return (
        <div className={`flex flex-col h-full ${showChat ? 'block w-full' : 'hidden lg:block w-full'}`}>
            <ChatHeader selectedFriend={selectedFriend} handleBackToFriends={handleBackToFriends} noteMessage={noteMessage} success={success} onClearNoteMessage={onClearNoteMessage} />
            <div className="flex-1 p-4 overflow-y-auto pb-5 scrollbar-none flex flex-col-reverse">
                {days.length > 0 ? (
                    [...days].reverse().map((day) => (
                        <MessageDayGroup
                            key={day}
                            day={day}
                            messages={grouped[day]}
                            user={user}
                        />
                    ))
                ) : (
                    <NoMessagesState />
                )}
                <div ref={messagesEndRef} />
            </div>
            <MessageInput handleSendMessage={handleSendMessage} handleKeyDown={handleKeyDown} textareaRef={textareaRef} />
        </div>
    );
}