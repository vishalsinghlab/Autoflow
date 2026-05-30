"use client";
import axiosInstance from "@/lib/axiosInstance";
import { HttpStatusCode } from "axios";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { setUser } from "../../store/userSlice";
import {
  Mail,
  User,
  Key,
  ArrowRight,
  Shield,
  CheckCircle2,
  Zap,
  ArrowLeft,
  RefreshCw,
  LogIn,
} from "lucide-react";

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white inline-block"
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
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loadingSendOtp, setLoadingSendOtp] = useState(false);
  const [loadingVerifyOtp, setLoadingVerifyOtp] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const dispatch = useDispatch();
  const router = useRouter();

  const usernameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const otpInputRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus username on mount
  useEffect(() => {
    setTimeout(() => usernameInputRef.current?.focus(), 100);
  }, []);

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

  const inputClasses =
    "w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-gray-700 placeholder-gray-400 bg-gray-50 hover:bg-white";

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!username) {
      toast.error("What should we call you?");
      usernameInputRef.current?.focus();
      return;
    }

    if (username.length < 3) {
      toast.error("Username needs at least 3 characters");
      usernameInputRef.current?.focus();
      return;
    }

    if (!email) {
      toast.error("We'll need your email");
      emailInputRef.current?.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("That email doesn't look right");
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
        toast.success("Code sent! Check your email");
        setOtpSent(true);
        setResendCooldown(60);
        setTimeout(() => otpInputRef.current?.focus(), 100);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoadingSendOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setLoadingSendOtp(true);
    try {
      const response = await axiosInstance.post("/auth/send-otp", {
        username,
        email,
      });

      if (response.status === HttpStatusCode.Ok && response.data.success) {
        toast.success("Another code sent");
        setResendCooldown(60);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Try again");
    } finally {
      setLoadingSendOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Need that 6-digit code");
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
        toast.success("Welcome aboard!");
        router.push("/home/data-source");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Wrong code? Try again");
    } finally {
      setLoadingVerifyOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Simple navbar */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => router.push("/")}
            >
              <Zap className="w-7 h-7 text-purple-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AutoFlow
              </span>
            </div>

            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header - simpler */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Join AutoFlow
            </h1>
            <p className="text-gray-500 text-sm">Takes about a minute</p>
          </div>

          {/* Main form card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Steps indicator - subtle */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1">
                <div
                  className={`text-xs font-medium mb-1 transition-colors ${
                    !otpSent ? "text-purple-600" : "text-gray-400"
                  }`}
                >
                  Step 1
                </div>
                <div
                  className={`text-sm transition-colors ${
                    !otpSent ? "text-gray-800 font-medium" : "text-gray-500"
                  }`}
                >
                  Your info
                </div>
                {!otpSent && (
                  <div className="w-full h-0.5 bg-purple-200 mt-2 rounded-full">
                    <div className="w-1/2 h-full bg-purple-600 rounded-full" />
                  </div>
                )}
              </div>
              <div className="w-8 flex justify-center">
                <ArrowRight className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex-1 text-right">
                <div
                  className={`text-xs font-medium mb-1 transition-colors ${
                    otpSent ? "text-purple-600" : "text-gray-400"
                  }`}
                >
                  Step 2
                </div>
                <div
                  className={`text-sm transition-colors ${
                    otpSent ? "text-gray-800 font-medium" : "text-gray-500"
                  }`}
                >
                  Verify code
                </div>
                {otpSent && (
                  <div className="w-full h-0.5 bg-purple-200 mt-2 rounded-full">
                    <div className="w-full h-full bg-purple-600 rounded-full" />
                  </div>
                )}
              </div>
            </div>

            <form className="space-y-5">
              {/* Username field */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={usernameInputRef}
                  type="text"
                  placeholder="Username"
                  value={username}
                  className={inputClasses}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={otpSent || loadingSendOtp}
                />
              </div>

              {/* Email field */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={emailInputRef}
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  className={inputClasses}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={otpSent || loadingSendOtp}
                />
              </div>

              {/* OTP field */}
              {otpSent && (
                <div className="space-y-2">
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      ref={otpInputRef}
                      type="text"
                      placeholder="6-digit code"
                      value={otp}
                      className={
                        inputClasses + " text-center tracking-[0.25em] text-lg"
                      }
                      onChange={(e) =>
                        setOtp(
                          e.target.value.replace(/[^0-9]/g, "").slice(0, 6),
                        )
                      }
                      maxLength={6}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    Check your email - might take a minute
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-3 pt-2">
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-medium shadow-md"
                    disabled={loadingSendOtp}
                  >
                    {loadingSendOtp ? (
                      <>
                        <Spinner /> Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        Send me a code
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleVerifyOtp}
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-medium shadow-md"
                      disabled={loadingVerifyOtp}
                    >
                      {loadingVerifyOtp ? (
                        <>
                          <Spinner /> Creating...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Create account
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="w-full text-purple-600 hover:text-purple-700 py-2.5 rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium"
                      disabled={resendCooldown > 0 || loadingSendOtp}
                    >
                      {resendCooldown > 0 ? (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Wait {resendCooldown}s
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Didn't get it? Resend
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-gray-400">
                  Already with us?
                </span>
              </div>
            </div>

            {/* Sign in button */}
            <button
              onClick={() => router.push("/login")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl border-2 border-gray-200 hover:border-purple-200 text-gray-700 hover:text-purple-700 transition-all font-medium group"
            >
              <LogIn className="w-5 h-5 group-hover:text-purple-600 transition-colors" />
              Sign in instead
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Friendly note */}
            <p className="text-center text-xs text-gray-400 mt-6">
              We'll send a verification code to your email. No spam, promise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
