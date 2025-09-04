import { useState, useEffect } from "react";
import { FiCopy, FiCheck, FiShield, FiAlertTriangle, FiKey, FiLock } from "react-icons/fi";

const KeysPopup = ({ 
  onClose, 
  publicKey, 
  privateKey 
}) => {
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedPrivate, setCopiedPrivate] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    // Check if both keys have been copied
    if (copiedPublic && copiedPrivate) {
      setCanProceed(true);
    }
  }, [copiedPublic, copiedPrivate]);

  const handleCopy = (keyType, keyValue) => {
    navigator.clipboard.writeText(keyValue);
    
    if (keyType === "public") {
      setCopiedPublic(true);
    } else {
      setCopiedPrivate(true);
    }
    
    // Reset copied status after 3 seconds
    setTimeout(() => {
      if (keyType === "public") {
        setCopiedPublic(false);
      } else {
        setCopiedPrivate(false);
      }
    }, 3000);
  };

  return (
    <div className="flex items-center justify-center z-50 p-4 animate-fade-in bg-[#000000]/70 backdrop-blur-sm">
      <div className="bg-[var(--color-surface)] rounded-xl shadow-xl p-6 w-full max-w-md border border-[var(--color-border)] relative">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[var(--color-main-bg)] flex items-center justify-center text-[var(--color-main)] mb-3">
            <FiShield size={28} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] text-center">
            Secure Your Access Keys
          </h2>
          <p className="text-[var(--color-text-light)] text-sm mt-2 text-center">
            Copy both keys before proceeding - this is your only chance to save them!
          </p>
        </div>

        <div className="bg-[var(--color-main-bg)] rounded-lg p-3 mb-6">
          <p className="text-sm font-medium text-[var(--color-main)] flex items-start gap-3">
            <FiKey size={18} className="mt-0.5 flex-shrink-0" />
            <span>
              <strong>Login Instructions:</strong> You'll need both keys to access your account. 
              Save them in a password manager or secure location.
            </span>
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {/* Public Key */}
          <div className="group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-light)]">
                Public Key
              </span>
              <button 
                onClick={() => handleCopy("public", publicKey)} 
                className="text-xs flex items-center gap-1 text-[var(--color-main)] hover:text-[var(--color-main-hover)] transition-colors"
              >
                {copiedPublic ? (
                  <>
                    <FiCheck className="text-[var(--color-success)]" size={14} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <FiCopy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div 
              onClick={() => handleCopy("public", publicKey)} 
              className="w-full p-4 bg-[var(--color-bg)] rounded-xl text-sm font-mono cursor-pointer transition-all relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--color-main-bg)]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <input type="text" value={publicKey} readOnly className="relative break-all pr-6 text-[var(--color-main)] font-medium overflow-x-auto" />
            </div>
            <p className="text-xs text-[var(--color-text-light)] mt-2">
              <FiKey size={12} className="inline mr-1" />
              Your public key identifies your account - share this freely
            </p>
          </div>

          {/* Private Key */}
          <div className="group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-light)]">
                Private Key
              </span>
              <button 
                onClick={() => handleCopy("private", privateKey)} 
                className="text-xs flex items-center gap-1 text-[var(--color-main)] hover:text-[var(--color-main-hover)] transition-colors"
              >
                {copiedPrivate ? (
                  <>
                    <FiCheck className="text-[var(--color-success)]" size={14} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <FiCopy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div 
              onClick={() => handleCopy("private", privateKey)} 
              className="w-full p-4 bg-[var(--color-bg)] rounded-xl text-sm font-mono cursor-pointer transition-all relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--color-main-bg)]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <input type="text" value={privateKey} readOnly className="relative break-all pr-6 text-[var(--color-main)] font-medium overflow-x-auto" />
            </div>
            <p className="text-xs text-[var(--color-text-light)] mt-2">
              <FiLock size={12} className="inline mr-1" />
              Your private key proves your identity - never share this with anyone
            </p>
          </div>
        </div>

        <div className="bg-[var(--color-warning-bg)] rounded-lg p-3 mb-6">
          <p className="text-sm font-medium text-[var(--color-warning)] flex items-start gap-3">
            <FiAlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
            <span>
              <strong>Critical Security Notice:</strong> These keys are your only way to access your account. 
              Store them securely offline. We cannot recover them if lost. Never share your private key with anyone.
            </span>
          </p>
        </div>

        <button 
          onClick={onClose} 
          disabled={!canProceed}
          className={`w-full py-3 rounded-lg transition-all font-medium flex items-center justify-center gap-2
            ${canProceed 
              ? "bg-[var(--color-main)] text-[var(--color-text-inverse)] hover:bg-[var(--color-main-hover)] cursor-pointer" 
              : "bg-[var(--color-border)] text-[var(--color-text-light)] cursor-not-allowed"
            }`}
        >
          <FiCheck size={18} /> 
          {canProceed ? "I've saved both keys securely" : "Copy both keys to continue"}
        </button>
      </div>
    </div>
  );
};

export default KeysPopup;