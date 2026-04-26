"use client";
import axiosInstance from "@/lib/axiosInstance";
import { HttpStatusCode } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setUser } from "../../store/userSlice";
import { 
  Mail, 
  User, 
  Key, 
  ArrowRight, 
  Shield, 
  CheckCircle2,
  Sparkles,
  X,
  RefreshCw,
  LogIn
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
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    ></path>
  </svg>
);

export default function SignUpModal({ showModal, onClose, onLoginClick }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loadingSendOtp, setLoadingSendOtp] = useState(false);
  const [loadingVerifyOtp, setLoadingVerifyOtp] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      setUsername("");
      setEmail("");
      setOtp("");
      setOtpSent(false);
      setLoadingSendOtp(false);
      setLoadingVerifyOtp(false);
    };
  }, [showModal]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoadingSendOtp(true);
    try {
      const response = await axiosInstance.post("/auth/send-otp", {
        username,
        email,
      });

      if (response.status === HttpStatusCode.Ok && response.data.success) {
        toast.success(response.data.message);
        setOtpSent(true);
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
        toast.success("Logged-in successfully");
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || "Failed to verify OTP");
    } finally {
      setLoadingVerifyOtp(false);
    }
  };

  const inputClasses = "w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-gray-700 placeholder-gray-400 bg-gray-50 hover:bg-white";

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-gradient-to-br from-black/40 via-black/30 to-purple-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="h-full bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
           
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all z-10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="p-8 pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-1">
                Create your account
              </h3>
              <p className="text-center text-gray-500 text-sm mb-6">
                Start your journey with us today
              </p>

              {/* Steps indicator */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  !otpSent 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {otpSent ? 'Details' : 'Enter Details'}
                </div>
                <div className="w-8 h-0.5 bg-gray-200" />
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  otpSent 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <Shield className="w-3.5 h-3.5" />
                  Verify OTP
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="px-8 pb-8">
              <form className="space-y-4" onSubmit={handleSendOtp}>
                {/* Username field */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    className={inputClasses}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                {/* Email field */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    className={inputClasses}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* OTP field with animation */}
                <AnimatePresence>
                  {otpSent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Enter OTP code"
                          value={otp}
                          className={inputClasses}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <Shield className="w-5 h-5 text-purple-400" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 text-center">
                        Enter the 6-digit code sent to your email
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action buttons */}
                <div className="space-y-3 pt-2">
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-medium shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transform hover:-translate-y-0.5"
                      disabled={loadingSendOtp}
                    >
                      {loadingSendOtp ? (
                        <>
                          <Spinner /> Sending OTP...
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5" />
                          Send OTP
                        </>
                      )}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleVerifyOtp}
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-medium shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transform hover:-translate-y-0.5"
                        disabled={loadingVerifyOtp}
                      >
                        {loadingVerifyOtp ? (
                          <>
                            <Spinner /> Creating Account...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            Create Account
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="w-full text-purple-600 hover:text-purple-700 py-2.5 rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium"
                        disabled={loadingSendOtp}
                      >
                        {loadingSendOtp ? (
                          <>
                            <Spinner /> Resending...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            Resend OTP
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white text-sm text-gray-400">
                      Already have an account?
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    onClose();
                    onLoginClick();
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl border-2 border-gray-200 hover:border-purple-200 text-gray-700 hover:text-purple-700 transition-all font-medium group"
                >
                  <LogIn className="w-5 h-5 group-hover:text-purple-600 transition-colors" />
                  Sign in to your account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}