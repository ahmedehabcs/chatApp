import { useState } from "react";
import { signUp } from "../api/auth.js";
import { FiUser, FiKey, FiLock, FiShield } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";
import { AnimatedBubbles } from "../components/AnimatedBg.jsx";
import { useNavigate } from "react-router-dom";
import KeysPopup from "../components/KeysPopup"; // Import the new component

export default function Register() {
	const [error, setError] = useState(null);
	const [keys, setKeys] = useState({ publicKey: "sdsdds-ddfdf-dffddff-dffdfd", privateKey: "fsgrw-ewrerewr-ewrerewr-werwwe"});
	const [showPopup, setShowPopup] = useState(true);
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
		<section className="min-h-screen backdrop-blur-3xl bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden">
			<AnimatedBubbles />

			{/* Signup Form */}
			<div className={`bg-[var(--color-surface)] ${!showPopup ? "block" : "hidden"} shadow-lg rounded-2xl p-8 w-full max-w-md lg:max-w-lg xl:max-w-xl border border-[var(--color-border)] transition-all duration-300 hover:shadow-xl relative z-10 backdrop-blur-sm bg-opacity-90`}>
				<div className="flex justify-center mb-6">
					<div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[var(--color-main-bg)] flex items-center justify-center text-[var(--color-main)]">
						<FiUser size={36} className="lg:w-10 lg:h-10" />
					</div>
				</div>
				<h1 className="text-3xl lg:text-4xl font-bold text-[var(--color-text)] mb-2 text-center">
					Join Our Platform
				</h1>
				<p className="text-[var(--color-text-light)] mb-8 text-center text-lg lg:text-xl">
					Create your secure account in seconds
				</p>
				<button 
					onClick={(e) => handleSignUp(e)} 
					disabled={isLoading} 
					className={`w-full py-4 lg:py-5 rounded-xl bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main-light)] text-[var(--color-text-inverse)] font-semibold hover:from-[var(--color-main-hover)] hover:to-[var(--color-main)] transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 text-lg ${isLoading ? "opacity-80 cursor-not-allowed" : "" }`}
				>
					{isLoading ? (
						<>
							<ImSpinner8 className="animate-spin" size={20} /> Creating Account...
						</>
					) : (
						<>
							<FiKey size={20} /> Get Started Now
						</>
					)}
				</button>
				{error && (
					<div className="mt-4 p-3 bg-[var(--color-error-bg)] rounded-lg border border-[var(--color-error)]/30 flex items-center gap-2">
						<div className="text-[var(--color-error)]">
							<FiLock size={18} />
						</div>
						<p className="text-[var(--color-error)] font-medium text-sm lg:text-base">
							{error}
						</p>
					</div>
				)}
				<div className="mt-8 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
					<div className="flex items-center text-[var(--color-text-light)]">
						<FiShield className="mr-2 text-[var(--color-main)]" />
						<span className="text-sm">Powered by</span>
					</div>
					<div className="text-sm text-[var(--color-text-light)]">
						<span className="font-medium">AhmedEhab</span>
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