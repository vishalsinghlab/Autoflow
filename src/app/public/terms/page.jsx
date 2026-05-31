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
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-[#E6E8EA]">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-8 border border-[#E6E8EA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
            AUTOFLOW / LEGAL
          </div>

          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]">
              terms_of_service
              <br />
              <span className="text-[#1E2A3A] border-b-4 border-[#FFC043] inline-block mt-2">
                v1.0
              </span>
            </h1>

            <div className="mt-8 space-y-2">
              <p className="text-sm font-mono text-[#687076]">
                effective_date: January 1, 2026
              </p>
              <p className="text-lg text-[#687076] font-mono leading-relaxed max-w-2xl">
                These Terms of Service govern access to and use of the AutoFlow
                platform, products, and services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-3xl">
          <div className="space-y-16">
            {sections.map((section, idx) => (
              <div
                key={section.title}
                className="scroll-mt-24"
                id={section.title}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-mono text-[#FFC043] font-bold">
                    {(idx + 1).toString().padStart(2, "0")}
                  </span>
                  <h2 className="text-xl md:text-2xl font-mono font-semibold text-[#11181C]">
                    {section.title}()
                  </h2>
                </div>

                <div className="space-y-4 ml-6 border-l-2 border-[#E6E8EA] pl-6">
                  {section.content.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm font-mono text-[#687076] leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="max-w-3xl mt-20 pt-8 border-t border-[#E6E8EA]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#687076]">
            <span className="text-[#FFC043]">→</span>
            <span>questions@legal@autoflow.com</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs font-mono text-[#687076]">
            <span className="text-[#FFC043]">$</span>
            <span>autoflow --terms-of-service --version 1.0</span>
          </div>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="border-t border-[#E6E8EA]">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-8 border border-[#E6E8EA]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
              CORE_PROMISE
            </div>
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-[1.2] text-[#11181C]">
              Our goal is to provide reliable automation infrastructure while
              maintaining transparency, security, and responsible use.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-mono text-[#687076]">
              <span className="text-[#FFC043]">$</span>
              <span>autoflow --core-values</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043] animate-pulse"></span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
