import { useState, useEffect } from "react";
import { FiX, FiShield } from "react-icons/fi";
import ProgressIndicator from "./ProgressIndicator";
import PublicKeyStep from "./PublicKeyStep";
import PrivateKeyStep from "./PrivateKeyStep";
import CompletionStep from "./CompletionStep";

const KeysPopup = ({ onClose, publicKey, privateKey }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedPrivate, setCopiedPrivate] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    if (copiedPublic && copiedPrivate) {
      setCanProceed(true);
    }
  }, [copiedPublic, copiedPrivate]);

  const handleCopy = (keyType, keyValue) => {
    navigator.clipboard.writeText(keyValue);

    if (keyType === "public") {
      setCopiedPublic(true);
      setTimeout(() => setCopiedPublic(false), 3000);
    } else {
      setCopiedPrivate(true);
      setTimeout(() => setCopiedPrivate(false), 3000);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { id: 1, title: "Public Key", completed: copiedPublic },
    { id: 2, title: "Private Key", completed: copiedPrivate },
    { id: 3, title: "Complete", completed: canProceed }
  ];

  return (
    <div className="flex items-center justify-center z-50 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[var(--color-surface)] rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-[var(--color-border)] relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors p-1 rounded-full hover:bg-[var(--color-border)]"
          disabled={!canProceed}
        >
          <FiX size={24} />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-main)] to-[var(--color-main-light)] flex items-center justify-center text-white mb-5">
            <FiShield size={32} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] text-center mb-2">
            Your Security Keys
          </h2>
          <p className="text-[var(--color-text-light)] text-center max-w-md">
            Copy both keys securely before proceeding. This is your only chance to save them.
          </p>
        </div>

        <ProgressIndicator steps={steps} currentStep={currentStep} />

        {currentStep === 1 && (
          <PublicKeyStep
            publicKey={publicKey}
            copiedPublic={copiedPublic}
            handleCopy={handleCopy}
            nextStep={nextStep}
          />
        )}

        {currentStep === 2 && (
          <PrivateKeyStep
            privateKey={privateKey}
            copiedPrivate={copiedPrivate}
            handleCopy={handleCopy}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {currentStep === 3 && (
          <CompletionStep
            onClose={onClose}
            prevStep={prevStep}
          />
        )}
      </div>
    </div>
  );
};

export default KeysPopup;