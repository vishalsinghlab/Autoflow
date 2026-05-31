"use client";

import axiosInstance from "@/lib/axiosInstance";
import { setUsersList, setUser } from "@/store/userSlice";
import { HttpStatusCode } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { X, ArrowRight, CheckCircle } from "lucide-react";

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 text-[#FFC043] inline-block"
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
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

const BlinkingCursor = () => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setIsVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);
  return (
    <span
      className={`${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-100`}
    >
      _
    </span>
  );
};

export default function LoginModal({ showModal, onClose, onSignUpClick }) {
  const dispatch = useDispatch();

  // State
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [focusedField, setFocusedField] = useState(null);

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
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000,
      );
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
        setResendCooldown(0);
        setFocusedField(null);
      }, 300);
      return () => clearTimeout(resetTimer);
    }
  }, [showModal]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  // Send OTP handler
  const handleSendOtp = useCallback(
    async (e) => {
      e.preventDefault();

      if (!email) {
        toast.error("Please enter your email address");
        emailInputRef.current?.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        emailInputRef.current?.focus();
        return;
      }

      setLoading(true);

      try {
        const response = await axiosInstance.post("/auth/send-otp", { email });

        if (response.status === HttpStatusCode.Ok && response.data.success) {
          toast.success(response.data.message || "OTP sent successfully!");
          setOtpSent(true);
          setResendCooldown(60);
          setTimeout(() => otpInputRef.current?.focus(), 100);
        } else {
          toast.error(response.data.message || "Failed to send OTP");
        }
      } catch (error) {
        console.error("Send OTP error:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to send OTP. Please try again.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [email],
  );

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
      toast.error(error.response?.data?.error || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }, [email, resendCooldown]);

  // Verify OTP handler
  const handleVerifyOtp = useCallback(
    async (e) => {
      e.preventDefault();

      if (!otp || otp.length !== 6) {
        toast.error("Please enter a valid 6-digit OTP");
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
          dispatch(
            setUser({
              email: userEmail,
              role,
              username,
              isLoggedIn: true,
            }),
          );

          // Fetch users list
          try {
            const usersResponse = await axiosInstance.get("/auth/all-users");
            if (usersResponse.data.users) {
              dispatch(setUsersList(usersResponse.data.users));
            }
          } catch (error) {
            console.error("Failed to fetch users:", error);
          }

          onClose();
        } else {
          toast.error(response.data.message || "Invalid OTP");
        }
      } catch (error) {
        console.error("Verify OTP error:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to verify OTP";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [otp, email, dispatch, onClose],
  );

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#11181C]/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: [0.2, 0.9, 0.4, 1.1],
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border border-[#E6E8EA] shadow-xl"
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 8,
            }}
            transition={{
              duration: 0.2,
              ease: [0.2, 0.9, 0.4, 1.1],
            }}
          >
            {/* Header */}
            <div className="relative px-8 pt-8 pb-6 border-b border-[#E6E8EA]">
              <button
                onClick={onClose}
                disabled={loading}
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center text-[#687076] hover:text-[#11181C] transition-colors duration-150"
              >
                <X size={16} />
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-4 border border-[#E6E8EA]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
                AUTHENTICATION
              </div>

              <h2 className="text-3xl font-bold tracking-tighter text-[#11181C]">
                sign_in
              </h2>

              <p className="mt-2 text-sm text-[#687076] font-mono">
                Access your workflows, campaigns and enriched data.
              </p>
            </div>

            {/* Form */}
            <div className="px-8 pb-8 pt-6">
              <form className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                    EMAIL ADDRESS
                  </label>
                  <input
                    ref={emailInputRef}
                    type="email"
                    placeholder="user@company.com"
                    value={email}
                    disabled={otpSent || loading}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`
                      w-full px-4 py-3 bg-white border font-mono text-sm outline-none transition-all duration-150
                      ${
                        focusedField === "email"
                          ? "border-[#FFC043] ring-1 ring-[#FFC043]/20"
                          : "border-[#E6E8EA] hover:border-[#1E2A3A]"
                      }
                      ${otpSent || loading ? "bg-[#F8F9FA] text-[#687076] cursor-not-allowed" : ""}
                    `}
                  />
                </div>

                {/* OTP Field - Animated */}
                <AnimatePresence>
                  {otpSent && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                        marginTop: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        marginTop: 16,
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        marginTop: 0,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: [0.2, 0.9, 0.4, 1.1],
                      }}
                    >
                      <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                        VERIFICATION CODE
                      </label>
                      <input
                        ref={otpInputRef}
                        type="text"
                        value={otp}
                        maxLength={6}
                        placeholder="000000"
                        onFocus={() => setFocusedField("otp")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                        className={`
                          w-full px-4 py-3 bg-white border font-mono text-center text-lg tracking-[0.3em] outline-none transition-all duration-150
                          ${
                            focusedField === "otp"
                              ? "border-[#FFC043] ring-1 ring-[#FFC043]/20"
                              : "border-[#E6E8EA] hover:border-[#1E2A3A]"
                          }
                        `}
                      />
                      <div className="mt-2 flex items-center gap-2 text-xs font-mono text-[#687076]">
                        <CheckCircle className="w-3 h-3 text-[#FFC043]" />
                        <span>Code sent to {email}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="
                      group relative w-full mt-6 px-6 py-3 bg-[#11181C] text-white font-mono text-sm
                      hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#11181C] disabled:hover:text-white
                      flex items-center justify-center gap-2
                    "
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Spinner />
                        sending...
                      </span>
                    ) : (
                      <>
                        <span>autoflow.send_otp()</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3 mt-6">
                    <button
                      type="submit"
                      onClick={handleVerifyOtp}
                      disabled={loading || !otp || otp.length !== 6}
                      className="
                        w-full px-6 py-3 bg-[#11181C] text-white font-mono text-sm
                        hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#11181C] disabled:hover:text-white
                        flex items-center justify-center gap-2
                      "
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Spinner />
                          verifying...
                        </span>
                      ) : (
                        <>
                          <span>autoflow.verify()</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={resendCooldown > 0 || loading}
                      onClick={handleResendOtp}
                      className="
                        w-full px-6 py-3 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-sm
                        hover:border-[#1E2A3A] hover:text-[#11181C] transition-all duration-150
                        disabled:opacity-50 disabled:cursor-not-allowed
                      "
                    >
                      {resendCooldown > 0
                        ? `resend in ${resendCooldown}s`
                        : "autoflow.resend()"}
                    </button>
                  </div>
                )}
              </form>

              {/* Footer - Sign Up Link */}
              <div className="mt-8 pt-6 border-t border-[#E6E8EA] text-center">
                <p className="text-xs font-mono text-[#687076] mb-2">
                  NO ACCOUNT YET?
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onSignUpClick();
                  }}
                  className="
                    group text-sm font-mono text-[#1E2A3A] hover:text-[#FFC043] transition-colors duration-150
                    flex items-center justify-center gap-1 mx-auto
                  "
                >
                  <span>autoflow.signup()</span>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                    →
                  </span>
                </button>
              </div>
            </div>

            {/* Command line decoration */}
            <div className="px-8 pb-6 pt-2 border-t border-[#F8F9FA] bg-[#F8F9FA]">
              <div className="flex items-center gap-2 font-mono text-xs text-[#687076]">
                <span className="text-[#FFC043]">$</span>
                <span>autoflow --version</span>
                <BlinkingCursor />
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#687076] mt-1 pl-3">
                <span>→ v2.0.0 / ready</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
