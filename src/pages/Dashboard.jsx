import { useState } from 'react';
import { FiMessageSquare, FiUserPlus, FiUser, FiCopy, FiX, FiLogOut } from 'react-icons/fi';
import { AnimatedBubbles, AnimatedTriangles } from '../components/AnimatedBg.jsx';
import FriendList from '../components/dashboard/FriendList';
import ChatWindow from '../components/dashboard/ChatWindow';
import FriendRequests from '../components/dashboard/FriendRequests';
import AddFriend from '../components/dashboard/AddFriend';
import useAuth from '../hooks/useAuth.jsx';
import { logout } from "../api/auth.js";

export default function Dashboard() {
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [activeView, setActiveView] = useState('chats');
    const [showChat, setShowChat] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const { user: publicKey } = useAuth();

    const handleSelectFriend = (friend) => {
        setSelectedFriend(friend);
        setShowChat(true);
        window.history.pushState({ chatOpen: true }, '');
    };

    const logoutbtn = async () => {
        const confirmed = window.confirm("Are you sure you want to logout!");
        if (!confirmed) return;
        await logout();
        window.location.reload();
    }

    return (
        <section className="min-h-[100dvh] backdrop-blur-3xl bg-[#000000] text-[var(--color-text)] relative overflow-hidden">
            <AnimatedBubbles />
            <AnimatedTriangles />
            <div className="relative z-10 h-[100dvh] flex flex-col">
                <header className={`p-4 relative ${showChat ? 'lg:block hidden' : 'block'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-main)]">
                                Secure Chat
                            </h1>
                            <p className="text-sm md:text-base text-[var(--color-text-light)]">
                                End-to-end encrypted messaging
                            </p>
                        </div>

                        {/* Profile Icon */}
                        <div className="relative">
                            <button onClick={() => setShowProfile(!showProfile)} className="p-2 rounded-full transition-colors" title="My Profile" >
                                <FiUser size={24} />
                            </button>

                            {/* Profile Popup */}
                            {showProfile && (
                                <div className="absolute right-0 mt-2 w-80 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 overflow-hidden">
                                    <div className="p-4">
                                        <h2 className="text-[var(--color-text)] font-semibold flex items-center gap-2">
                                            <FiUser size={18} />
                                            My Identity
                                        </h2>
                                        <p className="text-xs text-[var(--color-text-light)] mt-1">
                                            This is your unique public key that others use to message you
                                        </p>
                                    </div>

                                    <div className="p-4">
                                        <div className="mb-3">
                                            <label className="text-xs font-medium text-[var(--color-text-light)] block mb-1">
                                                YOUR PUBLIC KEY
                                            </label>
                                            <div className="relative">
                                                <p className="text-sm text-[var(--color-text)] break-all p-3 bg-[var(--color-bg-light)] rounded border border-[var(--color-border)] font-mono overflow-x-auto">
                                                    {publicKey}
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(publicKey);
                                                    }}
                                                    className="absolute top-2 right-2 p-1 text-[var(--color-text-light)] hover:text-[var(--color-main)]"
                                                    title="Copy to clipboard"
                                                >
                                                    <FiCopy size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Logout Button */}
                                        <button
                                            onClick={logoutbtn}
                                            className="w-full mb-3 px-4 py-2 bg-[var(--color-error)] text-[var(--color-text-inverse)] rounded-md hover:bg-[var(--color-error-bg)] transition-colors flex items-center justify-center gap-2"
                                        >
                                            <FiLogOut size={16} />
                                            Logout
                                        </button>

                                        {/* Close Button */}
                                        <button
                                            onClick={() => setShowProfile(false)}
                                            className="w-full px-4 py-2 bg-[var(--color-main)] text-[var(--color-text-inverse)] rounded-md hover:bg-[var(--color-main-hover)] transition-colors flex items-center justify-center gap-2"
                                        >
                                            <FiX size={16} />
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <div className="flex-1 flex overflow-hidden">
                    <div className={`h-full overflow-hidden ${showChat ? 'hidden lg:block w-96' : 'block w-full lg:w-96'}`}>
                        <AddFriend />
                        <div className="flex">
                            <button className={`flex-1 py-3 text-sm md:text-base font-medium flex items-center justify-center ${activeView === 'chats' ? 'text-[var(--color-main)] border-b-2 border-[var(--color-main)]' : 'text-[var(--color-text-light)]'}`} onClick={() => setActiveView('chats')}>
                                <FiMessageSquare className="mr-2" /> Chats
                            </button>
                            <button className={`flex-1 py-3 text-sm md:text-base font-medium flex items-center justify-center ${activeView === 'requests' ? 'text-[var(--color-main)] border-b-2 border-[var(--color-main)]' : 'text-[var(--color-text-light)]'}`} onClick={() => setActiveView('requests')}>
                                <FiUserPlus className="mr-2" /> Requests
                            </button>
                        </div>
                        <div className="h-full overflow-y-auto">
                            {activeView === 'chats' ? (
                                <FriendList onSelectFriend={handleSelectFriend} selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} showChat={showChat} setShowChat={setShowChat} />
                            ) : (
                                <FriendRequests />
                            )}
                        </div>
                    </div>
                    <div className={`${showChat ? 'flex flex-1' : 'hidden lg:flex flex-1'}`}>
                        <ChatWindow selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} showChat={showChat} setShowChat={setShowChat} />
                    </div>
                </div>
            </div>
        </section>
    );
}