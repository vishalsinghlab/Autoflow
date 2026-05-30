"use client";

import { useEffect, useState } from "react";
import {
  Zap,
  Target,
  Rocket,
  Shield,
  Users,
  TrendingUp,
  Globe,
  ArrowRight,
  ArrowLeft,
  Coffee,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const values = [
    {
      icon: Rocket,
      title: "Automation first",
      description:
        "Repetitive work should be automated so teams can focus on what matters.",
    },
    {
      icon: Users,
      title: "Actually listen",
      description:
        "Every feature comes from customer requests. We read every email.",
    },
    {
      icon: Shield,
      title: "Keep it safe",
      description:
        "Security and privacy aren't afterthoughts. They're how we build.",
    },
    {
      icon: TrendingUp,
      title: "Results matter",
      description:
        "We care about what actually works, not what looks good on paper.",
    },
  ];

  const stats = [
    { value: "50M+", label: "leads processed" },
    { value: "1,000+", label: "companies" },
    { value: "3x", label: "avg pipeline growth" },
    { value: "99.9%", label: "uptime" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Simple navbar */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-white shadow-sm"
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

      {/* Hero - simpler */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
            <Zap className="w-3 h-3" />
            About us
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            We build tools that
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              actually help
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            AutoFlow started because existing outreach tools were either too
            basic or needlessly complicated. We're fixing that.
          </p>
        </div>
      </section>

      {/* Story - more conversational */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The short version</h2>
            <p className="text-gray-600">
              We saw a problem and decided to build something better.
            </p>
          </div>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>
              Sales teams were spending way too much time on manual research.
              Finding leads, enriching data, setting up sequences — it was
              eating into the time they could actually spend selling.
            </p>

            <p>
              The tools out there? Either too simple to be useful or so complex
              you needed a consultant to set them up.
            </p>

            <p>
              So we built AutoFlow. One place to find leads, enrich data, and
              automate outreach. No fluff. Just stuff that works.
            </p>
          </div>

          <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100">
            <Globe className="w-10 h-10 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Our mission</h3>
            <p className="text-gray-600">
              Make good sales automation tools that don't require a PhD to use.
            </p>
          </div>
        </div>
      </section>

      {/* Stats - simpler */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values - less polished */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How we think</h2>
            <p className="text-gray-600">
              Not corporate mission statement stuff. Just how we actually work.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple team section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Small team, big impact</h2>
          <p className="text-gray-600 mb-8">
            We're a remote team of 12 people spread across 4 time zones. We
            communicate a lot, ship fast, and actually like each other.
          </p>

          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                AC
              </div>
              <p className="font-medium text-sm">Alex Chen</p>
              <p className="text-gray-500 text-xs">Co-founder</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                SJ
              </div>
              <p className="font-medium text-sm">Sarah Jenkins</p>
              <p className="text-gray-500 text-xs">Co-founder</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                MR
              </div>
              <p className="font-medium text-sm">Marcus R.</p>
              <p className="text-gray-500 text-xs">Head of Product</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                PK
              </div>
              <p className="font-medium text-sm">Priya K.</p>
              <p className="text-gray-500 text-xs">Lead Engineer</p>
            </div>
          </div>

          <p className="text-gray-500 text-sm mt-8">
            We're hiring! →
            <button className="text-purple-600 hover:text-purple-700 ml-1">
              Join the team
            </button>
          </p>
        </div>
      </section>

      {/* CTA - simpler, less flashy */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">
              Want to see for yourself?
            </h2>
            <p className="text-purple-100 mb-6">
              No demo required. Just sign up and try it.
            </p>
            <button
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:shadow-md transition-all"
              onClick={() => router.push("/signup")}
            >
              Start free trial
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-purple-100 text-xs mt-4">
              Takes 2 minutes. No credit card needed.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>© 2025 AutoFlow. Built with ☕️ and 🎧.</p>
        </div>
      </footer>
    </div>
  );
}
