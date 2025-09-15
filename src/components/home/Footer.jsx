import { FiLock } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="py-10 border-t border-[var(--color-border)]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-[var(--color-main)] rounded-full p-2 mr-2">
              <FiLock className="text-[var(--color-text-inverse)]" size={18} aria-hidden />
            </div>
            <span className="font-bold text-xl text-[var(--color-text)]">AhmedEhab</span>
          </div>
          <small className="text-[var(--color-text-light)] text-sm">
            © {new Date().getFullYear()} AhmedEhab. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
}