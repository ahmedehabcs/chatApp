import { useState, lazy } from 'react';
import { FiMessageSquare, FiUserPlus, FiUser } from 'react-icons/fi';
import { AnimatedBubbles, AnimatedTriangles } from '../components/AnimatedBg.jsx';
import FriendList from '../components/dashboard/FriendList';
import ChatWindow from '../components/dashboard/ChatWindow';
import FriendRequests from '../components/dashboard/FriendRequests';
import ProfilePopup from "../components/ProfilePopup.jsx";
const AddFriend = lazy(() => import("../components/dashboard/AddFriend.jsx"));

export default function Dashboard() {
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [activeView, setActiveView] = useState('chats');
    const [showChat, setShowChat] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const handleSelectFriend = (friend) => {
        setSelectedFriend(friend);
        setShowChat(true);
        window.history.pushState({ chatOpen: true }, '');
    };

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
                            <ProfilePopup
                                showProfile={showProfile}
                                setShowProfile={setShowProfile}
                            />
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