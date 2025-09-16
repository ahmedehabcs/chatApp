import { useState, useRef, useEffect } from "react";
import { FiKey, FiCamera } from "react-icons/fi";
import { BrowserQRCodeReader } from "@zxing/browser";
import URL from "../../URL";

export default function FriendInput({ handleInputChange, handleKeyPress, publicKey, setPublicKey }) {
    const [scanning, setScanning] = useState(false);
    const videoRef = useRef(null);
    const codeReaderRef = useRef(null);
    const streamRef = useRef(null);
    const decodeIntervalRef = useRef(null);

    useEffect(() => {
        if (scanning) {
            const codeReader = new BrowserQRCodeReader();
            codeReaderRef.current = codeReader;

            navigator.mediaDevices
                .getUserMedia({ video: { facingMode: "environment" } })
                .then((stream) => {
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }

                    // Use decodeFromVideoElement instead of decodeFromVideoDevice
                    decodeIntervalRef.current = codeReader.decodeFromVideoElement(
                        videoRef.current,
                        (result, err) => {
                            if (result) {
                                const fullText = result.getText();
                                const allowedDomain = `${URL}/`;

                                // Check if scanned QR starts with our domain
                                if (!fullText.startsWith(allowedDomain)) {
                                    alert("Invalid QR code. Please scan a valid app QR.");
                                    stopScanning(); // cleanup + close camera
                                    return; // don't continue
                                }

                                // ✅ Extract last segment safely
                                const lastSegment = fullText.substring(fullText.lastIndexOf("/") + 1);

                                if (!lastSegment) {
                                    alert("QR code is invalid or empty.");
                                    stopScanning();
                                    return;
                                }

                                // ✅ Update input with only the public key
                                setPublicKey(lastSegment);
                                setScanning(false);
                            }
                        }
                    );

                })
                .catch((err) => {
                    console.error("Camera error:", err);
                    setScanning(false);
                });
        }

        return () => {
            // Clean up function
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }

            // Clear any ongoing decoding
            if (decodeIntervalRef.current) {
                clearTimeout(decodeIntervalRef.current);
                decodeIntervalRef.current = null;
            }

            // Reset codeReader reference
            codeReaderRef.current = null;
        };
    }, [scanning, setPublicKey]);

    const stopScanning = () => {
        setScanning(false);

        // Clean up immediately when user closes the scanner
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        if (decodeIntervalRef.current) {
            clearTimeout(decodeIntervalRef.current);
            decodeIntervalRef.current = null;
        }

        codeReaderRef.current = null;
    };

    return (
        <div className="relative">
            {/* Key icon */}
            <FiKey
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]"
                size={16}
            />

            {/* Input field */}
            <input
                type="text"
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                value={publicKey}
                placeholder="Enter friend's public key"
                className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 text-sm sm:text-base
          bg-[var(--color-bg-dark)] border border-[var(--color-border)] rounded-lg sm:rounded-xl 
          text-[var(--color-text)] placeholder-[var(--color-text-light)] 
          focus:outline-none focus:ring-2 focus:ring-[var(--color-main)]/50 
          focus:border-[var(--color-main)] transition-all"
            />

            {/* Camera icon */}
            <button
                type="button"
                onClick={() => setScanning(true)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-main)] hover:text-[var(--color-main-hover)]"
            >
                <FiCamera size={18} />
            </button>

            {/* Camera + Scanner Modal */}
            {scanning && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-[var(--color-surface)] p-4 rounded-xl shadow-lg relative">
                        <button
                            onClick={stopScanning}
                            className="absolute top-2 right-2 text-[var(--color-text-light)] hover:text-white"
                        >
                            ✕
                        </button>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="rounded-lg w-[300px] h-[220px] bg-black"
                        />
                        <p className="text-center text-sm mt-2 text-[var(--color-text-light)]">
                            Point your camera at a QR code
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}