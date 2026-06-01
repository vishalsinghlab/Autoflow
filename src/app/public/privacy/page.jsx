import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | AutoFlow",
  description:
    "Learn how AutoFlow collects, uses, and protects your information.",
};

const sections = [
  {
    title: "information_we_collect",
    content: [
      "We collect information that you provide directly to us, including account information, contact details, billing information, and communications with our team.",
      "We may also collect information about how you use the platform, including workflow activity, campaign performance, integrations, and device information.",
    ],
  },
  {
    title: "how_we_use_information",
    content: [
      "We use collected information to operate, maintain, improve, and secure AutoFlow.",
      "Information may also be used to provide customer support, process transactions, communicate updates, and develop new features.",
    ],
  },
  {
    title: "data_enrichment_services",
    content: [
      "AutoFlow may enrich company and contact records using third-party data providers.",
      "Users are responsible for ensuring that their use of enriched data complies with applicable laws and regulations in their jurisdiction.",
    ],
  },
  {
    title: "information_sharing",
    content: [
      "We do not sell personal information.",
      "Information may be shared with trusted service providers that help us operate the platform, process payments, deliver communications, or provide infrastructure services.",
    ],
  },
  {
    title: "data_security",
    content: [
      "We implement administrative, technical, and organizational safeguards designed to protect customer information.",
      "While no system can guarantee absolute security, we continuously monitor and improve our security practices.",
    ],
  },
  {
    title: "data_retention",
    content: [
      "We retain information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce agreements.",
    ],
  },
  {
    title: "your_rights",
    content: [
      "Depending on your location, you may have rights related to access, correction, deletion, portability, or restriction of your personal information.",
      "Requests can be submitted through our support team.",
    ],
  },
  {
    title: "third_party_services",
    content: [
      "AutoFlow integrates with external platforms and services. Their privacy practices are governed by their own policies.",
    ],
  },
  {
    title: "policy_updates",
    content: [
      "We may update this Privacy Policy periodically. Material changes will be communicated through appropriate channels.",
    ],
  },
  {
    title: "contact",
    content: [
      "Questions regarding this Privacy Policy may be directed to privacy@autoflow.com.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#E6E8EA]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-[#687076] hover:text-[#11181C] transition-colors duration-150 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-150" />
            <span>back()</span>
          </Link>
        </div>
      </div>
      {/* Hero Section */}
      <section className="border-b border-[#E6E8EA]">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-8 border border-[#E6E8EA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
            AUTOFLOW / LEGAL
          </div>

          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]">
              privacy_policy
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
                This Privacy Policy explains how AutoFlow collects, uses,
                stores, and protects information when you use our platform.
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
            <span>questions@privacy@autoflow.com</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs font-mono text-[#687076]">
            <span className="text-[#FFC043]">$</span>
            <span>autoflow --privacy-policy --version 1.0</span>
          </div>
        </div>
      </section>
    </main>
  );
}
