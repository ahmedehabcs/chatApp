import { useState } from "react";
import { signUp } from "../api/auth.js";
import { FiUser, FiKey, FiLock, FiShield } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";
import { AnimatedBubbles } from "../components/AnimatedBg.jsx";
import { useNavigate } from "react-router-dom";
import KeysPopup from "../components/register/KeysPopup";

export default function Register() {
	const [error, setError] = useState(null);
	const [keys, setKeys] = useState(null);
	const [showPopup, setShowPopup] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSignUp = async (e) => {
		e.preventDefault();
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

	const handleClosePopup = () => {
		setShowPopup(false);
		navigate("/login");
	};

	return (
		<section className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4 relative overflow-hidden">
			<AnimatedBubbles />

			{/* Signup Form */}
			<div className={`bg-[var(--color-surface)] ${!showPopup ? "block" : "hidden"} rounded-2xl p-8 w-full max-w-md border border-[var(--color-border)] transition-all duration-500 relative z-10 shadow-2xl`}>
				<div className="flex flex-col items-center mb-8">
					<div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-main)] to-[var(--color-main-light)] flex items-center justify-center text-white mb-6">
						<FiUser size={40} />
					</div>
					<h1 className="text-3xl font-bold text-[var(--color-text)] mb-3 text-center">
						Secure Account Registration
					</h1>
					<p className="text-[var(--color-text-light)] text-center max-w-md">
						Join our platform with military-grade encryption to protect your data
					</p>
				</div>

				<button
					onClick={(e) => handleSignUp(e)}
					disabled={isLoading}
					className={`w-full py-4 rounded-xl bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main-light)] text-white font-semibold transition-all duration-300 flex items-center justify-center gap-3 text-lg group overflow-hidden relative`}
				>
					{isLoading ? (
						<>
							<ImSpinner8 className="animate-spin" size={20} />
							Generating Secure Keys...
						</>
					) : (
						<>
							<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
							<FiKey size={20} />
							Create Secure Account
						</>
					)}
				</button>

				{error && (
					<div className="mt-6 p-4 bg-[var(--color-error-bg)] rounded-xl border border-[var(--color-error)]/30 flex items-start gap-3">
						<div className="text-[var(--color-error)] mt-0.5">
							<FiLock size={20} />
						</div>
						<div>
							<p className="text-[var(--color-error)] font-medium">
								Registration Error
							</p>
							<p className="text-[var(--color-error)]/80 text-sm mt-1">
								{error}
							</p>
						</div>
					</div>
				)}

				<div className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
					<div className="flex items-center text-[var(--color-text-light)]">
						<FiShield className="mr-2 text-[var(--color-main)]" />
						<span className="text-sm">End-to-End Encryption</span>
					</div>
					<div className="text-sm text-[var(--color-text-light)]">
						<span className="font-medium">AhmedEhab Security</span>
					</div>
				</div>
			</div>

			{/* Keys Popup */}
			{showPopup && keys && (
				<KeysPopup
					keys={keys}
					onClose={handleClosePopup}
					publicKey={keys.publicKey}
					privateKey={keys.privateKey}
				/>
			)}
		</section>
	);
}