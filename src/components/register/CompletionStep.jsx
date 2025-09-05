import { FiCheck, FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

const CompletionStep = ({ onClose, prevStep }) => {
    return (
        <div className="mb-8">
            <div className="bg-gradient-to-r from-[var(--color-success-bg)] to-[var(--color-success-bg)]/50 rounded-xl p-4 mb-6 border border-[var(--color-success)]/30">
                <div className="flex items-start gap-3">
                    <FiCheck className="text-[var(--color-success)] mt-0.5 flex-shrink-0" size={20} />
                    <div>
                        <p className="font-semibold text-[var(--color-success)] mb-1">Keys Secured Successfully</p>
                        <p className="text-sm text-[var(--color-success)]/90">
                            You've successfully copied both security keys. Make sure you've stored them in a secure location.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-[var(--color-warning-bg)] to-[var(--color-warning-bg)]/50 rounded-xl p-4 mb-8 border border-[var(--color-warning)]/30">
                <div className="flex items-start gap-3">
                    <FiAlertTriangle className="text-[var(--color-warning)] mt-0.5 flex-shrink-0" size={20} />
                    <div>
                        <p className="font-semibold text-[var(--color-warning)] mb-1">Final Security Check</p>
                        <p className="text-sm text-[var(--color-warning)]/90">
                            These keys cannot be recovered if lost. Have you stored both keys in a secure password manager or offline location?
                            We have no access to your private key and cannot restore your account if you lose it.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all bg-[var(--color-border)] text-[var(--color-text-light)] hover:bg-[var(--color-border)]/80"
                >
                    <FiArrowLeft size={16} /> Review Keys
                </button>
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main-light)] text-white hover:shadow-lg"
                >
                    Complete<FiCheck size={16} />
                </button>
            </div>
        </div>
    );
};

export default CompletionStep;