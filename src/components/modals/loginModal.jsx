"use client";
import axiosInstance from "@/lib/axiosInstance";
import { setUsersList } from "@/store/userSlice";
import { HttpStatusCode } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";

export default function LoginModal({ showModal, onClose, onSignUpClick }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    return () => {
      console.log("login cleanup");
      setEmail("");
      setOtp("");
      setOtpSent(false);
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;

    // Trigger OTP send logic here
    console.log("Sending OTP to", email);
    setLoading(true); // Start loading

    try {
      const response = await axiosInstance.post("/auth/send-otp", {
        email,
      });

      if (response.status === HttpStatusCode.Ok && response.data.success) {
        toast.success(response.data.message);
        setOtpSent(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    // Trigger OTP verification logic here
    console.log("Verifying OTP", otp, "for", email);
    setLoading(true); // Start loading

    try {
      const response = await axiosInstance.post("/auth/verify-otp", {
        otp,
        email,
      });

      if (response.status === HttpStatusCode.Ok && response.data.success) {
        const { token, username, email, role } = response.data;
        toast.success("Logged-in successfully");
        setOtpSent(true);
        localStorage?.setItem("token", token);
        localStorage?.setItem("username", username);
        localStorage?.setItem("email", email);
        localStorage?.setItem("role", role);
        dispatch(setUser({ email, role, username, isLoggedIn: true }));
        axiosInstance
          .get("/auth/all-users")
          .then((res) => {
            // console.log("res", res);
            dispatch(setUsersList(res.data.users));
          })
          .catch(console.log);

        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
    } finally {
      setLoading(false); // Stop loading
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
              Login to your account
            </h3>

            {/* <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 mb-4 hover:bg-gray-50 transition"
            >
              <Image src="/google.png" alt="Google" width={20} height={20} />
              <span className="text-sm font-medium text-gray-700">
                Login with Google
              </span>
            </button> */}

            {/* <div className="flex items-center mb-4">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="px-2 text-sm text-gray-500">or</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div> */}

            <form
              onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
              className="space-y-4"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
                required
                disabled={otpSent || loading} // Disable input during loading
              />

              {otpSent && (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
                  required
                  disabled={loading} // Disable OTP input during loading
                />
              )}

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="w-5 h-5 text-white animate-spin"
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
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
                  <span className="text-sm font-medium">
                    {otpSent ? "Verify OTP" : "Send OTP"}
                  </span>
                )}
              </button>
            </form>

            <div className="flex justify-center items-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    onClose();
                    onSignUpClick();
                  }}
                  className="text-purple-700 font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
