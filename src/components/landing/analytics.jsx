export default function Analytics() {
  return (
    <section id="analytics" className="section-padding border-t border-border">
      <div className="container-wide">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4">
            <p className="editorial-label">VISIBILITY</p>

            <h2 className="mt-6 text-6xl">Every workflow leaves a trail.</h2>

            <p className="mt-8 text-muted text-lg">
              Know what was sourced, enriched and activated.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="screenshot-frame">
              <img src="/analytics.png" alt="Analytics" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
