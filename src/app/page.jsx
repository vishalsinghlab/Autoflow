"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import { Menu, X, LogOut, ArrowRight } from "lucide-react";
import LoginModal from "@/components/modals/loginModal";
import SignUpModal from "@/components/modals/signUpModal";
import axiosInstance from "@/lib/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUsersList } from "../../src/store/userSlice";

// ============================================
// DESIGN SYSTEM
// ============================================

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

const RevealOnScroll = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px 0px -100px 0px",
  });

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.6, delay, ease: [0.2, 0.9, 0.4, 1.1] }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 15 },
      }}
    >
      {children}
    </motion.div>
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
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
        if (element) element.scrollIntoView({ behavior: "smooth" });
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
    <div className="bg-white text-[#11181C] font-sans antialiased overflow-x-hidden">
      {/* ============================================
      NAVBAR - Minimal, structural
      ============================================ */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 border-b border-[#E6E8EA]" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Text only */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="cursor-pointer"
              onClick={() => navigateTo("/")}
            >
              <span className="text-xl font-mono font-semibold tracking-tighter text-[#11181C]">
                autoflow<span className="text-[#FFC043]">/</span>
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => navigateTo(item.href, item.requireAuth)}
                  className="text-sm text-[#687076] hover:text-[#11181C] transition-colors duration-150 font-mono"
                >
                  {item.name.toLowerCase()}
                </button>
              ))}

              {!isLoggedIn ? (
                <div className="flex items-center gap-4 ml-4">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="text-sm text-[#687076] hover:text-[#11181C] transition-colors duration-150 font-mono"
                  >
                    sign_in
                  </button>
                  <button
                    onClick={() => setShowSignUpModal(true)}
                    className="bg-[#11181C] text-white px-5 py-1.5 text-sm font-mono hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150"
                  >
                    autoflow.run()
                  </button>
                </div>
              ) : (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm text-[#687076] hover:text-[#11181C] transition-colors duration-150 font-mono"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  exit
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#11181C] focus:outline-none"
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

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-[#E6E8EA]"
            >
              <div className="px-6 py-6 space-y-4">
                {navItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigateTo(item.href, item.requireAuth)}
                    className="block w-full text-left py-2 text-[#687076] hover:text-[#11181C] transition-colors font-mono"
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
                      className="block w-full text-left py-2 text-[#687076] hover:text-[#11181C] transition-colors font-mono"
                    >
                      sign_in
                    </button>
                    <button
                      onClick={() => {
                        setShowSignUpModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full mt-4 bg-[#11181C] text-white px-5 py-2.5 text-sm font-mono hover:bg-[#FFC043] hover:text-[#11181C] transition-all"
                    >
                      autoflow.run()
                    </button>
                  </>
                ) : (
                  <button
                    onClick={logout}
                    className="block w-full text-left py-2 text-[#687076] hover:text-[#11181C] transition-colors font-mono"
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
      SECTION 1: THE TERMINAL (HERO)
      ============================================ */}
      <header className="min-h-[85vh] flex items-center justify-center px-6 border-b border-[#E6E8EA]">
        <div className="max-w-5xl mx-auto text-center">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-sm font-mono mb-8 border border-[#E6E8EA]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
              AUTOFLOW v2.0 / READY
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1] mb-8">
              Automate your
              <br />
              <span className="text-[#1E2A3A] border-b-4 border-[#FFC043] inline-block">
                B2B pipeline.
              </span>
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <p className="text-xl text-[#687076] max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              Configure, enrich, and automate your outreach — from sourcing
              leads to personalized campaigns at scale.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowSignUpModal(true)}
                className="group bg-[#11181C] text-white px-8 py-3 font-mono text-sm hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150 flex items-center gap-2"
              >
                autoflow.run("start_trial")
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="text-[#687076] hover:text-[#11181C] transition-colors duration-150 font-mono text-sm">
                › view_demo
              </button>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.4}>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#687076]">
              <span>✓ no_credit_card_required</span>
              <span>✓ 14_day_trial</span>
              <span>✓ cancel_anytime</span>
            </div>
          </RevealOnScroll>
        </div>
      </header>

      {/* ============================================
      SECTION 2: THE CANVAS (PRODUCT INTERFACE)
      ============================================ */}
      <section className="py-32 px-6 border-b border-[#E6E8EA] bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <RevealOnScroll>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-[#1E2A3A] text-sm font-mono mb-8 border border-[#E6E8EA]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
                  INTERFACE
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-[1.2]">
                  Data isn't chaotic.
                  <br />
                  Your tools are.
                </h2>
                <p className="text-[#687076] text-lg leading-relaxed">
                  AutoFlow aggregates and normalizes signals from your entire
                  stack—CRM, support, product usage, and enrichment—into a
                  single source of truth.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="relative aspect-[16/10] bg-white shadow-xl border border-[#E6E8EA] overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-9 bg-[#F8F9FA] border-b border-[#E6E8EA] flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                  <div className="ml-4 font-mono text-[10px] text-[#687076]">
                    autoflow/dashboard — zsh
                  </div>
                </div>
                <div className="p-6 pt-12 bg-white h-full">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="border border-[#E6E8EA] p-4 bg-[#F8F9FA]">
                      <p className="font-mono text-[11px] text-[#687076] uppercase tracking-wider">
                        ACTIVE_DEALS
                      </p>
                      <p className="text-3xl font-bold mt-1 text-[#11181C]">
                        128
                      </p>
                    </div>
                    <div className="border border-[#E6E8EA] p-4 bg-[#F8F9FA]">
                      <p className="font-mono text-[11px] text-[#687076] uppercase tracking-wider">
                        VELOCITY
                      </p>
                      <p className="text-3xl font-bold mt-1 text-[#11181C]">
                        +23%
                      </p>
                    </div>
                    <div className="border border-[#E6E8EA] p-4 bg-[#F8F9FA]">
                      <p className="font-mono text-[11px] text-[#687076] uppercase tracking-wider">
                        SIGNALS
                      </p>
                      <p className="text-3xl font-bold mt-1 text-[#11181C]">
                        14.2k
                      </p>
                    </div>
                  </div>
                  <div className="border border-[#E6E8EA] p-4 bg-[#F8F9FA]">
                    <p className="font-mono text-[11px] text-[#687076] uppercase tracking-wider mb-3">
                      ACTIVITY_FEED
                    </p>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-[#E6E8EA]"></div>
                      <div className="h-2 w-5/6 bg-[#E6E8EA]"></div>
                      <div className="h-2 w-4/6 bg-[#E6E8EA]"></div>
                      <div className="h-2 w-3/6 bg-[#E6E8EA]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ============================================
      SECTION 3: THE WORKFLOW (Asymmetrical)
      ============================================ */}
      <section id="workflow" className="py-32 px-6 border-b border-[#E6E8EA]">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-28">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-sm font-mono mb-8 border border-[#E6E8EA]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
                PIPELINE
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                From raw signal to decisive action.
              </h2>
            </div>
          </RevealOnScroll>

          {/* Step 1 - Connect */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-36">
            <RevealOnScroll>
              <div className="lg:order-2">
                <p className="font-mono text-[#FFC043] text-6xl font-bold mb-5">
                  01_
                </p>
                <h3 className="text-3xl font-bold tracking-tight mb-4">
                  connect_your_data_sources
                </h3>
                <p className="text-[#687076] text-lg leading-relaxed mb-8">
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
                      className="px-2 py-1 border border-[#E6E8EA] text-[#1E2A3A] font-mono text-xs"
                    >
                      {source.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="lg:order-1 bg-[#1E2A3A] aspect-square w-full flex items-center justify-center text-white font-mono text-lg p-8 border border-[#E6E8EA]">
                <div className="text-center">
                  <div className="text-[#FFC043] text-4xl mb-4">↗︎</div>
                  <p className="text-sm opacity-70">DATA_INGEST</p>
                  <div className="mt-4 text-xs opacity-50">
                    40+ connected sources
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Step 2 - Enrich */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-36">
            <RevealOnScroll>
              <div>
                <p className="font-mono text-[#FFC043] text-6xl font-bold mb-5">
                  02_
                </p>
                <h3 className="text-3xl font-bold tracking-tight mb-4">
                  enrich_company_data
                </h3>
                <p className="text-[#687076] text-lg leading-relaxed mb-8">
                  Automatically fetch executive details, funding info, contact
                  emails, and phone numbers. Every profile becomes a complete
                  intelligence dossier.
                </p>
                <div className="bg-[#F8F9FA] p-5 border border-[#E6E8EA] font-mono text-sm">
                  <span className="text-[#FFC043]">→</span>{" "}
                  ENRICHED_1,247_COMPANIES_THIS_WEEK
                  <br />
                  <span className="text-[#687076] text-xs">
                    // 97.3% email accuracy
                  </span>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="bg-[#1E2A3A] aspect-square w-full flex items-center justify-center text-white font-mono text-lg p-8 border border-[#E6E8EA]">
                <div className="text-center">
                  <div className="text-[#FFC043] text-4xl mb-4">◉</div>
                  <p className="text-sm opacity-70">ENRICHMENT_ENGINE</p>
                  <div className="mt-4 text-xs opacity-50">
                    real-time data refresh
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Step 3 - Automate */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <RevealOnScroll>
              <div className="lg:order-2">
                <p className="font-mono text-[#FFC043] text-6xl font-bold mb-5">
                  03_
                </p>
                <h3 className="text-3xl font-bold tracking-tight mb-4">
                  outreach_on_autopilot
                </h3>
                <p className="text-[#687076] text-lg leading-relaxed mb-8">
                  Create smart campaigns with emails and voice drops. Schedule
                  follow-ups, and let automation handle the rest while you focus
                  on closing.
                </p>
                <div className="bg-[#F8F9FA] p-5 border border-[#E6E8EA] font-mono text-sm">
                  <span className="text-[#FFC043]">if</span> lead.score &gt; 85
                  <span className="text-[#FFC043]"> then</span>
                  <br />
                      
                  <span className="text-[#687076]">
                    // trigger: email → day3 → call → day7 → meeting
                  </span>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="lg:order-1 bg-[#1E2A3A] aspect-square w-full flex items-center justify-center text-white font-mono text-lg p-8 border border-[#E6E8EA]">
                <div className="text-center">
                  <div className="text-[#FFC043] text-4xl mb-4">▶</div>
                  <p className="text-sm opacity-70">AUTOMATION_ENGINE</p>
                  <div className="mt-4 text-xs opacity-50">
                    3,241 active campaigns
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ============================================
      SECTION 4: THE SIGNAL (Quantified Proof)
      ============================================ */}
      <section
        id="signal"
        className="py-32 px-6 bg-[#11181C] text-white border-b border-[#1E2A3A]"
      >
        <div className="max-w-4xl mx-auto text-center">
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E2A3A] text-[#FFC043] text-sm font-mono mb-8 border border-[#FFC043]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
              SIGNAL / NOISE RATIO
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.2] mb-10">
              "AutoFlow turned our data firehose into a precision instrument."
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-8 border-t border-[#1E2A3A]">
              <div>
                <p className="text-5xl font-bold text-[#FFC043]">3x</p>
                <p className="font-mono text-xs text-[#687076] mt-2 uppercase tracking-wider">
                  MORE_DEMOS_BOOKED
                </p>
                <p className="text-xs text-[#687076] mt-3 font-mono">
                  — Sasha V., BetaTech
                </p>
              </div>
              <div>
                <p className="text-5xl font-bold text-[#FFC043]">100+</p>
                <p className="font-mono text-xs text-[#687076] mt-2 uppercase tracking-wider">
                  HOURS_SAVED_PER_MONTH
                </p>
                <p className="text-xs text-[#687076] mt-3 font-mono">
                  — Michael C., TechFlow
                </p>
              </div>
              <div>
                <p className="text-5xl font-bold text-[#FFC043]">0</p>
                <p className="font-mono text-xs text-[#687076] mt-2 uppercase tracking-wider">
                  MANUAL_DATA_ENTRY
                </p>
                <p className="text-xs text-[#687076] mt-3 font-mono">
                  — Elena R., StartUpScale
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ============================================
      SECTION 5: THE CLI (Final CTA)
      ============================================ */}
      <section className="py-32 px-6 text-center">
        <RevealOnScroll>
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-sm font-mono mb-8 border border-[#E6E8EA]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
              DEPLOY
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              Ready to run a better system?
            </h2>

            <div className="flex items-center justify-center gap-2 font-mono text-xl md:text-2xl bg-[#F8F9FA] p-5 border border-[#E6E8EA] w-full max-w-2xl mx-auto my-10">
              <span className="text-[#687076]">$</span>
              <span>autoflow deploy --production</span>
              <BlinkingCursor />
            </div>

            <button
              onClick={() => setShowSignUpModal(true)}
              className="mt-8 bg-[#11181C] text-white px-12 py-4 font-mono text-sm hover:bg-[#FFC043] hover:text-[#11181C] transition-all duration-150"
            >
              autoflow.run("start_free_trial")
            </button>

            <p className="text-[#687076] font-mono text-xs mt-6">
              no_credit_card_required // 14_day_trial // cancel_anytime
            </p>
          </div>
        </RevealOnScroll>
      </section>

      {/* ============================================
      FOOTER
      ============================================ */}
      <footer className="py-16 px-6 border-t border-[#E6E8EA]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-mono text-lg text-[#11181C] mb-4">
                autoflow/<span className="text-[#FFC043]">systems</span>
              </div>
              <p className="text-sm text-[#687076] font-mono">
                Automate your B2B outreach and scale your sales process.
              </p>
            </div>
            <div>
              <h4 className="text-[#11181C] font-mono text-xs uppercase tracking-wider mb-4">
                PRODUCT
              </h4>
              <ul className="space-y-2 text-sm font-mono text-[#687076]">
                <li>
                  <button
                    onClick={() => navigateTo("#workflow")}
                    className="hover:text-[#11181C] transition"
                  >
                    pipeline
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/public/about")}
                    className="hover:text-[#11181C] transition"
                  >
                    about
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/public/contact")}
                    className="hover:text-[#11181C] transition"
                  >
                    contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#11181C] font-mono text-xs uppercase tracking-wider mb-4">
                LEGAL
              </h4>
              <ul className="space-y-2 text-sm font-mono text-[#687076]">
                <li>
                  <button
                    onClick={() => router.push("/public/privacy")}
                    className="hover:text-[#11181C] transition"
                  >
                    privacy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/public/terms")}
                    className="hover:text-[#11181C] transition"
                  >
                    terms
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#11181C] font-mono text-xs uppercase tracking-wider mb-4">
                STATUS
              </h4>
              <ul className="space-y-2 text-sm font-mono text-[#687076]">
                <li>
                  <a href="#" className="hover:text-[#11181C] transition">
                    api_status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#11181C] transition">
                    security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#E6E8EA] pt-8 text-center text-xs font-mono text-[#687076]">
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
