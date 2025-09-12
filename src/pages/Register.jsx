import { useState } from "react";
import { signUp } from "../api/auth.js";
import { FiUser, FiKey, FiShield } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";
import { AnimatedBubbles } from "../components/AnimatedBg.jsx";
import KeysDashboard from "../components/register/KeysDashboard.jsx";

export default function Register() {
	const [error, setError] = useState(null);
	const [keys, setKeys] = useState(null);
	const [showPopup, setShowPopup] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSignUp = async (e) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);
		try {
			const response = await signUp();
			setKeys(response.keys);
			localStorage.setItem("publicKey", response.keys.publicKey);
			setShowPopup(true);
		} catch (err) {
			setError(err?.response?.message || "Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="min-h-screen backdrop-blur-3xl bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden">
			<AnimatedBubbles />
			{!showPopup && !keys && (
				<div className="w-full max-w-lg relative z-10">
					<div className={`bg-[var(--color-surface)] rounded-2xl p-6 md:p-8 border border-[var(--color-border)] shadow-2xl transition-all duration-500 ${showPopup ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}>
						<div className="text-center mb-8">
							<div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[var(--color-main)] to-[var(--color-main-heavy)] mb-4 text-white">
								<FiUser className="w-8 h-8 md:w-10 md:h-10" />
							</div>
							<h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-2">
								Join Us Securely
							</h1>
							<p className="text-[var(--color-text-light)] text-sm md:text-base max-w-md mx-auto">
								Your data is protected with advanced encryption
							</p>
						</div>
						{error && (
							<div className="mb-6 p-4 bg-[var(--color-error-bg)] rounded-xl border border-[var(--color-error)]/30 flex items-start gap-3 animate-fadeIn">
								<div>
									<p className="text-[var(--color-error)]/80 text-xs md:text-sm mt-1 break-words whitespace-pre-wrap">
										{error}
									</p>
								</div>
							</div>
						)}
						<button onClick={handleSignUp} disabled={isLoading} className="w-full py-3 md:py-4 rounded-xl bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main-heavy)] text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 text-base md:text-lg hover:from-[var(--color-main-hover)] hover:to-[var(--color-main-heavy)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden">
							{isLoading ? (
								<>
									<ImSpinner8 className="animate-spin w-5 h-5 md:w-6 md:h-6" />
									<span>Creating account...</span>
								</>
							) : (
								<>
									<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
									<FiKey className="w-5 h-5 md:w-6 md:h-6" />
									<span>Create Account</span>
								</>
							)}
						</button>
						<div className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-row items-center justify-between gap-4 text-center sm:text-left">
							<div className="flex items-center justify-center sm:justify-start text-[var(--color-text-light)] text-sm">
								<FiShield className="mr-2 text-[var(--color-main)] w-4 h-4" />
								<span>Powered by</span>
							</div>
							<div className="text-[var(--color-text-light)] text-sm">
								<span className="font-medium">AhmedEhab</span>
							</div>
						</div>
					</div>
				</div>
			)}
			{/* Keys Popup */}
			{showPopup && keys && (
				<KeysDashboard keys={keys} setShowPopup={setShowPopup} publicKey={keys.publicKey} privateKey={keys.privateKey} />
			)}
		</section>
	);
}