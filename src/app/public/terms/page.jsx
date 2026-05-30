"use client";

import { useEffect, useState } from "react";
import { Zap, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const lastUpdated = "May 31, 2026";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
            Legal stuff
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Terms & Conditions
          </h1>

          <p className="text-gray-600">The boring but important stuff.</p>

          <p className="mt-4 text-sm text-gray-400">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content - plain and readable */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-3">1. Using AutoFlow</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                By using AutoFlow, you agree to these terms. If you don't agree,
                don't use the service. Simple.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. What you can do</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                AutoFlow helps you find leads, enrich data, and automate
                outreach. Use it for legitimate business purposes. Don't be
                shady.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                We're serious about that last part.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. Your account</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                <li>Keep your password safe</li>
                <li>Don't share your account</li>
                <li>Tell us if something looks wrong</li>
                <li>You're responsible for what happens under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                4. Don't do these things
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                <li>Use AutoFlow for anything illegal</li>
                <li>Send spam or malicious stuff</li>
                <li>Try to break into our systems</li>
                <li>Copy our code or design</li>
                <li>Be a jerk, basically</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. Money stuff</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Some features cost money. We'll tell you how much before you
                pay. Subscriptions renew automatically unless you cancel. You
                can cancel anytime in your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. Who owns what</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                AutoFlow owns AutoFlow. Our code, design, logos, and technology
                belong to us. You own your data and anything you create with the
                platform. We don't claim ownership of your stuff.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Privacy</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We care about your privacy. Our{" "}
                <button className="text-purple-600 hover:underline">
                  Privacy Policy
                </button>{" "}
                explains how we handle your data. By using AutoFlow, you agree
                to that too.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. Uptime</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We try really hard to keep AutoFlow running smoothly. But
                sometimes things break, need maintenance, or the internet just
                has a bad day. We don't guarantee 100% uptime, but we'll do our
                best.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">9. Liability</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                To the extent allowed by law, AutoFlow isn't liable for any
                damages caused by using (or not being able to use) the service.
                If you have a problem, your main remedy is to stop using
                AutoFlow.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mt-2">
                Basically, we're not responsible if you don't hit your sales
                quota.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">10. No warranties</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We provide AutoFlow "as is" and "as available." No promises that
                it'll be perfect or bug-free. That said, we test things and fix
                issues when we find them.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">11. Ending things</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We can suspend or terminate your account if you violate these
                terms or if you're using AutoFlow in a way that harms others.
                You can cancel anytime through your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                12. Changes to these terms
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We might update these terms occasionally. We'll post changes
                here and update the date. If it's a big change, we'll try to
                notify you directly. Continuing to use AutoFlow after changes
                means you accept the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">13. Where this applies</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                These terms are governed by California law. If there's a
                dispute, we'd rather talk it out than go to court. But if it
                comes to that, it'll be in San Francisco.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">14. Questions?</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                If you have questions about these terms, email us at:
              </p>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-mono text-sm text-purple-600">
                  legal@autoflow.com
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  We'll get back to you within a few days.
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* Simple footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>© 2025 AutoFlow. Built with ☕️ and 🎧.</p>
        </div>
      </footer>
    </div>
  );
}
