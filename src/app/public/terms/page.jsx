// app/terms/page.tsx
import { ArrowLeft, Scale, FileText, Shield, Zap } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | AutoFlow",
  description:
    "Terms and conditions governing the use of the AutoFlow platform.",
};

const sections = [
  {
    title: "agreement_to_terms",
    content: [
      "By accessing or using AutoFlow, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
      "If you do not agree with any part of these terms, you may not access or use the platform.",
    ],
  },
  {
    title: "use_of_the_platform",
    content: [
      "AutoFlow provides tools for lead management, company enrichment, workflow automation, campaign execution, and analytics.",
      "You agree to use the platform only for lawful business purposes and in compliance with all applicable regulations.",
    ],
  },
  {
    title: "account_responsibilities",
    content: [
      "You are responsible for maintaining the security of your account credentials and for all activities that occur under your account.",
      "You must provide accurate information when creating an account and keep that information up to date.",
    ],
  },
  {
    title: "data_and_compliance",
    content: [
      "You are responsible for ensuring that your collection, storage, and use of prospect data complies with applicable privacy, marketing, and communications laws.",
      "AutoFlow is a software platform and does not provide legal advice regarding compliance obligations.",
    ],
  },
  {
    title: "acceptable_use",
    content: [
      "You may not use the platform to engage in unlawful, fraudulent, deceptive, harmful, or abusive activities.",
      "You may not attempt to interfere with the security, integrity, or availability of the platform.",
    ],
  },
  {
    title: "third_party_services",
    content: [
      "AutoFlow may integrate with third-party platforms, data providers, communication tools, and external services.",
      "Your use of those services may be subject to additional terms and policies provided by the respective providers.",
    ],
  },
  {
    title: "subscription_and_billing",
    content: [
      "Certain features of AutoFlow may require a paid subscription.",
      "Subscription fees, billing cycles, and renewal terms will be communicated at the time of purchase.",
      "Unless otherwise stated, fees are non-refundable.",
    ],
  },
  {
    title: "intellectual_property",
    content: [
      "AutoFlow and its associated content, software, trademarks, branding, and materials are protected by applicable intellectual property laws.",
      "You may not copy, distribute, modify, reverse engineer, or create derivative works without prior written permission.",
    ],
  },
  {
    title: "service_availability",
    content: [
      "We strive to maintain reliable service availability but do not guarantee uninterrupted access.",
      "Maintenance, updates, technical issues, or external factors may occasionally affect service performance.",
    ],
  },
  {
    title: "limitation_of_liability",
    content: [
      "To the maximum extent permitted by law, AutoFlow shall not be liable for indirect, incidental, consequential, special, or punitive damages arising from the use of the platform.",
      "Our total liability shall not exceed the amount paid by you for the service during the twelve months preceding the claim.",
    ],
  },
  {
    title: "termination",
    content: [
      "We reserve the right to suspend or terminate access to the platform if these terms are violated or if continued access presents legal, operational, or security risks.",
      "You may stop using the service and close your account at any time.",
    ],
  },
  {
    title: "changes_to_these_terms",
    content: [
      "We may update these Terms of Service periodically.",
      "Continued use of the platform after changes become effective constitutes acceptance of the revised terms.",
    ],
  },
  {
    title: "contact_information",
    content: [
      "Questions regarding these Terms of Service may be directed to legal@autoflow.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-black selection:text-white">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[13px] tracking-wide text-neutral-500 hover:text-black transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-mono text-[11px] tracking-wider">RETURN</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 pt-24 pb-20">
          <div className="flex flex-col gap-16">
            {/* Hero Content */}
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-8 h-px bg-black/20"></div>
                <span className="text-[11px] tracking-[0.2em] font-mono text-neutral-400 uppercase">
                  Legal Framework
                </span>
              </div>

              <h1 className="text-7xl md:text-8xl lg:text-9xl font-light tracking-tighter leading-[0.95] text-black mb-8">
                Terms of
                <br />
                <span className="font-medium">Service</span>
              </h1>

              <div className="flex flex-wrap gap-8 text-sm text-neutral-500 border-t border-black/10 pt-8">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-wider">
                    VERSION
                  </span>
                  <span className="font-mono text-black">1.0.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-wider">
                    EFFECTIVE
                  </span>
                  <span className="font-mono text-black">JAN 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-wider">
                    LAST UPDATED
                  </span>
                  <span className="font-mono text-black">JAN 2026</span>
                </div>
              </div>
            </div>

            {/* Stat Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/5">
              <div className="bg-white p-8">
                <div className="text-3xl font-light text-black mb-2">13</div>
                <div className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
                  Articles
                </div>
              </div>
              <div className="bg-white p-8">
                <div className="text-3xl font-light text-black mb-2">
                  ~2,500
                </div>
                <div className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
                  Words
                </div>
              </div>
              <div className="bg-white p-8">
                <div className="text-3xl font-light text-black mb-2">5 min</div>
                <div className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
                  Read time
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Quote */}
      <section className="border-t border-black/5">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="max-w-3xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-black/40" />
                </div>
              </div>
              <div>
                <p className="text-xl md:text-2xl leading-relaxed text-neutral-600 font-light italic">
                  &ldquo;These Terms govern access to and use of the AutoFlow
                  platform, products, and services. By using AutoFlow, you enter
                  into a binding agreement with us.&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <div className="h-px w-8 bg-black/20"></div>
                  <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase">
                    Binding Agreement
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="border-t border-black/5 bg-neutral-50/30">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
              <div className="sticky top-24">
                <div className="mb-8">
                  <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase block mb-4">
                    Contents
                  </span>
                  <div className="w-12 h-px bg-black/20"></div>
                </div>
                <nav className="space-y-1">
                  {sections.map((section, idx) => (
                    <a
                      key={section.title}
                      href={`#${section.title}`}
                      className="block py-2 text-[13px] text-neutral-500 hover:text-black transition-colors duration-200 font-mono tracking-wide"
                    >
                      {idx + 1}. {section.title.replace(/_/g, " ")}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              <div className="space-y-20">
                {sections.map((section, idx) => (
                  <article
                    key={section.title}
                    id={section.title}
                    className="scroll-mt-24"
                  >
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl font-light text-black/20 tabular-nums">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="h-px flex-1 bg-black/10"></div>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-black mb-3">
                        {section.title.replace(/_/g, " ")}
                      </h2>
                      <div className="w-16 h-px bg-black/30"></div>
                    </div>

                    <div className="space-y-5 pl-4 md:pl-8">
                      {section.content.map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-base leading-relaxed text-neutral-600"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-black/5 bg-black">
        <div className="max-w-7xl mx-auto px-8 py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm mb-8">
              <Shield className="w-3 h-3 text-white/40" />
              <span className="text-[10px] tracking-[0.2em] font-mono text-white/60 uppercase">
                Questions & Contact
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white mb-6">
              Need clarification on our terms?
            </h3>
            <p className="text-white/60 text-base leading-relaxed mb-12 max-w-xl mx-auto">
              Our legal team is available to answer any questions about these
              Terms of Service or your specific use case.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:legal@autoflow.com"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-sm font-mono tracking-wide hover:bg-neutral-100 transition-colors duration-200"
              >
                <span>legal@autoflow.com</span>
              </a>
              <a
                href="/public/privacy"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white/80 text-sm font-mono tracking-wide hover:bg-white/5 transition-colors duration-200"
              >
                <span>Privacy Policy</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-neutral-50/30">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 text-[11px] font-mono tracking-wider text-neutral-400">
              <span>© 2026 AutoFlow</span>
              <span className="w-px h-3 bg-black/20"></span>
              <span>All rights reserved</span>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="/public/about"
                className="text-[11px] font-mono tracking-wider text-neutral-500 hover:text-black transition-colors"
              >
                ABOUT
              </a>
              <a
                href="/public/privacy"
                className="text-[11px] font-mono tracking-wider text-neutral-500 hover:text-black transition-colors"
              >
                PRIVACY
              </a>
              <a
                href="/public/contact"
                className="text-[11px] font-mono tracking-wider text-neutral-500 hover:text-black transition-colors"
              >
                CONTACT
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
