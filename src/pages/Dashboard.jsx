import { useState, lazy } from 'react';
import { FiMessageSquare, FiUserPlus } from 'react-icons/fi';
import { AnimatedBubbles, AnimatedTriangles } from '../components/AnimatedBg.jsx';
import FriendList from '../components/dashboard/FriendList';
import ChatWindow from '../components/dashboard/ChatWindow';
import FriendRequests from '../components/dashboard/FriendRequests';
import SettingsButton from '../components/dashboard/SettingsButton.jsx';
import FriendRequestButton from "../components/dashboard/FriendRequestButton.jsx";
const AddFriend = lazy(() => import("../components/dashboard/AddFriend.jsx"));
const PrivateKeyPopup = lazy(() => import("../components/dashboard/privateKeyPopup.jsx"));

export default function Dashboard({ privateKey, setPrivateKey }) {
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [activeView, setActiveView] = useState('chats');
    const [showChat, setShowChat] = useState(false);
    const [privateKeyPop, setShowPrivateKeyPop] = useState(true);
    const [totalFriend, setTotalFriend] = useState({ friends: 0, requests: 0 });

    return (
        <section className="min-h-[100dvh] grass-dark text-[var(--color-text)] relative overflow-hidden">
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
                        <SettingsButton privateKey={privateKey} privateKeyPop={privateKeyPop} setShowPrivateKeyPop={setShowPrivateKeyPop} />
                    </div>
                </header>
                <div className="flex-1 flex overflow-hidden">
                    <div className={`h-full overflow-hidden ${showChat ? 'hidden lg:block w-96' : 'block w-full lg:w-96'}`}>
                        <AddFriend />
                        <div className="flex">
                            <FriendRequestButton label="Chats" icon={FiMessageSquare} count={totalFriend.friends} isActive={activeView === 'chats'} onClick={() => setActiveView('chats')} />
                            <FriendRequestButton label="Requests" icon={FiUserPlus} count={totalFriend.requests} isActive={activeView === 'requests'} onClick={() => setActiveView('requests')} />
                        </div>
                        <div className="h-full overflow-y-auto">
                            {activeView === 'chats' ? (
                                <FriendList setTotalFriend={setTotalFriend} selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} showChat={showChat} setShowChat={setShowChat} />
                            ) : (
                                <FriendRequests setTotalFriend={setTotalFriend} showChat={showChat} />
                            )}
                        </div>
                    </div>
                    <div className={`${showChat ? 'flex flex-1' : 'hidden lg:flex flex-1'}`}>
                        <ChatWindow privateKey={privateKey} selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} showChat={showChat} setShowChat={setShowChat} />
                    </div>
                </div>
            </div>
            <PrivateKeyPopup setPrivateKey={setPrivateKey} privateKeyPop={privateKeyPop} setShowPrivateKeyPop={setShowPrivateKeyPop} />
        </section>
    );
}