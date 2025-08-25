import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../api/auth";
import { FiLogIn, FiKey, FiAlertCircle } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";
import { AnimatedBubbles } from "../components/AnimatedBg.jsx";

export default function Login() {
	const prvKey = useRef(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		let key = prvKey.current.value.replace(/\s+/g, "");

		if (!key) {
			setError("Please enter your private key");
			return;
		}
		setIsLoading(true);
		setError("");
		try {
			await signIn(key);
			window.location.reload();
			// navigate("/dashboard", { replace: true });
		} catch (err) {
			setError(
				err?.response?.message || "Invalid private key. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className="min-h-screen backdrop-blur-3xl bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden">
			<AnimatedBubbles />

			<div className="bg-[var(--color-surface)] rounded-2xl shadow-xl p-8 w-full max-w-md border border-[var(--color-border)] relative z-10 backdrop-blur-sm bg-opacity-90">
				<div className="flex flex-col items-center mb-8">
					<div className="w-16 h-16 rounded-full bg-[var(--color-main-bg)] flex items-center justify-center text-[var(--color-main)] mb-4">
						<FiKey size={28} />
					</div>
					<h1 className="text-2xl font-bold text-[var(--color-text)]">
						Welcome Back
					</h1>
					<p className="text-[var(--color-text-light)] mt-1">
						Enter your private key to continue
					</p>
				</div>

				{error && (
					<div className="mb-4 p-3 bg-[var(--color-error-bg)] rounded-lg flex items-center gap-2 animate-fade-in">
						<FiAlertCircle className="text-[var(--color-error)]" size={18} />
						<p className="text-sm text-[var(--color-error)]">{error}</p>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="group">
						<div className="relative">
							<input
								ref={prvKey}
								type="text"
								onFocus={() => {
									setIsFocused(true);
									setError("");
								}}
								onBlur={() => setIsFocused(false)}
								placeholder=" "
								className="w-full px-4 py-3 text-white rounded-xl text-sm border-0 ring-1 ring-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-main)] focus:outline-none transition-all peer"
							/>
							<label
								className={`absolute left-4 transition-all duration-200 pointer-events-none ${
									isFocused || prvKey.current?.value
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
						className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--color-main)] to-[var(--color-main-light)] text-white font-medium flex items-center justify-center gap-2 transition-all hover:from-[var(--color-main-hover)] hover:to-[var(--color-main)] ${
							isLoading ? "opacity-80 cursor-not-allowed" : "hover:shadow-md"
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