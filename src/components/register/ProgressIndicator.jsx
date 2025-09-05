import { FiCheck } from "react-icons/fi";

const ProgressIndicator = ({ steps, currentStep }) => {
    return (
        <div className="flex justify-between items-center mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[var(--color-border)] -translate-y-1/2 z-0"></div>
            {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step.completed
                            ? "bg-[var(--color-success)] border-[var(--color-success)] text-white"
                            : currentStep === step.id
                                ? "border-[var(--color-main)] bg-[var(--color-main)] text-white"
                                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-light)]"
                        }`}>
                        {step.completed ? <FiCheck size={18} /> : step.id}
                    </div>
                    <span className="text-xs mt-2 text-[var(--color-text-light)]">{step.title}</span>
                </div>
            ))}
        </div>
    );
};

export default ProgressIndicator;