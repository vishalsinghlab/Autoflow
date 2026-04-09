"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Zap,
  Database,
  Users,
  Mail,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Sparkles,
  Shield,
  TrendingUp,
  Star,
  Quote,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import LoginModal from "@/components/modals/loginModal";
import SignUpModal from "@/components/modals/signUpModal";
import axiosInstance from "@/lib/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUsersList } from "../../src/store/userSlice";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const featureCardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  hover: { y: -8, transition: { duration: 0.3 } },
};

export default function LandingPage() {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const router = useRouter();
  const dispatch = useDispatch();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage?.getItem("token");
      if (!token) {
        // Don't auto-show modal, let user interact first
        return;
      } else {
        axiosInstance
          .get("/auth/all-users")
          .then((res) => {
            dispatch(setUsersList(res.data.users));
          })
          .catch(console.error);
      }
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    localStorage?.clear();
    dispatch(clearUser());
    router.push("/");
  }, [dispatch, router]);

  const navigateTo = useCallback(
    (url, requireAuth = false) => {
      if (requireAuth) {
        const token = localStorage?.getItem("token");
        if (!token) {
          setShowSignUpModal(true);
          return;
        }
      }

      if (url.startsWith("#")) {
        const element = document.querySelector(url);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        router.push(url);
      }
      setMobileMenuOpen(false);
    },
    [router],
  );

  const navItems = [
    { name: "Dashboard", href: "/home/data-source", requireAuth: true },
    { name: "Features", href: "#features", requireAuth: false },
    { name: "Testimonials", href: "#testimonials", requireAuth: false },
    { name: "Pricing", href: "#pricing", requireAuth: false },
  ];

  const features = [
    {
      icon: Database,
      title: "Connect Your Data Source",
      description:
        "Import leads from spreadsheets, NASDAQ, LinkedIn, CrunchBase, and Y Combinator",
      step: "01",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Enrich Company Data",
      description:
        "Automatically fetch executive details, funding info, contact emails and phone numbers",
      step: "02",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Mail,
      title: "Outreach on Autopilot",
      description:
        "Create smart campaigns with Emails and Voice Drops, schedule follow-ups, and let automation handle the rest",
      step: "03",
      color: "from-orange-500 to-red-500",
    },
  ];

  const testimonials = [
    {
      quote:
        "Within a week, we booked 3x more demos just by automating our lead workflow. This tool is a game-changer.",
      author: "Sasha V.",
      role: "Head of Growth at BetaTech",
      rating: 5,
      avatar: "SV",
    },
    {
      quote:
        "The data enrichment feature saved us hundreds of hours of manual research. Absolutely essential for any B2B sales team.",
      author: "Michael C.",
      role: "Sales Director at TechFlow",
      rating: 5,
      avatar: "MC",
    },
    {
      quote:
        "Best investment we made this year. The automation workflows are incredibly intuitive and powerful.",
      author: "Elena R.",
      role: "CEO at StartUpScale",
      rating: 5,
      avatar: "ER",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$49",
      description: "Perfect for small teams",
      features: [
        "Up to 1,000 leads/month",
        "Basic enrichment",
        "Email campaigns",
        "Analytics dashboard",
      ],
      recommended: false,
    },
    {
      name: "Professional",
      price: "$99",
      description: "Best for growing companies",
      features: [
        "Up to 5,000 leads/month",
        "Advanced enrichment",
        "Voice drops",
        "API access",
        "Priority support",
      ],
      recommended: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited leads",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee",
      ],
      recommended: false,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white text-gray-900 font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => navigateTo("/")}
            >
              <Zap className="w-8 h-8 text-purple-600 group-hover:rotate-12 transition-transform" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AutoFlow
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => navigateTo(item.href, item.requireAuth)}
                  className="text-gray-600 hover:text-purple-600 transition-colors font-medium relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300" />
                </motion.button>
              ))}

              {!isLoggedIn ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-4"
                >
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowSignUpModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Get Started
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-purple-600 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 py-4 space-y-3">
                {navItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigateTo(item.href, item.requireAuth)}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setShowSignUpModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
                    >
                      Get Started
                    </button>
                  </>
                ) : (
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse" />

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Automation Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Supercharge Your
              <br />
              B2B Workflow
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Configure, enrich, and automate your outreach — from sourcing
              leads to sending personalized campaigns at scale.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setShowSignUpModal(true)}
                className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigateTo("#features")}
                className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all duration-300"
              >
                Watch Demo
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              How AutoFlow Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to automate your entire outreach process
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={featureCardVariants}
                whileHover="hover"
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl" />
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 text-5xl font-bold text-gray-100">
                    {feature.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                1000+
              </span>{" "}
              Companies
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Quote className="w-10 h-10 text-purple-400 mb-4" />
                <p className="text-gray-700 leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <div className="flex mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that works best for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.recommended
                    ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl scale-105"
                    : "bg-white border-2 border-gray-100 shadow-lg"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                    RECOMMENDED
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-sm opacity-80">/month</span>
                  )}
                </div>
                <p
                  className={`mb-6 ${plan.recommended ? "text-purple-100" : "text-gray-500"}`}
                >
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <CheckCircle
                        className={`w-5 h-5 ${plan.recommended ? "text-white" : "text-green-500"}`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowSignUpModal(true)}
                  className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                    plan.recommended
                      ? "bg-white text-purple-600 hover:shadow-lg hover:scale-105"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105"
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to Scale Your Outreach?
            </h2>
            <p className="text-xl mb-8 opacity-95">
              Join thousands of companies automating their B2B workflow with
              AutoFlow
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setShowSignUpModal(true)}
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Start Your 14-Day Free Trial
              </button>
              <button
                onClick={() => navigateTo("#features")}
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300"
              >
                Schedule a Demo
              </button>
            </div>
            <p className="text-sm mt-6 opacity-80">
              No credit card required. Cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-purple-500" />
                <span className="text-xl font-bold text-white">AutoFlow</span>
              </div>
              <p className="text-sm">
                Automate your B2B outreach and scale your sales process.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => navigateTo("#features")}
                    className="hover:text-white transition"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo("#pricing")}
                    className="hover:text-white transition"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition">API</button>
                </li>
                <li>
                  <button className="hover:text-white transition">
                    Integrations
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button className="hover:text-white transition">About</button>
                </li>
                <li>
                  <button className="hover:text-white transition">Blog</button>
                </li>
                <li>
                  <button className="hover:text-white transition">
                    Careers
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button className="hover:text-white transition">
                    Privacy
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition">Terms</button>
                </li>
                <li>
                  <button className="hover:text-white transition">
                    Security
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 AutoFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
