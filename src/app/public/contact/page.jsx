import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contact | AutoFlow",
  description:
    "Contact the AutoFlow team for sales, support, partnerships, and enterprise inquiries.",
};

const contacts = [
  {
    label: "sales",
    description:
      "Product demos, pricing discussions, and enterprise evaluations.",
    email: "sales@autoflow.com",
  },
  {
    label: "support",
    description:
      "Technical issues, account assistance, and platform questions.",
    email: "support@autoflow.com",
  },
  {
    label: "partnerships",
    description:
      "Integrations, strategic partnerships, and collaboration opportunities.",
    email: "partners@autoflow.com",
  },
];

export default function ContactPage() {
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
            AUTOFLOW / CONTACT
          </div>

          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]">
              <span className="text-[#1E2A3A] border-b-4 border-[#FFC043] inline-block">
                Let's talk.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg text-[#687076] font-mono leading-relaxed">
              Questions, partnerships, support, or enterprise requirements.
              Reach out and we'll point you in the right direction.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Channels */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-12 border border-[#E6E8EA]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
          COMMUNICATION_CHANNELS
        </div>

        <div className="space-y-0">
          {contacts.map((item, index) => (
            <div
              key={item.label}
              className="grid md:grid-cols-[180px_1fr_auto] gap-6 border-b border-[#E6E8EA] py-8 first:pt-0 last:border-0"
            >
              <div>
                <h2 className="text-base font-mono font-semibold text-[#11181C]">
                  {item.label}()
                </h2>
              </div>

              <p className="text-sm font-mono text-[#687076] leading-relaxed max-w-xl">
                {item.description}
              </p>

              <a
                href={`mailto:${item.email}`}
                className="text-sm font-mono text-[#FFC043] hover:text-[#11181C] transition-colors duration-150 group flex items-center gap-1"
              >
                {item.email}
                <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                  →
                </span>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-[#E6E8EA]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#687076]">
            <span className="text-[#FFC043]">→</span>
            <span>all_inquiries_handled_within_24h</span>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="border-y border-[#E6E8EA]">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-8 border border-[#E6E8EA]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
                ENTERPRISE
              </div>

              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.2]">
                Need a custom workflow?
              </h2>
            </div>

            <div className="space-y-4">
              {[
                "large_prospect_datasets",
                "custom_enrichment_pipelines",
                "dedicated_onboarding",
                "private_infrastructure_requirements",
                "team_wide_workflow_design",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-[#FFC043] font-mono text-sm">→</span>
                  <span className="text-sm font-mono text-[#687076]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-8 border border-[#E6E8EA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
            RESPONSE_TIMEFRAME
          </div>

          <p className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1] text-[#11181C]">
            We usually respond within one business day.
          </p>

          <div className="mt-8 space-y-4">
            <p className="text-sm font-mono text-[#687076] leading-relaxed">
              If your request is urgent, include relevant details about your
              company, team size, and workflow requirements so we can respond
              more effectively.
            </p>

            <div className="pt-4 flex items-center gap-2 text-xs font-mono text-[#687076]">
              <span className="text-[#FFC043]">$</span>
              <span>autoflow --contact support@autoflow.com</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043] animate-pulse"></span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
