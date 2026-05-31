export default function Problem() {
  const steps = [
    "Import leads",
    "Research companies",
    "Find decision makers",
    "Verify contact data",
    "Write outreach",
    "Schedule follow-ups",
    "Update CRM",
  ];

  return (
    <section className="section-padding border-t border-border">
      <div className="container-wide">
        <div className="max-w-6xl">
          <p className="editorial-label mb-10">THE CURRENT WORKFLOW</p>

          <h2 className="text-[clamp(3rem,6vw,6rem)] leading-[0.9] tracking-[-0.04em] max-w-5xl">
            Most sales processes
            <br />
            aren't systems.
            <br />
            They're checklists.
          </h2>
        </div>

        <div className="mt-24">
          <div className="grid md:grid-cols-7 gap-4 items-center">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-4">
                <div className="px-5 py-4 border border-border rounded-full whitespace-nowrap">
                  {step}
                </div>

                {index !== steps.length - 1 && (
                  <div className="hidden md:block text-muted">→</div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-24 max-w-2xl ml-auto">
            <p className="text-2xl leading-relaxed">
              Every handoff creates friction. Every tool creates another step.
              Every step creates another place for momentum to disappear.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
