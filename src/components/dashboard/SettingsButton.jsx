import { useState } from "react";
import { LuFileKey2 } from "react-icons/lu";
import { IoMdDoneAll } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import ProfilePopup from "../ProfilePopup";

export default function SettingsButton({ privateKey, setShowPrivateKeyPop, privateKeyPop }) {
    const [showProfile, setShowProfile] = useState(false);
    return (
        <div className="relative flex">
            <button onClick={() => setShowPrivateKeyPop(!privateKeyPop)} className={`relative flex items-center justify-between rounded-full w-18 transition-all duration-300 ${privateKey ? 'bg-[var(--color-success-bg)]' : 'bg-[var(--color-error-bg)]'} shadow-lg hover:shadow-xl`} title={privateKey ? "Private key is loaded ✅" : "Enter your private key to continue 🔑"}>
                <div className={`p-2 rounded-full transition-all duration-300 ${privateKey ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'} flex items-center justify-center`}>
                    <LuFileKey2 size={22} />
                </div>
                <div className="px-2">
                    {privateKey ? <IoMdDoneAll className="text-[var(--color-success)]" /> : <MdErrorOutline className="text-[var(--color-error)]" />}
                </div>
            </button>
            <button onClick={() => setShowProfile(!showProfile)} className="p-2 rounded-full hover:text-[var(--color-main-light)] duration-150" title="My Profile">
                <FiUser size={24} />
            </button>
            <ProfilePopup showProfile={showProfile} setShowProfile={setShowProfile} />
        </div>
    );
}