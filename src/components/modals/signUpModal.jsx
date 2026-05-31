"use client";
import axiosInstance from "@/lib/axiosInstance";
import { HttpStatusCode } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setUser } from "../../store/userSlice";
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
    ></path>
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

export default function SignUpModal({ showModal, onClose, onLoginClick }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loadingSendOtp, setLoadingSendOtp] = useState(false);
  const [loadingVerifyOtp, setLoadingVerifyOtp] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const usernameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const otpInputRef = useRef(null);

  const dispatch = useDispatch();

  // Auto-focus first field when modal opens
  useEffect(() => {
    if (showModal && usernameInputRef.current) {
      setTimeout(() => usernameInputRef.current?.focus(), 100);
    }
  }, [showModal]);

  // Reset form when modal closes
  useEffect(() => {
    if (!showModal) {
      const resetTimer = setTimeout(() => {
        setUsername("");
        setEmail("");
        setOtp("");
        setOtpSent(false);
        setLoadingSendOtp(false);
        setLoadingVerifyOtp(false);
        setFocusedField(null);
      }, 300);
      return () => clearTimeout(resetTimer);
    }
  }, [showModal]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loadingSendOtp && !loadingVerifyOtp) {
      onClose();
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!username) {
      toast.error("Please enter a username");
      usernameInputRef.current?.focus();
      return;
    }

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

    setLoadingSendOtp(true);
    try {
      const response = await axiosInstance.post("/auth/send-otp", {
        username,
        email,
      });

      if (response.status === HttpStatusCode.Ok && response.data.success) {
        toast.success(response.data.message);
        setOtpSent(true);
        setTimeout(() => otpInputRef.current?.focus(), 100);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoadingSendOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      otpInputRef.current?.focus();
      return;
    }

    setLoadingVerifyOtp(true);
    try {
      const response = await axiosInstance.post("/auth/verify-otp", {
        otp,
        email,
        username,
      });

      if (response.status === HttpStatusCode.Ok && response.data.success) {
        const { token, role } = response.data;
        localStorage?.setItem("token", token);
        localStorage?.setItem("username", username);
        localStorage?.setItem("email", email);
        localStorage?.setItem("role", role);
        dispatch(setUser({ email, role, username, isLoggedIn: true }));
        toast.success("Account created successfully!");
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Failed to verify OTP");
    } finally {
      setLoadingVerifyOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (loadingSendOtp) return;

    setLoadingSendOtp(true);
    try {
      const response = await axiosInstance.post("/auth/send-otp", {
        username,
        email,
      });

      if (response.status === HttpStatusCode.Ok && response.data.success) {
        toast.success("OTP resent successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Failed to resend OTP");
    } finally {
      setLoadingSendOtp(false);
    }
  };

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
                disabled={loadingSendOtp || loadingVerifyOtp}
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center text-[#687076] hover:text-[#11181C] transition-colors duration-150"
              >
                <X size={16} />
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-4 border border-[#E6E8EA]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
                ACCOUNT
              </div>

              <h2 className="text-3xl font-bold tracking-tighter text-[#11181C]">
                autoflow.signup()
              </h2>

              <p className="mt-2 text-sm text-[#687076] font-mono">
                Start importing leads, enriching companies, and automating
                outreach.
              </p>
            </div>

            {/* Form */}
            <div className="px-8 pb-8 pt-6">
              <form className="space-y-4">
                {/* Username Field */}
                <div>
                  <label className="block text-xs font-mono text-[#687076] mb-1.5 uppercase tracking-wider">
                    USERNAME
                  </label>
                  <input
                    ref={usernameInputRef}
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    disabled={otpSent || loadingSendOtp || loadingVerifyOtp}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`
                      w-full px-4 py-3 bg-white border font-mono text-sm outline-none transition-all duration-150
                      ${
                        focusedField === "username"
                          ? "border-[#FFC043] ring-1 ring-[#FFC043]/20"
                          : "border-[#E6E8EA] hover:border-[#1E2A3A]"
                      }
                      ${otpSent || loadingSendOtp || loadingVerifyOtp ? "bg-[#F8F9FA] text-[#687076] cursor-not-allowed" : ""}
                    `}
                  />
                </div>

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
                    disabled={otpSent || loadingSendOtp || loadingVerifyOtp}
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
                      ${otpSent || loadingSendOtp || loadingVerifyOtp ? "bg-[#F8F9FA] text-[#687076] cursor-not-allowed" : ""}
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
                        placeholder="000000"
                        value={otp}
                        maxLength={6}
                        onFocus={() => setFocusedField("otp")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) =>
                          setOtp(
                            e.target.value.replace(/[^0-9]/g, "").slice(0, 6),
                          )
                        }
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
                    disabled={loadingSendOtp || !username || !email}
                    className="
                      group relative w-full mt-6 px-6 py-3 bg-[#11181C] text-white font-mono text-sm
                      hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#11181C] disabled:hover:text-white
                      flex items-center justify-center gap-2
                    "
                  >
                    {loadingSendOtp ? (
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
                      disabled={loadingVerifyOtp || !otp || otp.length !== 6}
                      className="
                        w-full px-6 py-3 bg-[#11181C] text-white font-mono text-sm
                        hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#11181C] disabled:hover:text-white
                        flex items-center justify-center gap-2
                      "
                    >
                      {loadingVerifyOtp ? (
                        <span className="flex items-center justify-center gap-2">
                          <Spinner />
                          creating...
                        </span>
                      ) : (
                        <>
                          <span>autoflow.create()</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loadingSendOtp}
                      className="
                        w-full px-6 py-3 border border-[#E6E8EA] bg-white text-[#687076] font-mono text-sm
                        hover:border-[#1E2A3A] hover:text-[#11181C] transition-all duration-150
                        disabled:opacity-50 disabled:cursor-not-allowed
                      "
                    >
                      {loadingSendOtp ? "sending..." : "autoflow.resend()"}
                    </button>
                  </div>
                )}
              </form>

              {/* Footer - Login Link */}
              <div className="mt-8 pt-6 border-t border-[#E6E8EA] text-center">
                <p className="text-xs font-mono text-[#687076] mb-2">
                  ALREADY HAVE AN ACCOUNT?
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onLoginClick();
                  }}
                  className="
                    group text-sm font-mono text-[#1E2A3A] hover:text-[#FFC043] transition-colors duration-150
                    flex items-center justify-center gap-1 mx-auto
                  "
                >
                  <span>autoflow.login()</span>
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
                <span>autoflow --signup</span>
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
