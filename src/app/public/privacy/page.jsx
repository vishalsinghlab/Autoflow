"use client";

import { useEffect, useState } from "react";
import { Zap, ArrowLeft, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
            <Shield className="w-3 h-3" />
            Privacy
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            We don't sell your data
          </h1>

          <p className="text-gray-600">
            Simple as that. Here's how we handle the info you trust us with.
          </p>

          <p className="mt-4 text-sm text-gray-400">Updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content - plain and readable */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-3">1. What we collect</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                When you sign up, we ask for your email and name. If you use
                paid features, we collect billing info through our payment
                processor (we never see your full card details).
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mt-2">
                When you use AutoFlow, we store the leads and data you import.
                That's your data, not ours.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                2. How we use your info
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                <li>To keep AutoFlow running and improve it</li>
                <li>To send you login codes and important updates</li>
                <li>To bill you if you're on a paid plan</li>
                <li>To help when you contact support</li>
                <li>To prevent abuse and keep things secure</li>
              </ul>
              <p className="text-gray-600 text-sm leading-relaxed mt-2">
                That's it. No selling your data to random companies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. Security</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We take security seriously. Your data is encrypted, we use
                industry-standard practices, and we're careful about who has
                access. No system is 100% hack-proof, but we do our best.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                4. Cookies and tracking
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We use cookies to keep you logged in and remember your
                preferences. That's it. No creepy tracking across the internet.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                5. Third-party services
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We use other services to help run AutoFlow — like cloud hosting,
                email delivery, and payment processing. These companies only get
                the data they need to do their job, and they're not allowed to
                use it for anything else.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mt-2">
                We don't share your data with random third parties for marketing
                or anything like that.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                6. How long we keep stuff
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We keep your account data as long as you're using AutoFlow. If
                you delete your account, we'll remove your data within 30 days
                unless we need to keep it for legal reasons (like tax stuff).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Your rights</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                You can access, correct, or delete your data anytime through
                your account settings. If you want to export everything, just
                ask — we'll help.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mt-2">
                Depending on where you live, you might have additional privacy
                rights. Email us if you have questions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. Kids</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                AutoFlow is for businesses. If you're under 13, please don't
                sign up. We don't knowingly collect data from kids.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                9. Changes to this policy
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                If we make big changes to how we handle privacy, we'll let you
                know by email and update this page. Small changes just get
                updated here.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">10. Questions?</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Privacy questions, concerns, or just curious? Email us:
              </p>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-mono text-sm text-purple-600">
                  privacy@autoflow.com
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  We usually reply within a day or two.
                </p>
              </div>
            </section>

            {/* Simple summary box */}
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <h3 className="font-semibold text-purple-900 mb-2 text-sm">
                The TL;DR
              </h3>
              <p className="text-purple-800 text-sm">
                We don't sell your data. We only collect what we need to run the
                service. You own your information. Questions? Just ask.
              </p>
            </div>
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
