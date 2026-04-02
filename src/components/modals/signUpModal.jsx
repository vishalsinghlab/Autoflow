"use client";
import axiosInstance from "@/lib/axiosInstance";
import { HttpStatusCode } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setUser } from "../../store/userSlice";

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

  const handleGoogleLogin = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/google/url`,
    );
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              transition: { duration: 0.5, ease: "easeInOut", delay: 0.1 },
            }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-4 text-center text-purple-700">
              Create your account
            </h3>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 mb-4 hover:bg-gray-50 transition"
            >
              <Image src="/google.png" alt="Google" width={20} height={20} />
              <span className="text-sm font-medium text-gray-700">
                Sign up with Google
              </span>
            </button>

            <div className="flex items-center mb-4">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="px-2 text-sm text-gray-500">or</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>

            <form className="space-y-4" onSubmit={handleSendOtp}>
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
                onChange={(e) => setEmail(e.target.value)}
              />

              {otpSent && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
                  onChange={(e) => setOtp(e.target.value)}
                />
              )}

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={loadingSendOtp}
                >
                  {loadingSendOtp ? (
                    <>
                      <Spinner /> Sending...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleVerifyOtp}
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={loadingVerifyOtp}
                  >
                    {loadingVerifyOtp ? (
                      <>
                        <Spinner /> Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-sm text-purple-600 hover:underline mt-1 disabled:opacity-50 flex items-center gap-2"
                    disabled={loadingSendOtp}
                  >
                    {loadingSendOtp ? (
                      <>
                        <Spinner /> Resending...
                      </>
                    ) : (
                      "Resend OTP"
                    )}
                  </button>
                </>
              )}
            </form>

            <p className="text-center text-sm mt-6 text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => {
                  onClose();
                  onLoginClick();
                }}
                className="text-purple-700 font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
