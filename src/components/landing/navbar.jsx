"use client";

import { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";

export default function Navbar({
  isLoggedIn,
  logout,
  navigateTo,
  openLogin,
  openSignup,
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const listener = () => setScrolled(window.scrollY > 10);

    window.addEventListener("scroll", listener);

    return () => window.removeEventListener("scroll", listener);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b border-border transition-all ${
        scrolled ? "bg-background/80 backdrop-blur-md" : "bg-background"
      }`}
    >
      <div className="container-wide">
        <div className="flex h-20 items-center justify-between">
          <button
            onClick={() => navigateTo("/")}
            className="text-lg font-semibold tracking-tight"
          >
            AutoFlow
          </button>

          <div className="hidden md:flex items-center gap-10">
            <button onClick={() => navigateTo("#workflow")}>Workflow</button>

            <button onClick={() => navigateTo("#analytics")}>Analytics</button>

            <button onClick={() => navigateTo("/public/about")}>About</button>
          </div>

          <div className="hidden md:flex">
            {!isLoggedIn ? (
              <div className="flex gap-3">
                <button onClick={openLogin} className="btn-secondary">
                  Sign In
                </button>

                <button onClick={openSignup} className="btn-primary">
                  Request Access
                </button>
              </div>
            ) : (
              <button
                onClick={logout}
                className="btn-secondary flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            )}
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
