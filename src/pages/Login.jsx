import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createChallenge, verifyChallenge } from "../api/auth";
import { FiLogIn, FiKey, FiAlertCircle } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";
import { AnimatedBubbles } from "../components/AnimatedBg.jsx";
import { signChallenge } from "../utils/signChallenge.js";
import { formatPublicKey } from "../utils/formatKeys.js";

export default function Login() {
	const prvKey = useRef(null);
	const pubKeyRef = useRef(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isFocusedPrivate, setIsFocusedPrivate] = useState(false);
	const [isFocusedPublic, setIsFocusedPublic] = useState(false);
	const [hasPubKey, setHasPubKey] = useState(!!window.localStorage.getItem("publicKey"));
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const privateKey = prvKey.current.value.trim();
		if (!privateKey) {
			setError("Please enter your private key");
			return;
		}

		let publicKey = (window.localStorage.getItem("publicKey") || "").trim();
		if (!publicKey) {
			publicKey = pubKeyRef.current.value.trim();
			if (!publicKey) return setError("Please enter your public key");
			publicKey = formatPublicKey(publicKey);
		}

		setIsLoading(true);
		setError("");

		try {
			const { challenge } = await createChallenge(publicKey);
			const signature = await signChallenge(privateKey, challenge);
			await verifyChallenge(publicKey, signature);
			window.localStorage.setItem("publicKey", publicKey);
			setHasPubKey(true);
			window.location.reload();
		} catch (err) {
			setError("Login failed. Please try again.");
			setHasPubKey(false);
			localStorage.removeItem("publicKey");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="min-h-screen grass-dark flex items-center justify-center p-4 relative overflow-hidden">
			<AnimatedBubbles />
			<div className="bg-[var(--color-surface)] rounded-2xl shadow-xl p-8 w-full max-w-md border border-[var(--color-border)] relative z-10 backdrop-blur-sm bg-opacity-90">
				<div className="flex flex-col items-center mb-8">
					<div className="w-16 h-16 rounded-full bg-[var(--color-main-bg)] flex items-center justify-center text-[var(--color-main)] mb-4">
						<FiKey size={28} />
					</div>
					<h1 className="text-2xl font-bold text-[var(--color-text)]">Welcome Back</h1>
					<p className="text-[var(--color-text-light)] mt-1">Enter your credentials to continue</p>
				</div>

				{error && (
					<div className="mb-4 p-3 bg-[var(--color-error-bg)] rounded-lg flex items-center gap-2 animate-fade-in">
						<FiAlertCircle className="text-[var(--color-error)]" size={18} />
						<p className="text-sm text-[var(--color-error)]">{error}</p>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					{!hasPubKey && (
						<div className="group">
							<div className="relative">
								<input
									ref={pubKeyRef}
									type="text"
									onFocus={() => setIsFocusedPublic(true)}
									onBlur={() => setIsFocusedPublic(false)}
									placeholder=" "
									className="w-full px-4 py-3 text-white rounded-xl text-sm border-0 ring-1 ring-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-main)] focus:outline-none transition-all peer"
								/>
								<label
									className={`absolute left-4 transition-all duration-200 pointer-events-none ${isFocusedPublic || pubKeyRef.current?.value
											? "hidden"
											: "top-3.5 text-sm text-[var(--color-text-light)]"
										} peer-focus:top-1 peer-focus:text-xs peer-focus:text-[var(--color-main)]`}
								>
									Public Key
								</label>
							</div>
						</div>
					)}

					<div className="group">
						<div className="relative">
							<input
								ref={prvKey}
								type="text"
								onFocus={() => { setIsFocusedPrivate(true); setError(""); }}
								onBlur={() => setIsFocusedPrivate(false)}
								placeholder=" "
								className="w-full px-4 py-3 text-white rounded-xl text-sm border-0 ring-1 ring-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-main)] focus:outline-none transition-all peer"
							/>
							<label
								className={`absolute left-4 transition-all duration-200 pointer-events-none ${isFocusedPrivate || prvKey.current?.value
										? "hidden"
										: "top-3.5 text-sm text-[var(--color-text-light)]"
									} peer-focus:top-1 peer-focus:text-xs peer-focus:text-[var(--color-main)]`}
							>
								Private Key
							</label>
						</div>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main-light)] text-white font-medium flex items-center justify-center gap-2 transition-all hover:from-[var(--color-main-hover)] hover:to-[var(--color-main)] ${isLoading ? "opacity-80 cursor-not-allowed" : "hover:shadow-md"
							}`}
					>
						{isLoading ? (
							<>
								<ImSpinner8 className="animate-spin" size={18} />
								Verifying...
							</>
						) : (
							<>
								<FiLogIn size={18} />
								Continue
							</>
						)}
					</button>
				</form>

				<div className="mt-6 pt-4 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-text-light)]">
					<p>
						Don't have an account?{" "}
						<button
							onClick={() => navigate("/register")}
							className="text-[var(--color-main)] hover:underline transition-colors"
						>
							Register
						</button>
					</p>
				</div>
			</div>
		</section>
	);
}