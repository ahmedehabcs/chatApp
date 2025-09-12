import { FiCopy, FiCheck } from "react-icons/fi";

export default function KeyCard({ icon, iconColor, title, subtitle, label, keyValue, copied, onCopy, textColor }) {
    return (
        <article className="rounded-xl p-6 bg-[var(--color-surface)]/80 backdrop-blur border border-[var(--color-border)] hover:shadow-xl transition-transform hover:scale-[1.01]">
            <header className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${iconColor}/20`}>
                    {icon}
                </div>
                <div>
                    <h2 className="font-semibold text-[var(--color-text)]">{title}</h2>
                    <p className={`text-xs ${textColor}`}>{subtitle}</p>
                </div>
            </header>

            <div className="rounded-lg">
                <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs uppercase tracking-wide ${textColor}`}>{label}</span>
                    <button
                        onClick={onCopy}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition ${copied
                                ? "bg-[var(--color-success-bg)] text-[var(--color-success)]"
                                : `${iconColor}/20 ${textColor} hover:${iconColor}/30`
                            }`}
                    >
                        {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
                <div className="bg-[var(--color-bg)] rounded-lg p-3 mb-2">
                    <input type="text" value={keyValue} readOnly aria-label={title} className="w-full font-mono text-xs md:text-sm text-[var(--color-text)] bg-transparent outline-none break-all leading-relaxed" />
                </div>
            </div>
        </article>
    );
}