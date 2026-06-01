"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react";
import LoginModal from "@/components/modals/loginModal";
import SignUpModal from "@/components/modals/signUpModal";
import axiosInstance from "@/lib/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUsersList } from "../../src/store/userSlice";

// ============================================
// DESIGN SYSTEM - Mobile-first, refined, intentional
// ============================================

// Subtle cursor animation for CLI elements
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

// Scroll reveal with refined easing - optimized for mobile
const RevealOnScroll = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-40px 0px -40px 0px",
    amount: 0.2,
  });

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.1, 1] }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 15 },
      }}
    >
      {children}
    </motion.div>
  );
};

// Touch-optimized button component with hover states preserved
const TouchButton = ({
  onClick,
  children,
  variant = "primary",
  className = "",
}) => {
  const baseStyles =
    "min-h-[44px] active:scale-[0.98] transition-all duration-200 touch-manipulation";
  const variants = {
    primary:
      "bg-[#11181C] text-white px-6 py-3 font-mono text-sm tracking-wide hover:bg-[#FFC043] hover:text-[#11181C] relative group overflow-hidden",
    secondary:
      "text-[#687076] hover:text-[#11181C] transition-colors font-mono text-sm px-4 py-2",
    outline:
      "border border-[#E6E8EA] text-[#11181C] px-6 py-3 font-mono text-sm hover:border-[#FFC043] hover:bg-[#F8F9FA]",
  };

  if (variant === "primary") {
    return (
      <button
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${className}`}
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
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function LandingPage() {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const router = useRouter();
  const dispatch = useDispatch();

  // Optimized scroll handler for mobile performance
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage?.getItem("token");
      if (token) {
        axiosInstance
          .get("/auth/all-users")
          .then((res) => dispatch(setUsersList(res.data.users)))
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
          element.scrollIntoView({ behavior: "smooth", block: "start" });
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
    { name: "Workflow", href: "#workflow", requireAuth: false },
    { name: "Signal", href: "#signal", requireAuth: false },
  ];

  return (
    <div className="bg-white text-[#11181C] antialiased overflow-x-hidden selection:bg-[#FFC043]/30 selection:text-[#11181C]">
      {/* ============================================
      NAVBAR - Mobile-first, accessible touch targets
      ============================================ */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-[#E6E8EA] shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo - Larger tap area for mobile */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.1, 1] }}
              className="cursor-pointer py-2 px-1 -ml-1"
              onClick={() => navigateTo("/")}
            >
              <span className="text-lg sm:text-xl font-mono font-semibold tracking-tight text-[#11181C]">
                autoflow
                <span className="text-[#FFC043]">/</span>
              </span>
            </motion.div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navItems.map((item, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  onClick={() => navigateTo(item.href, item.requireAuth)}
                  className="text-sm text-[#687076] hover:text-[#11181C] transition-colors duration-200 font-mono tracking-wide py-2"
                >
                  {item.name.toLowerCase()}
                </motion.button>
              ))}

              {!isLoggedIn ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="flex items-center gap-4 ml-2"
                >
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="text-sm text-[#687076] hover:text-[#11181C] transition-colors duration-200 font-mono tracking-wide py-2 px-2"
                  >
                    sign_in
                  </button>
                  <button
                    onClick={() => setShowSignUpModal(true)}
                    className="relative group bg-[#11181C] text-white px-5 py-2 text-sm font-mono tracking-wide hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-300 overflow-hidden min-h-[40px]"
                  >
                    <span className="relative z-10 whitespace-nowrap">
                      autoflow.run()
                    </span>
                    <span className="absolute inset-0 bg-[#FFC043] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={logout}
                  className="flex items-center gap-2 text-sm text-[#687076] hover:text-[#11181C] transition-colors duration-200 font-mono py-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  exit
                </motion.button>
              )}
            </div>

            {/* Mobile menu button - Larger touch target */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#11181C] focus:outline-none p-3 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Bottom sheet style for better UX */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.1, 1] }}
              className="md:hidden bg-white border-t border-[#E6E8EA] shadow-lg"
            >
              <div className="px-5 py-4 space-y-2">
                {navItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigateTo(item.href, item.requireAuth)}
                    className="block w-full text-left py-3 text-[#687076] hover:text-[#11181C] transition-colors font-mono text-base active:bg-[#F8F9FA] rounded-lg px-3"
                  >
                    {item.name.toLowerCase()}
                  </button>
                ))}
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left py-3 text-[#687076] hover:text-[#11181C] transition-colors font-mono text-base active:bg-[#F8F9FA] rounded-lg px-3"
                    >
                      sign_in
                    </button>
                    <button
                      onClick={() => {
                        setShowSignUpModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full mt-4 bg-[#11181C] text-white py-3.5 text-sm font-mono hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-300 rounded-lg active:scale-[0.98]"
                    >
                      autoflow.run()
                    </button>
                  </>
                ) : (
                  <button
                    onClick={logout}
                    className="block w-full text-left py-3 text-[#687076] hover:text-[#11181C] transition-colors font-mono text-base active:bg-[#F8F9FA] rounded-lg px-3"
                  >
                    exit
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ============================================
      SECTION 1: HERO - Mobile-optimized typography and spacing
      ============================================ */}
      <header className="relative min-h-[90vh] flex items-center justify-center px-5 pt-16 pb-12 overflow-hidden">
        {/* Subtle background texture - optimized for performance */}
        <div className="absolute inset-0 bg-[radial-gradient(#E6E8EA_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F8F9FA] text-[#1E2A3A] text-[11px] font-mono mb-6 border border-[#E6E8EA] rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043] animate-pulse"></span>
              <span className="tracking-wider">AUTOFLOW v2.0 / READY</span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[1.15] mb-5">
              Automate your
              <br />
              <span className="font-medium relative inline-block">
                B2B pipeline.
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#FFC043] origin-left scale-x-0 animate-[expandWidth_0.6s_ease-out_0.4s_forwards]"></span>
              </span>
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <p className="text-base sm:text-lg md:text-xl text-[#687076] max-w-2xl mx-auto leading-relaxed font-light px-2">
              Configure, enrich, and automate your outreach — from sourcing
              leads to personalized campaigns at scale.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
              <TouchButton
                onClick={() => setShowSignUpModal(true)}
                variant="primary"
                className="w-full sm:w-auto min-w-[200px]"
              >
                autoflow.run("start_trial")
                <ArrowRight className="w-4 h-4" />
              </TouchButton>
              <TouchButton
                onClick={() => navigateTo("#workflow")}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <span className="flex items-center gap-1">
                  view_workflow
                  <ChevronRight className="w-3 h-3" />
                </span>
              </TouchButton>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.4}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] sm:text-[11px] font-mono text-[#687076] tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#FFC043]" />
                no_credit_card_required
              </span>
              <span className="text-[#E6E8EA] hidden xs:inline">|</span>
              <span>14_day_trial</span>
              <span className="text-[#E6E8EA] hidden xs:inline">|</span>
              <span>cancel_anytime</span>
            </div>
          </RevealOnScroll>
        </div>
      </header>

      {/* ============================================
      SECTION 2: THE CANVAS - Mobile-first grid
      ============================================ */}
      <section className="py-16 sm:py-20 md:py-28 px-5 border-t border-[#E6E8EA] bg-gradient-to-b from-white to-[#F8F9FA]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <RevealOnScroll>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-px bg-[#FFC043]"></div>
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[#FFC043] uppercase font-semibold">
                    Interface
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-[1.2] text-[#11181C]">
                  Data isn't chaotic.
                  <br />
                  Your tools are.
                </h2>
                <p className="text-[#687076] text-base sm:text-lg leading-relaxed mb-6">
                  AutoFlow aggregates and normalizes signals from your entire
                  stack—CRM, support, product usage, and enrichment—into a
                  single source of truth.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-[#FFC043]">
                  <Zap className="w-3 h-3" />
                  <span>real-time sync</span>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="relative mt-8 lg:mt-0">
                <div className="absolute -inset-4 bg-[#FFC043]/5 blur-2xl rounded-2xl"></div>
                <div className="relative bg-white shadow-xl border border-[#E6E8EA] overflow-hidden rounded-sm">
                  <div className="h-9 bg-[#F8F9FA] border-b border-[#E6E8EA] flex items-center px-4 gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                    <div className="ml-2 font-mono text-[9px] sm:text-[10px] text-[#687076] tracking-wide truncate">
                      autoflow/dashboard — zsh
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 bg-white">
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                      <div className="border border-[#E6E8EA] p-2 sm:p-4 bg-[#F8F9FA] transition-all hover:border-[#FFC043]/50">
                        <p className="font-mono text-[8px] sm:text-[10px] text-[#687076] uppercase tracking-wider">
                          ACTIVE_DEALS
                        </p>
                        <p className="text-xl sm:text-3xl font-bold mt-1 text-[#11181C]">
                          128
                        </p>
                      </div>
                      <div className="border border-[#E6E8EA] p-2 sm:p-4 bg-[#F8F9FA] transition-all hover:border-[#FFC043]/50">
                        <p className="font-mono text-[8px] sm:text-[10px] text-[#687076] uppercase tracking-wider">
                          VELOCITY
                        </p>
                        <p className="text-xl sm:text-3xl font-bold mt-1 text-[#11181C]">
                          +23%
                        </p>
                      </div>
                      <div className="border border-[#E6E8EA] p-2 sm:p-4 bg-[#F8F9FA] transition-all hover:border-[#FFC043]/50">
                        <p className="font-mono text-[8px] sm:text-[10px] text-[#687076] uppercase tracking-wider">
                          SIGNALS
                        </p>
                        <p className="text-xl sm:text-3xl font-bold mt-1 text-[#11181C]">
                          14.2k
                        </p>
                      </div>
                    </div>
                    <div className="border border-[#E6E8EA] p-3 sm:p-4 bg-[#F8F9FA]">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-mono text-[8px] sm:text-[10px] text-[#687076] uppercase tracking-wider">
                          ACTIVITY_FEED
                        </p>
                        <span className="text-[8px] sm:text-[9px] font-mono text-[#FFC043]">
                          LIVE
                        </span>
                      </div>
                      <div className="space-y-2">
                        {[100, 83, 66, 50].map((width, i) => (
                          <div
                            key={i}
                            className="h-1.5 sm:h-2 bg-[#E6E8EA] rounded-full overflow-hidden"
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${width}%` }}
                              transition={{
                                duration: 0.8,
                                delay: 0.3 + i * 0.1,
                              }}
                              className="h-full bg-[#FFC043]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ============================================
      SECTION 3: THE WORKFLOW - Mobile-optimized steps
      ============================================ */}
      <section
        id="workflow"
        className="py-16 sm:py-20 md:py-28 px-5 border-t border-[#E6E8EA] bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16 md:mb-24">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-6 h-px bg-[#FFC043]"></div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#FFC043] uppercase font-semibold">
                  Pipeline
                </span>
                <div className="w-6 h-px bg-[#FFC043]"></div>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#11181C] px-2">
                From raw signal to decisive action.
              </h2>
            </div>
          </RevealOnScroll>

          {/* Step 1 - Connect */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-20 md:mb-32">
            <RevealOnScroll>
              <div className="lg:order-2">
                <p className="font-mono text-[#FFC043] text-5xl sm:text-6xl md:text-7xl font-bold mb-3 tracking-tighter opacity-80">
                  01
                </p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 text-[#11181C]">
                  connect_your_data_sources
                </h3>
                <p className="text-[#687076] text-base sm:text-lg leading-relaxed mb-6">
                  Import leads from spreadsheets, NASDAQ, LinkedIn, CrunchBase,
                  and Y Combinator. AutoFlow standardizes everything into a
                  single source of truth.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "spreadsheets",
                    "NASDAQ",
                    "LinkedIn",
                    "CrunchBase",
                    "YC",
                  ].map((source) => (
                    <span
                      key={source}
                      className="px-2 py-1 border border-[#E6E8EA] text-[#1E2A3A] font-mono text-[10px] sm:text-xs tracking-wide hover:border-[#FFC043] transition-colors"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="lg:order-1 bg-[#1E2A3A] aspect-square w-full flex items-center justify-center border border-[#E6E8EA] relative overflow-hidden group rounded-sm">
                <div className="absolute inset-0 bg-[#FFC043]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="text-center relative z-10 p-4">
                  <div className="text-[#FFC043] text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    ↗︎
                  </div>
                  <p className="text-xs sm:text-sm text-white/70 font-mono tracking-wide">
                    DATA_INGEST
                  </p>
                  <div className="mt-3 text-[10px] sm:text-xs text-white/40 font-mono">
                    40+ connected sources
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Step 2 - Enrich */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-20 md:mb-32">
            <RevealOnScroll>
              <div>
                <p className="font-mono text-[#FFC043] text-5xl sm:text-6xl md:text-7xl font-bold mb-3 tracking-tighter opacity-80">
                  02
                </p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 text-[#11181C]">
                  enrich_company_data
                </h3>
                <p className="text-[#687076] text-base sm:text-lg leading-relaxed mb-6">
                  Automatically fetch executive details, funding info, contact
                  emails, and phone numbers. Every profile becomes a complete
                  intelligence dossier.
                </p>
                <div className="bg-[#F8F9FA] p-4 border-l-2 border-[#FFC043] font-mono text-xs sm:text-sm">
                  <span className="text-[#FFC043]">→</span>{" "}
                  ENRICHED_1,247_COMPANIES_THIS_WEEK
                  <div className="text-[#687076] text-[10px] sm:text-xs mt-1">
                    // 97.3% email accuracy
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="bg-[#1E2A3A] aspect-square w-full flex items-center justify-center border border-[#E6E8EA] relative overflow-hidden group rounded-sm">
                <div className="absolute inset-0 bg-[#FFC043]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="text-center relative z-10 p-4">
                  <div className="text-[#FFC043] text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    ◉
                  </div>
                  <p className="text-xs sm:text-sm text-white/70 font-mono tracking-wide">
                    ENRICHMENT_ENGINE
                  </p>
                  <div className="mt-3 text-[10px] sm:text-xs text-white/40 font-mono">
                    real-time data refresh
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Step 3 - Automate */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <RevealOnScroll>
              <div className="lg:order-2">
                <p className="font-mono text-[#FFC043] text-5xl sm:text-6xl md:text-7xl font-bold mb-3 tracking-tighter opacity-80">
                  03
                </p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 text-[#11181C]">
                  outreach_on_autopilot
                </h3>
                <p className="text-[#687076] text-base sm:text-lg leading-relaxed mb-6">
                  Create smart campaigns with emails and voice drops. Schedule
                  follow-ups, and let automation handle the rest while you focus
                  on closing.
                </p>
                <div className="bg-[#1E2A3A] p-4 font-mono text-xs sm:text-sm text-white/80 overflow-x-auto">
                  <code className="whitespace-nowrap sm:whitespace-normal">
                    <span className="text-[#FFC043]">if</span> lead.score &gt;
                    85
                    <span className="text-[#FFC043]"> then</span>
                    <br />
                        
                    <span className="text-white/50 text-[10px] sm:text-xs">
                      // trigger: email → day3 → call → day7 → meeting
                    </span>
                  </code>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="lg:order-1 bg-[#1E2A3A] aspect-square w-full flex items-center justify-center border border-[#E6E8EA] relative overflow-hidden group rounded-sm">
                <div className="absolute inset-0 bg-[#FFC043]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="text-center relative z-10 p-4">
                  <div className="text-[#FFC043] text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    ▶
                  </div>
                  <p className="text-xs sm:text-sm text-white/70 font-mono tracking-wide">
                    AUTOMATION_ENGINE
                  </p>
                  <div className="mt-3 text-[10px] sm:text-xs text-white/40 font-mono">
                    3,241 active campaigns
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ============================================
      SECTION 4: THE SIGNAL - Mobile stats grid
      ============================================ */}
      <section
        id="signal"
        className="py-16 sm:py-20 md:py-28 px-5 bg-[#11181C] border-t border-[#1E2A3A]"
      >
        <div className="max-w-6xl mx-auto text-center">
          <RevealOnScroll>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-6 h-px bg-[#FFC043]"></div>
              <span className="text-[10px] tracking-[0.2em] font-mono text-[#FFC043] uppercase font-semibold">
                Signal / Noise Ratio
              </span>
              <div className="w-6 h-px bg-[#FFC043]"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.3] text-white mb-10 max-w-4xl mx-auto px-2">
              &ldquo;AutoFlow turned our data firehose into a precision
              instrument.&rdquo;
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-[#1E2A3A]">
              <div className="p-4">
                <p className="text-5xl sm:text-6xl font-bold text-[#FFC043] tracking-tighter">
                  3x
                </p>
                <p className="font-mono text-[10px] text-[#687076] mt-2 uppercase tracking-wider">
                  MORE_DEMOS_BOOKED
                </p>
                <p className="text-[11px] text-[#687076] mt-2 font-mono">
                  — Sasha V., BetaTech
                </p>
              </div>
              <div className="p-4">
                <p className="text-5xl sm:text-6xl font-bold text-[#FFC043] tracking-tighter">
                  100+
                </p>
                <p className="font-mono text-[10px] text-[#687076] mt-2 uppercase tracking-wider">
                  HOURS_SAVED_PER_MONTH
                </p>
                <p className="text-[11px] text-[#687076] mt-2 font-mono">
                  — Michael C., TechFlow
                </p>
              </div>
              <div className="p-4">
                <p className="text-5xl sm:text-6xl font-bold text-[#FFC043] tracking-tighter">
                  0
                </p>
                <p className="font-mono text-[10px] text-[#687076] mt-2 uppercase tracking-wider">
                  MANUAL_DATA_ENTRY
                </p>
                <p className="text-[11px] text-[#687076] mt-2 font-mono">
                  — Elena R., StartUpScale
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ============================================
      SECTION 5: THE CLI - Mobile-optimized CTA
      ============================================ */}
      <section className="py-16 sm:py-20 md:py-28 px-5 bg-white text-center border-t border-[#E6E8EA]">
        <RevealOnScroll>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className="w-6 h-px bg-[#FFC043]"></div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#FFC043] uppercase font-semibold">
                Deploy
              </span>
              <div className="w-6 h-px bg-[#FFC043]"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter mb-5 text-[#11181C] px-2">
              Ready to run a better system?
            </h2>

            <div className="flex items-center justify-center gap-1 sm:gap-2 font-mono text-base sm:text-lg md:text-xl bg-[#F8F9FA] p-4 sm:p-5 border border-[#E6E8EA] w-full max-w-2xl mx-auto my-8 rounded-sm overflow-x-auto">
              <span className="text-[#687076] flex-shrink-0">$</span>
              <span className="whitespace-nowrap sm:whitespace-normal">
                autoflow deploy --production
              </span>
              <BlinkingCursor />
            </div>

            <TouchButton
              onClick={() => setShowSignUpModal(true)}
              variant="primary"
              className="w-full sm:w-auto min-w-[260px]"
            >
              autoflow.run("start_free_trial")
              <ExternalLink className="w-3.5 h-3.5" />
            </TouchButton>

            <p className="text-[#687076] font-mono text-[10px] sm:text-xs mt-5 tracking-wide">
              no_credit_card_required // 14_day_trial // cancel_anytime
            </p>
          </div>
        </RevealOnScroll>
      </section>

      {/* ============================================
      FOOTER - Mobile-optimized grid
      ============================================ */}
      <footer className="py-12 sm:py-16 px-5 border-t border-[#E6E8EA] bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="font-mono text-base sm:text-lg text-[#11181C] mb-3">
                autoflow/<span className="text-[#FFC043]">systems</span>
              </div>
              <p className="text-[11px] text-[#687076] font-mono leading-relaxed">
                Automate your B2B outreach and scale your sales process.
              </p>
            </div>
            <div>
              <h4 className="text-[#11181C] font-mono text-[9px] sm:text-[10px] uppercase tracking-wider mb-3">
                PRODUCT
              </h4>
              <ul className="space-y-2 text-[11px] font-mono text-[#687076]">
                <li>
                  <button
                    onClick={() => navigateTo("#workflow")}
                    className="hover:text-[#11181C] transition-colors py-1"
                  >
                    pipeline
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/public/about")}
                    className="hover:text-[#11181C] transition-colors py-1"
                  >
                    about
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/public/contact")}
                    className="hover:text-[#11181C] transition-colors py-1"
                  >
                    contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#11181C] font-mono text-[9px] sm:text-[10px] uppercase tracking-wider mb-3">
                LEGAL
              </h4>
              <ul className="space-y-2 text-[11px] font-mono text-[#687076]">
                <li>
                  <button
                    onClick={() => router.push("/public/privacy")}
                    className="hover:text-[#11181C] transition-colors py-1"
                  >
                    privacy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/public/terms")}
                    className="hover:text-[#11181C] transition-colors py-1"
                  >
                    terms
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#11181C] font-mono text-[9px] sm:text-[10px] uppercase tracking-wider mb-3">
                STATUS
              </h4>
              <ul className="space-y-2 text-[11px] font-mono text-[#687076]">
                <li>
                  <a
                    href="#"
                    className="hover:text-[#11181C] transition-colors py-1 inline-block"
                  >
                    api_status
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#11181C] transition-colors py-1 inline-block"
                  >
                    security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#E6E8EA] pt-6 text-center text-[9px] sm:text-[10px] font-mono text-[#687076] tracking-wider">
            <p>© 2025 AUTOFLOW SYSTEMS, INC.</p>
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
