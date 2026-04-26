"use client";

import axiosInstance from "@/lib/axiosInstance";
import { setUsersList, setUser } from "@/store/userSlice";
import { HttpStatusCode } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";



// Constants
const INPUT_STYLES = "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed";
const BUTTON_STYLES = "w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

export default function LoginModal({ showModal, onClose, onSignUpClick }) {
  const dispatch = useDispatch();
  
  // State
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Refs
  const emailInputRef = useRef(null);
  const otpInputRef = useRef(null);

  // Auto-focus email input when modal opens
  useEffect(() => {
    if (showModal && emailInputRef.current) {
      setTimeout(() => emailInputRef.current?.focus(), 100);
    }
  }, [showModal]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Reset form when modal closes
  useEffect(() => {
    if (!showModal) {
      const resetTimer = setTimeout(() => {
        setEmail("");
        setOtp("");
        setOtpSent(false);
        setEmailError("");
        setOtpError("");
        setResendCooldown(0);
      }, 300);
      return () => clearTimeout(resetTimer);
    }
  }, [showModal]);

  // Validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

 const validateOtp = (otp) => {
  // Check if OTP is 6 characters of letters/numbers
  const alphanumericRegex = /^[A-Za-z0-9]{6}$/;
  if (!otp) {
    setOtpError("OTP is required");
    return false;
  }
  if (!alphanumericRegex.test(otp)) {
    setOtpError("OTP must be 6 alphanumeric characters");
    return false;
  }
  setOtpError("");
  return true;
};

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  // Send OTP handler
  const handleSendOtp = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      emailInputRef.current?.focus();
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/send-otp", { email });

      if (response.status === HttpStatusCode.Ok && response.data.success) {
        toast.success(response.data.message || "OTP sent successfully!");
        setOtpSent(true);
        setResendCooldown(60); // 60 seconds cooldown
        setTimeout(() => otpInputRef.current?.focus(), 100);
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
      setEmailError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [email]);

  // Resend OTP handler
  const handleResendOtp = useCallback(async () => {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    
    try {
      const response = await axiosInstance.post("/auth/send-otp", { email });
      
      if (response.status === HttpStatusCode.Ok && response.data.success) {
        toast.success("OTP resent successfully!");
        setResendCooldown(60);
      } else {
        toast.error(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }, [email, resendCooldown]);

  // Verify OTP handler
  const handleVerifyOtp = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateOtp(otp)) {
      otpInputRef.current?.focus();
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/verify-otp", {
        otp,
        email,
      });

      if (response.status === HttpStatusCode.Ok && response.data.success) {
        const { token, username, email: userEmail, role } = response.data;
        
        toast.success("Logged in successfully!");
        
        // Store auth data
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("email", userEmail);
        localStorage.setItem("role", role);
        
        // Update Redux state
        dispatch(setUser({ 
          email: userEmail, 
          role, 
          username, 
          isLoggedIn: true 
        }));
        
        // Fetch users list
        try {
          const usersResponse = await axiosInstance.get("/auth/all-users");
          dispatch(setUsersList(usersResponse.data.users));
        } catch (error) {
          console.error("Failed to fetch users:", error);
        }
        
        onClose();
      } else {
        toast.error(response.data.message || "Invalid OTP");
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to verify OTP";
      toast.error(errorMessage);
      setOtpError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [otp, email, dispatch, onClose]);

  // Handle email change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  // Handle OTP change
  const handleOtpChange = (e) => {
  // Allow alphanumeric characters (A-Z, a-z, 0-9)
  const value = e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 6);    setOtp(value);
    if (otpError) setOtpError("");
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              disabled={loading}
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-purple-700 mb-2">
                Welcome Back
              </h3>
              <p className="text-gray-600 text-sm">
                {otpSent 
                  ? `Enter the 6-digit code sent to ${email}`
                  : "Sign in to continue to your account"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
              {/* Email input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  ref={emailInputRef}
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  className={`${INPUT_STYLES} ${emailError ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                  required
                  disabled={otpSent || loading}
                  autoComplete="email"
                />
                {emailError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {emailError}
                  </motion.p>
                )}
              </div>

              {/* OTP input */}
              {otpSent && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Code
                  </label>
                  <input
                    ref={otpInputRef}
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={handleOtpChange}
                    className={`${INPUT_STYLES} ${otpError ? "border-red-500 focus:ring-red-500" : "border-gray-300"} text-center text-2xl tracking-widest`}
                    required
                    disabled={loading}
                    autoComplete="off"
                    maxLength={6}
                  />
                  {otpError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {otpError}
                    </motion.p>
                  )}
                  
                  {/* Resend OTP button */}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || loading}
                    className="text-sm text-purple-600 hover:text-purple-700 mt-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {resendCooldown > 0 
                      ? `Resend code in ${resendCooldown}s`
                      : "Resend code"}
                  </button>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className={BUTTON_STYLES}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span>{otpSent ? "Verifying..." : "Sending..."}</span>
                  </>
                ) : (
                  <span>{otpSent ? "Verify & Login" : "Continue with Email"}</span>
                )}
              </button>
            </form>

            {/* Divider */}
            {!otpSent && (
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New here?</span>
                </div>
              </div>
            )}

            {/* Sign up link */}
            <div className="text-center">
              <button
                onClick={() => {
                  onClose();
                  onSignUpClick();
                }}
                className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
                disabled={loading}
              >
                {otpSent ? "Use different email" : "Create an account"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}