export default function Footer({ router }) {
  return (
    <footer className="border-t border-border py-12">
      <div className="container-wide flex flex-col md:flex-row justify-between gap-8">
        <div>
          <div className="font-semibold">AutoFlow</div>

          <div className="text-sm text-muted mt-2">
            Sales workflow automation.
          </div>
        </div>

        <div className="flex gap-8 text-sm">
          <button onClick={() => router.push("/public/about")}>About</button>

          <button onClick={() => router.push("/public/contact")}>
            Contact
          </button>

          <button onClick={() => router.push("/public/privacy")}>
            Privacy
          </button>

          <button onClick={() => router.push("/public/terms")}>Terms</button>
        </div>
      </div>
    </footer>
  );
}
