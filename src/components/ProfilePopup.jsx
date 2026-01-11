import { useState, useRef } from "react";
import { FiUser, FiX, FiLogOut, FiShare2, FiCopy } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";
import { logout } from "../api/auth.js";
import { clearDB } from "../utils/db.js";
import useAuth from "../hooks/useAuth.jsx";

export default function ProfilePopup({ showProfile, setShowProfile }) {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("key");
    const qrRef = useRef();

    const logoutbtn = async () => {
        const confirmed = window.confirm("Are you sure you want to logout!");
        if (!confirmed) return;
        await clearDB();
        await logout();
        window.location.reload();
    };

    const handleShareKey = async () => {
        const link = `${import.meta.env.VITE_FRONTEND_URL}/dashboard/add/${encodeURIComponent(user?.id)}`;
        const shareData = {
            title: "My Public Key",
            text: "Add me as a friend on Secure Chat!",
            url: link,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(link);
            }
        } catch (err) {
            console.log("Error sharing:", err);
        }
    };

    if (!showProfile) return null;

    return (
        <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)}>
            <div className="absolute right-4 top-18 w-80 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="p-4">
                    <h2 className="text-[var(--color-text)] font-semibold flex items-center gap-2">
                        <FiUser size={18} />
                        My Identity
                    </h2>
                    <p className="text-xs text-[var(--color-text-light)] mt-1">
                        This is your unique public key that others use to message you
                    </p>
                </div>
                <div className="flex border-b border-[var(--color-border)]">
                    <button onClick={() => setActiveTab("key")} className={`flex-1 py-2 text-sm font-medium ${activeTab === "key" ? "text-[var(--color-main)] border-b-2 border-[var(--color-main)]" : "text-[var(--color-text-light)] hover:text-[var(--color-text)]"}`}>
                        Public Key
                    </button>
                    <button onClick={() => setActiveTab("qr")} className={`flex-1 py-2 text-sm font-medium ${activeTab === "qr" ? "text-[var(--color-main)] border-b-2 border-[var(--color-main)]" : "text-[var(--color-text-light)] hover:text-[var(--color-text)]"}`}>
                        QR Code
                    </button>
                </div>
                <div className="p-4">
                    {activeTab === "key" ? (
                        <div className="mb-3">
                            <div className="flex justify-between items-center mb-2 px-1">
                                <label className="text-xs font-medium text-[var(--color-text-light)] block">
                                    YOUR PUBLIC KEY
                                </label>
                                <div className="flex gap-3 items-center">
                                    <FiCopy onClick={() => navigator.clipboard.writeText(user?.publicKey)} size={14} className="hover:text-[var(--color-main)] duration-200" />
                                    <FiShare2 onClick={handleShareKey} size={14} className="hover:text-[var(--color-main)] duration-200" />
                                </div>
                            </div>
                            <div className="relative">
                                <input type="text" value={user?.publicKey} readOnly className=" w-full text-sm text-[var(--color-text)] break-all p-3 bg-[var(--color-bg-dark)] rounded border border-[var(--color-border)] font-mono overflow-x-auto" />
                            </div>
                        </div>
                    ) : (
                        <div className="mb-3">
                            <label className="text-xs font-medium text-[var(--color-text-light)] block mb-2 text-center">
                                SCAN TO ADD ME
                            </label>
                            <div className="flex flex-col items-center">
                                <div className="p-4 bg-white rounded-lg border border-[var(--color-border)]">
                                    <QRCodeSVG
                                        ref={qrRef}
                                        value={`${import.meta.env.VITE_FRONTEND_URL}/dashboard/add/${user?.id}`}
                                        size={180}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <button onClick={logoutbtn} className="w-full mb-3 px-4 py-2 bg-[var(--color-error)] text-[var(--color-text-inverse)] rounded-md hover:bg-[var(--color-error)]/90 transition-colors flex items-center justify-center gap-2">
                        <FiLogOut size={16} />
                        Logout
                    </button>
                    <button onClick={() => setShowProfile(false)} className="w-8 h-8 rounded-full absolute top-3 right-2 text-white hover:bg-[var(--color-main-hover)] transition-colors flex items-center justify-center gap-2">
                        <FiX size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}