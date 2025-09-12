export default function ActionCard({ title, description, buttonText, buttonIcon, onClick, bgClasses, textColor = "text-[var(--color-text)]", btnClasses }) {
    return (
        <article className={`rounded-xl p-6 ${bgClasses} hover:shadow-xl transition`}>
            <h3 className={`font-semibold ${textColor} mb-2`}>{title}</h3>
            <p className="text-sm text-[var(--color-text-light)] mb-4">{description}</p>
            <button onClick={onClick} className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition hover:shadow-lg hover:scale-[1.02] ${btnClasses}`}>
                {buttonIcon}
                {buttonText}
            </button>
        </article>
    );
}