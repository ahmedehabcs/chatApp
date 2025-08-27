export default function FriendRequestButton({ label, icon: Icon, count, isActive, onClick }) {
    return (
        <button onClick={onClick} className={`flex-1 py-3 text-sm md:text-base font-medium flex items-center justify-center gap-2 transition-colors duration-200${isActive ? 'text-[var(--color-main)] border-b-2 border-[var(--color-main)]' : 'text-[var(--color-text-light)] hover:text-[var(--color-main-light)]'}`}>
            <Icon className="text-lg" />
            <span>{label}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-surface)] text-[var(--color-main)]">
                {count}
            </span>
        </button>
    );
}