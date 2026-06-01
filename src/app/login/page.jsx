"use client";

import axiosInstance from "@/lib/axiosInstance";
import { setUsersList, setUser } from "@/store/userSlice";
import { HttpStatusCode } from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Mail,
  Key,
  CheckCircle2,
  RefreshCw,
  LogIn,
  ArrowRight,
  User,
  Zap,
  ArrowLeft,
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

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  // State
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Refs
  const emailInputRef = useRef(null);
  const otpInputRef = useRef(null);

  // Handle scroll effect
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

  // Focus email input on mount
  useEffect(() => {
    setTimeout(() => emailInputRef.current?.focus(), 100);
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

  // Send OTP handler
  const handleSendOtp = useCallback(
    async (e) => {
      e.preventDefault();

      if (!email) {
        toast.error("Email address?");
        emailInputRef.current?.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("That doesn't look like a real email");
        emailInputRef.current?.focus();
        return;
      }

      setLoading(true);

      try {
        const response = await axiosInstance.post("/auth/send-otp", { email });

        if (response.status === HttpStatusCode.Ok && response.data.success) {
          toast.success("Check your inbox!");
          setOtpSent(true);
          setResendCooldown(60);
          setTimeout(() => otpInputRef.current?.focus(), 100);
        } else {
          toast.error(response.data.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Send OTP error:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to send. Try again?";
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
        toast.success("Another code sent");
        setResendCooldown(60);
      } else {
        toast.error(response.data.message || "Try again");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(error.response?.data?.error || "Failed to resend");
    } finally {
      setLoading(false);
    }
  }, [email, resendCooldown]);

  // Verify OTP handler
  const handleVerifyOtp = useCallback(
    async (e) => {
      e.preventDefault();

      if (!otp || otp.length !== 6) {
        toast.error("Need that 6-digit code");
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

          toast.success("You're in!");

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

          // Redirect to dashboard
          router.push("/home/data-source");
        } else {
          toast.error(response.data.message || "Wrong code. Try again?");
        }
      } catch (error) {
        console.error("Verify OTP error:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Verification failed";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [otp, email, dispatch, router],
  );

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
              <LogIn className="w-6 h-6 text-[#FFC043]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#11181C] mb-2">
              sign_in
            </h1>
            <p className="text-[#687076] text-sm font-mono">
              we'll email you a code to verify
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
                  email
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
                  verify
                </div>
                {otpSent && (
                  <div className="w-full h-px bg-[#E6E8EA] mt-2">
                    <div className="w-full h-full bg-[#FFC043]" />
                  </div>
                )}
              </div>
            </div>

            <form className="space-y-5">
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
                  disabled={otpSent || loading}
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
                      onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                      maxLength={6}
                    />
                  </div>
                  <p className="text-[10px] font-mono text-[#687076]">
                    check your email - it might take a minute
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-3 pt-2">
                {!otpSent ? (
                  <TouchButton
                    onClick={handleSendOtp}
                    variant="primary"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
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
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Spinner /> checking...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          sign_in
                        </>
                      )}
                    </TouchButton>
                    <TouchButton
                      onClick={handleResendOtp}
                      variant="secondary"
                      disabled={resendCooldown > 0 || loading}
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
                          didn't_get_it?_resend
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
                  new_here?
                </span>
              </div>
            </div>

            {/* Sign up button */}
            <TouchButton
              onClick={() => router.push("/signup")}
              variant="secondary"
              className="w-full"
            >
              <User className="w-4 h-4" />
              create_an_account
              <ArrowRight className="w-3.5 h-3.5" />
            </TouchButton>

            {/* Demo hint */}
            <p className="text-center text-[10px] font-mono text-[#687076] mt-6 tracking-wide">
              no_account_needed? // just sign_in and we'll create one
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
