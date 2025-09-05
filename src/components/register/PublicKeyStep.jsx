import { FiKey, FiCopy, FiCheck, FiArrowRight } from "react-icons/fi";

const PublicKeyStep = ({ publicKey, copiedPublic, handleCopy, nextStep }) => {
    return (
        <div className="mb-8">
            <div className="bg-gradient-to-r from-[var(--color-info-bg)] to-[var(--color-info-bg)]/50 rounded-xl p-4 mb-6 border border-[var(--color-info)]/30">
                <div className="flex items-start gap-3">
                    <FiKey className="text-[var(--color-info)] mt-0.5 flex-shrink-0" size={20} />
                    <div>
                        <p className="font-semibold text-[var(--color-info)] mb-1">Public Key Instructions</p>
                        <p className="text-sm text-[var(--color-info)]/90">
                            This is your public identifier key. Copy it now as you'll need it to identify your account.
                            You can safely share this key with others.
                        </p>
                    </div>
                </div>
            </div>

            <div className={`bg-[var(--color-bg-dark)] rounded-xl p-5 border-2 ${copiedPublic ? "border-[var(--color-success)]" : "border-[var(--color-info)]"} transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-info)]/20 flex items-center justify-center">
                            <FiKey className="text-[var(--color-info)]" size={16} />
                        </div>
                        <span className="font-semibold text-[var(--color-text)]">Public Key</span>
                    </div>
                    <button
                        onClick={() => handleCopy("public", publicKey)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${copiedPublic ? "bg-[var(--color-success-bg)] text-[var(--color-success)]" : "bg-[var(--color-info)]/20 text-[var(--color-info)] hover:bg-[var(--color-info)]/30"}`}
                    >
                        {copiedPublic ? (
                            <>
                                <FiCheck size={14} />
                                Copied
                            </>
                        ) : (
                            <>
                                <FiCopy size={14} />
                                Copy
                            </>
                        )}
                    </button>
                </div>

                <div className="relative mb-3">
                    <input
                        type="text"
                        value={publicKey}
                        readOnly
                        className="w-full p-4 bg-[var(--color-bg)] rounded-lg text-[var(--color-text)] font-mono text-sm pr-12 truncate overflow-x-auto"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-xs text-[var(--color-text-light)] bg-[var(--color-bg-dark)] px-2 py-1 rounded">
                            {publicKey.length} chars
                        </span>
                    </div>
                </div>

                <p className="text-xs text-[var(--color-text-light)] flex items-start gap-2">
                    <FiKey size={12} className="mt-0.5 flex-shrink-0" />
                    Your public identifier - share this with others to receive encrypted messages
                </p>
            </div>

            <div className="flex justify-end mt-6">
                <button
                    onClick={nextStep}
                    disabled={!copiedPublic}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${copiedPublic ? "bg-[var(--color-info)] text-white hover:bg-[var(--color-info)]/90" : "bg-[var(--color-border)] text-[var(--color-text-light)] cursor-not-allowed"}`}
                >
                    Next <FiArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default PublicKeyStep;