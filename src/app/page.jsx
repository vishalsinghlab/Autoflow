"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/modals/loginModal";
import SignUpModal from "@/components/modals/signUpModal";
import axiosInstance from "@/lib/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUsersList } from "../../src/store/userSlice";

export default function LandingPage() {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window != undefined) {
      const token = localStorage?.getItem("token");
      if (!token) setShowSignUpModal(true);
      else {
        axiosInstance
          .get("/auth/all-users")
          .then((res) => {
            dispatch(setUsersList(res.data.users));
          })
          .catch(console.log);
      }
    }
  }, []);

  const logout = () => {
    localStorage?.clear();
    dispatch(clearUser());
    router.push("/");
  };

  const navigateTo = (url) => {
    const token = localStorage?.getItem("token");
    if (!token) return setShowSignUpModal(true);
    router.push(url);
  };

  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-extrabold text-purple-700 tracking-tight">
            AutoFlow
          </div>
          <div className="space-x-6 hidden md:flex items-center">
            <button
              onClick={() => navigateTo("/home/data-source")}
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigateTo("#features")}
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Features
            </button>
            <button
              onClick={() => navigateTo("#testimonials")}
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Testimonials
            </button>
            {!isLoggedIn && (
              <button
                onClick={() => setShowSignUpModal(true)}
                className="bg-purple-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition-shadow shadow"
              >
                Get Started
              </button>
            )}
            {isLoggedIn && (
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-red-500 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-20 px-6 text-center bg-gradient-to-br from-purple-700 via-pink-500 to-red-400 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-cover" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-4xl font-bold leading-tight mb-4">
            Supercharge Your B2B Workflow
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Configure. Enrich. Connect. Automate your outreach — from sourcing
            leads to sending emails.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowSignUpModal(true)}
              className="bg-white text-purple-700 hover:bg-purple-100 px-6 py-3 rounded-full font-semibold shadow-lg transition"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigateTo("#cta")}
              className="bg-transparent border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-700 transition"
            >
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-10"
      >
        {[
          {
            icon: "🔌",
            title: "Step 1: Connect Your Data Source",
            desc: "Import leads from spreadsheets,NASDAQ,Linkdin,CrunchBase,and Y Combinator",
          },
          {
            icon: "🧠",
            title: "Step 2: Enrich Company Data",
            desc: "Automatically fetch executive details, funding info, contact emails and phone numbers",
          },
          {
            icon: "✉️",
            title: "Step 3: Outreach on Autopilot",
            desc: "Create smart campaigns with Emails and Voice Drops, schedule follow-ups, and let automation handle the rest.",
          },
        ].map((step, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-200 hover:shadow-lg transition-all duration-200"
          >
            <div className="text-4xl mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.desc}</p>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-gray-50 py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <blockquote className="text-xl italic text-gray-800 mb-4 leading-relaxed">
            “Within a week, we booked 3x more demos just by automating our lead
            workflow. This tool is a game-changer.”
          </blockquote>
          <p className="text-lg font-medium text-gray-900">
            — Sasha V., Head of Growth at BetaTech
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        id="cta"
        className="py-20 px-6 text-center bg-gradient-to-br from-pink-500 to-purple-700 text-white relative"
      >
        <div className="absolute inset-0 opacity-10 bg-[url('/dot-pattern.svg')] bg-cover" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to automate your outreach process?
          </h2>
          <p className="text-lg mb-6">
            Start your 14-day free trial — no credit card needed.
          </p>
          <button
            onClick={() => setShowSignUpModal(true)}
            className="bg-white text-pink-600 hover:bg-pink-100 px-8 py-3 rounded-full font-semibold text-sm shadow-md transition"
          >
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Modals */}
      <SignUpModal
        showModal={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onLoginClick={() => {
          setShowSignUpModal(false);
          setShowLoginModal(true);
        }}
      />
      <LoginModal
        showModal={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSignUpClick={() => {
          setShowLoginModal(false);
          setShowSignUpModal(true);
        }}
      />
    </div>
  );
}
