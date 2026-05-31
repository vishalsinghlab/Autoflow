const workflow = [
  {
    label: "RAW DATA",
    title: "Bring your pipeline together.",
    description:
      "Spreadsheets, LinkedIn, Crunchbase, NASDAQ, YC and internal systems become one source of truth.",
    image: "/connect.png",
  },
  {
    label: "CONTEXT",
    title: "Turn records into opportunities.",
    description:
      "AutoFlow enriches companies and contacts with the information sales teams actually need.",
    image: "/enrich.png",
  },
  {
    label: "ACTION",
    title: "Launch outreach that keeps moving.",
    description:
      "Campaigns continue automatically while your team focuses on conversations instead of administration.",
    image: "/activate.png",
  },
];

export default function Workflow() {
  return (
    <section className="border-t border-border">
      {workflow.map((item, index) => (
        <section
          key={item.label}
          className="py-32 lg:py-40 border-b border-border"
        >
          <div className="container-wide">
            <div className="grid lg:grid-cols-12 gap-20 items-center">
              <div className="lg:col-span-4">
                <div className="sticky top-32">
                  <p className="editorial-label mb-8">{item.label}</p>

                  <h2 className="text-[clamp(3rem,5vw,5rem)] leading-[0.92] tracking-[-0.04em]">
                    {item.title}
                  </h2>

                  <p className="mt-8 text-lg text-muted max-w-md leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-12 text-sm text-muted">0{index + 1}</div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="overflow-hidden rounded-[28px] border border-border bg-surface">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </section>
  );
}
