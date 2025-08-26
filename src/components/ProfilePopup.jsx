import { FiUser, FiCopy, FiX, FiLogOut } from 'react-icons/fi';
import useAuth from '../hooks/useAuth.jsx';
import { logout } from "../api/auth.js"

export default function ProfilePopup ({ showProfile, setShowProfile, onLogout }){
    const { user: publicKey } = useAuth();

    const logoutbtn = async () => {
        const confirmed = window.confirm("Are you sure you want to logout!");
        if (!confirmed) return;
        await logout();
        window.location.reload();
    }
    
    if (!showProfile) return null;

    return (
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
                        <p className="text-sm text-[var(--color-text)] break-all p-3 bg-[var(--color-bg-dark)] rounded border border-[var(--color-border)] font-mono overflow-x-auto">
                            {publicKey}
                        </p>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(publicKey);
                            }}
                            className="absolute top-2 right-2 p-1 text-[var(--color-text-light)] hover:text-[var(--color-main)] transition-colors"
                            title="Copy to clipboard"
                        >
                            <FiCopy size={14} />
                        </button>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={logoutbtn}
                    className="w-full mb-3 px-4 py-2 bg-[var(--color-error)] text-[var(--color-text-inverse)] rounded-md hover:bg-[var(--color-error)]/90 transition-colors flex items-center justify-center gap-2"
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
    );
};