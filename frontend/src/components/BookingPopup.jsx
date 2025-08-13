import React, { useState } from "react";
import OTPPopup from "./OTPPopup"; // adjust path if needed

export default function BookingPopup({ onConfirm, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOtpPopup, setShowOtpPopup] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email) return;

    setLoading(true);
    try {
      const response = await fetch("/otp/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate OTP");
      }

      setLoading(false);
      setShowOtpPopup(true);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const handleClose = () => {
    setShowOtpPopup(false);
    setEmail("");
    setError(null);
    setLoading(false);
    onClose();
  };

  if (showOtpPopup) {
    // Pass email too if needed inside OTPPopup
    return <OTPPopup
      onConfirm={onConfirm}
      onClose={handleClose}
      email={email}  // pass email here
    />;
  }

  return (
    <div className="booking-popup-overlay">
      <div className="booking-popup-container">
        <button
          className="booking-popup-close-btn"
          onClick={handleClose}
          aria-label="Close popup"
        >
          ×
        </button>
        <form onSubmit={handleEmailSubmit}>
          <label htmlFor="email" className="results-title">
            Enter your email to receive OTP
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
          <button type="submit" className="book-button" disabled={loading}>
            {loading ? "Sending..." : "Receive OTP"}
          </button>
          {error && (
            <p style={{ color: "red", marginTop: "8px", fontWeight: "bold" }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
