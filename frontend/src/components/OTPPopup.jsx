import React, { useState, useRef } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function OTPPopup({ onConfirm, onClose, email }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const inputsRef = useRef([]);

  const handleChange = (element, index) => {
    let val = element.value;

    // Allow empty string for clearing input
    if (val === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Only digits, take first if multiple pasted accidentally here
    val = val.replace(/\D/, "");
    if (!val) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Move focus to next input if not last
    if (index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault(); // prevent default so we can control behavior

      const newOtp = [...otp];

      if (newOtp[index] !== "") {
        // If current box has value, clear it
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous and clear that
        inputsRef.current[index - 1].focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasteData)) {
      setError("Please paste a valid 6-digit OTP");
      return;
    }

    const otpArray = pasteData.split("");
    setOtp(otpArray);

    // Focus last input
    inputsRef.current[5].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6 || otp.includes("")) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid OTP");
      }

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        onConfirm(enteredOtp);
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  if (success) {
    return (
      <div className="booking-popup-overlay">
        <div
          className="booking-popup-container"
          style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,       // override any padding
                margin: 0,        // override any margin
                width: "auto",    // shrink to fit content
                height: "auto",   // shrink to fit content
            }}
        >
          <DotLottieReact
            src="https://lottie.host/b2ac8be9-9d0b-4a15-9ee2-a0789d18c745/IIROLgaI8f.lottie"
            loop={false}
            autoplay
            speed={1.5}
            style={{ width: 350, height: 350 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="booking-popup-overlay">
      <div className="booking-popup-container">
        <button
          className="booking-popup-close-btn"
          onClick={onClose}
          aria-label="Close popup"
        >
          ×
        </button>
        <form onSubmit={handleSubmit} className="otp-form">
          <label className="results-title" htmlFor="otp-input-0">
            Enter the 6-digit OTP
          </label>
          <div className="otp-input-container" onPaste={handlePaste}>
            {otp.map((data, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="otp-input"
                autoComplete="one-time-code"
              />
            ))}
          </div>
          <button type="submit" className="book-button" disabled={loading}>
            {loading ? "Verifying..." : "Confirm Booking"}
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
