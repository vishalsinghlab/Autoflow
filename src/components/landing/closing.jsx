export default function Closing({ openSignup }) {
  return (
    <section className="py-56 border-t border-border">
      <div className="container-wide">
        <div className="max-w-5xl">
          <h2 className="text-[clamp(4rem,8vw,8rem)] leading-[0.88]">
            Build a sales engine
            <br />
            that keeps moving.
          </h2>

          <p className="mt-10 text-xl text-muted max-w-xl">
            Stop stitching together tools. Create one system that finds,
            enriches and activates prospects.
          </p>

          <button onClick={openSignup} className="btn-primary mt-12">
            Request Access
          </button>
        </div>
      </div>
    </section>
  );
}
