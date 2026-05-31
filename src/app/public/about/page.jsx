export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-[#E6E8EA]">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-8 border border-[#E6E8EA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
            AUTOFLOW / ABOUT
          </div>

          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1]">
              Sales teams don't need more tools.
              <br />
              <span className="text-[#1E2A3A] border-b-4 border-[#FFC043] inline-block mt-2">
                They need fewer manual steps.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg text-[#687076] font-mono leading-relaxed">
              AutoFlow was built to reduce the operational work that slows
              modern outbound teams. Import data, enrich companies, and launch
              campaigns from a single workflow.
            </p>
          </div>
        </div>
      </section>

      {/* Why We Built It */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-24">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-8 border border-[#E6E8EA]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
              ORIGIN_STORY
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.2]">
              Most outbound systems are collections of disconnected tools.
            </h2>
          </div>

          <div className="space-y-6">
            <p className="text-lg text-[#687076] font-mono leading-relaxed">
              Teams spend hours moving information between spreadsheets,
              enrichment providers, CRMs, email platforms, and reporting
              systems.
            </p>

            <p className="text-lg text-[#687076] font-mono leading-relaxed">
              The result is fragmented workflows, inconsistent data, and less
              time spent actually talking to customers.
            </p>

            <div className="pt-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#687076]">
                <span className="text-[#FFC043]">→</span>
                <span>inefficiency_detected // solution_required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem - Numbered List */}
      <section className="border-y border-[#E6E8EA]">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-16 border border-[#E6E8EA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
            CORE_PROBLEMS
          </div>

          <div className="space-y-12">
            {[
              {
                number: "01",
                title: "lead_research_is_repetitive",
                description:
                  "Teams waste hours manually searching for prospect information across multiple platforms.",
              },
              {
                number: "02",
                title: "data_becomes_outdated_quickly",
                description:
                  "Contact information changes frequently, leaving databases inaccurate within weeks.",
              },
              {
                number: "03",
                title: "campaign_execution_rarely_scales",
                description:
                  "Manual processes break when moving from dozens to hundreds of prospects.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="grid grid-cols-[100px_1fr] gap-8 border-b border-[#E6E8EA] pb-8 last:border-0"
              >
                <div>
                  <span className="text-sm font-mono text-[#FFC043] font-bold">
                    {item.number}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-mono font-semibold text-[#11181C] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm font-mono text-[#687076]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Workflow - 3 Steps */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-16 border border-[#E6E8EA]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
          AUTOMATION_PIPELINE
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-mono font-bold text-[#FFC043]">
                01
              </span>
              <span className="text-xs font-mono text-[#687076] uppercase tracking-wider">
                STEP
              </span>
            </div>
            <h3 className="text-xl font-mono font-semibold text-[#11181C] mb-3">
              connect()
            </h3>
            <p className="text-sm font-mono text-[#687076] leading-relaxed">
              Import prospects from spreadsheets, LinkedIn, Crunchbase, NASDAQ,
              and other sources.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-mono font-bold text-[#FFC043]">
                02
              </span>
              <span className="text-xs font-mono text-[#687076] uppercase tracking-wider">
                STEP
              </span>
            </div>
            <h3 className="text-xl font-mono font-semibold text-[#11181C] mb-3">
              enrich()
            </h3>
            <p className="text-sm font-mono text-[#687076] leading-relaxed">
              Automatically gather executive information, funding data, contact
              emails, and phone numbers.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-mono font-bold text-[#FFC043]">
                03
              </span>
              <span className="text-xs font-mono text-[#687076] uppercase tracking-wider">
                STEP
              </span>
            </div>
            <h3 className="text-xl font-mono font-semibold text-[#11181C] mb-3">
              execute()
            </h3>
            <p className="text-sm font-mono text-[#687076] leading-relaxed">
              Launch personalized campaigns and automate follow-ups across
              channels.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#E6E8EA]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#687076]">
            <span className="text-[#FFC043]">→</span>
            <span>pipeline_ready // 3_steps_to_automation</span>
          </div>
        </div>
      </section>

      {/* Product Principles */}
      <section className="border-y border-[#E6E8EA]">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-16 border border-[#E6E8EA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
            DESIGN_PRINCIPLES
          </div>

          <div className="space-y-12 max-w-4xl">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-[#FFC043]">→</span>
                <h3 className="text-xl font-mono font-semibold text-[#11181C]">
                  automation_should_remain_understandable()
                </h3>
              </div>
              <p className="text-sm font-mono text-[#687076] ml-5">
                Users should always know what happens next.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-[#FFC043]">→</span>
                <h3 className="text-xl font-mono font-semibold text-[#11181C]">
                  data_should_arrive_ready_to_use()
                </h3>
              </div>
              <p className="text-sm font-mono text-[#687076] ml-5">
                No exporting, cleaning, or reformatting.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-[#FFC043]">→</span>
                <h3 className="text-xl font-mono font-semibold text-[#11181C]">
                  scale_should_not_increase_complexity()
                </h3>
              </div>
              <p className="text-sm font-mono text-[#687076] ml-5">
                More leads should not create more operational work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Statement */}
      <section className="max-w-7xl mx-auto px-6 py-40">
        <div className="max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8F9FA] text-[#1E2A3A] text-xs font-mono mb-8 border border-[#E6E8EA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043]"></span>
            MISSION_STATEMENT
          </div>
          <p className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] text-[#11181C]">
            AutoFlow exists to remove the operational friction between finding a
            prospect and starting a conversation.
          </p>
          <div className="mt-8 flex items-center gap-2 text-sm font-mono text-[#687076]">
            <span className="text-[#FFC043]">$</span>
            <span>autoflow --mission</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC043] animate-pulse"></span>
          </div>
        </div>
      </section>
    </main>
  );
}
