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
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  LogIn,
} from "lucide-react";

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 text-white inline-block"
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

// Touch-optimized button component
const TouchButton = ({
  onClick,
  children,
  variant = "primary",
  disabled = false,
  className = "",
}) => {
  const baseStyles =
    "min-h-[44px] active:scale-[0.98] transition-all duration-200 touch-manipulation font-mono text-sm tracking-wide";
  const variants = {
    primary:
      "bg-[#11181C] text-white hover:bg-[#FFC043] hover:text-[#11181C] relative group overflow-hidden",
    secondary:
      "border border-[#E6E8EA] text-[#687076] hover:text-[#11181C] hover:border-[#FFC043] hover:bg-[#F8F9FA]",
  };

  if (variant === "primary") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="relative z-10 flex items-center gap-2 justify-center">
          {children}
        </span>
        <span className="absolute inset-0 bg-[#FFC043] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} flex items-center justify-center gap-2 px-6 py-3 rounded-sm ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
};

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

  // Handle scroll effect with performance optimization
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
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
    <div className="min-h-screen bg-white text-[#11181C] antialiased">
      {/* Navbar - consistent with landing page */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-[#E6E8EA] shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div
              className="cursor-pointer py-2 px-1 -ml-1 group"
              onClick={() => router.push("/")}
            >
              <span className="text-lg sm:text-xl font-mono font-semibold tracking-tight text-[#11181C]">
                autoflow
                <span className="text-[#FFC043] group-hover:opacity-80 transition">
                  /
                </span>
              </span>
            </div>

            <button
              onClick={() => router.push("/")}
              className="text-sm text-[#687076] hover:text-[#11181C] transition-colors font-mono tracking-wide py-2 px-2 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              exit
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-5">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#11181C] rounded-sm mb-5">
              <User className="w-6 h-6 text-[#FFC043]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#11181C] mb-2">
              join_autoflow
            </h1>
            <p className="text-[#687076] text-sm font-mono">
              takes about a minute
            </p>
          </div>

          {/* Main form card */}
          <div className="bg-white border border-[#E6E8EA] rounded-sm p-6 sm:p-8">
            {/* Steps indicator */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1">
                <div
                  className={`text-[10px] font-mono tracking-wider mb-1 transition-colors ${
                    !otpSent ? "text-[#FFC043]" : "text-[#687076]"
                  }`}
                >
                  STEP_01
                </div>
                <div
                  className={`text-xs font-mono transition-colors ${
                    !otpSent ? "text-[#11181C]" : "text-[#687076]"
                  }`}
                >
                  your_info
                </div>
                {!otpSent && (
                  <div className="w-full h-px bg-[#E6E8EA] mt-2">
                    <div className="w-1/2 h-full bg-[#FFC043]" />
                  </div>
                )}
              </div>
              <div className="w-8 flex justify-center">
                <ArrowRight className="w-3 h-3 text-[#E6E8EA]" />
              </div>
              <div className="flex-1 text-right">
                <div
                  className={`text-[10px] font-mono tracking-wider mb-1 transition-colors ${
                    otpSent ? "text-[#FFC043]" : "text-[#687076]"
                  }`}
                >
                  STEP_02
                </div>
                <div
                  className={`text-xs font-mono transition-colors ${
                    otpSent ? "text-[#11181C]" : "text-[#687076]"
                  }`}
                >
                  verify_code
                </div>
                {otpSent && (
                  <div className="w-full h-px bg-[#E6E8EA] mt-2">
                    <div className="w-full h-full bg-[#FFC043]" />
                  </div>
                )}
              </div>
            </div>

            <form className="space-y-5">
              {/* Username field */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687076]" />
                <input
                  ref={usernameInputRef}
                  type="text"
                  placeholder="username"
                  value={username}
                  className="w-full pl-10 pr-3 py-3 border border-[#E6E8EA] focus:border-[#FFC043] focus:outline-none transition-colors text-[#11181C] placeholder-[#687076] bg-white font-mono text-sm"
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={otpSent || loadingSendOtp}
                />
              </div>

              {/* Email field */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687076]" />
                <input
                  ref={emailInputRef}
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  className="w-full pl-10 pr-3 py-3 border border-[#E6E8EA] focus:border-[#FFC043] focus:outline-none transition-colors text-[#11181C] placeholder-[#687076] bg-white font-mono text-sm"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={otpSent || loadingSendOtp}
                />
              </div>

              {/* OTP field */}
              {otpSent && (
                <div className="space-y-2">
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687076]" />
                    <input
                      ref={otpInputRef}
                      type="text"
                      placeholder="000000"
                      value={otp}
                      className="w-full pl-10 pr-3 py-3 border border-[#E6E8EA] focus:border-[#FFC043] focus:outline-none transition-colors text-[#11181C] placeholder-[#687076] bg-white font-mono text-sm text-center tracking-[0.25em]"
                      onChange={(e) =>
                        setOtp(
                          e.target.value.replace(/[^0-9]/g, "").slice(0, 6),
                        )
                      }
                      maxLength={6}
                    />
                  </div>
                  <p className="text-[10px] font-mono text-[#687076]">
                    check your email - might take a minute
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-3 pt-2">
                {!otpSent ? (
                  <TouchButton
                    onClick={handleSendOtp}
                    variant="primary"
                    disabled={loadingSendOtp}
                    className="w-full"
                  >
                    {loadingSendOtp ? (
                      <>
                        <Spinner /> sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        send_me_a_code
                      </>
                    )}
                  </TouchButton>
                ) : (
                  <>
                    <TouchButton
                      onClick={handleVerifyOtp}
                      variant="primary"
                      disabled={loadingVerifyOtp}
                      className="w-full"
                    >
                      {loadingVerifyOtp ? (
                        <>
                          <Spinner /> creating...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          create_account
                        </>
                      )}
                    </TouchButton>
                    <TouchButton
                      onClick={handleResendOtp}
                      variant="secondary"
                      disabled={resendCooldown > 0 || loadingSendOtp}
                      className="w-full"
                    >
                      {resendCooldown > 0 ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          wait_{resendCooldown}s
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          didnt_get_it?_resend
                        </>
                      )}
                    </TouchButton>
                  </>
                )}
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E6E8EA]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-[10px] font-mono text-[#687076] tracking-wide">
                  already_with_us?
                </span>
              </div>
            </div>

            {/* Sign in button */}
            <TouchButton
              onClick={() => router.push("/login")}
              variant="secondary"
              className="w-full"
            >
              <LogIn className="w-4 h-4" />
              sign_in_instead
              <ArrowRight className="w-3.5 h-3.5" />
            </TouchButton>

            {/* Friendly note */}
            <p className="text-center text-[10px] font-mono text-[#687076] mt-6 tracking-wide">
              we'll send a verification code to your email. // no spam, promise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
