export default function Hero({ openSignup, navigateTo }) {
  return (
    <section className="relative min-h-screen pt-28">
      <div className="container-wide">
        <div className="max-w-5xl">
          <p className="editorial-label mb-10">SALES AUTOMATION PLATFORM</p>

          <h1 className="max-w-6xl text-[clamp(4.5rem,9vw,10rem)] leading-[0.84] tracking-[-0.06em]">
            Stop managing
            <br />
            sales workflows.
            <br />
            Start running
            <br />a system.
          </h1>

          <div className="mt-12 grid md:grid-cols-[420px_1fr] gap-16 items-end">
            <p className="text-lg text-muted leading-relaxed">
              Import leads. Enrich companies. Launch outreach. AutoFlow connects
              the entire process into one operational workflow.
            </p>

            <div className="flex md:justify-end gap-4">
              <button onClick={openSignup} className="btn-primary">
                Start Free Trial
              </button>

              <button
                onClick={() => navigateTo("/public/about")}
                className="btn-secondary"
              >
                About AutoFlow
              </button>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <div className="relative overflow-hidden rounded-[32px] border border-border bg-surface">
            <img
              src="/dashboard.png"
              alt="AutoFlow Dashboard"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl tracking-tight">50M+</div>
              <div className="text-sm text-muted mt-2">records enriched</div>
            </div>

            <div>
              <div className="text-3xl tracking-tight">3.4x</div>
              <div className="text-sm text-muted mt-2">
                more meetings booked
              </div>
            </div>

            <div>
              <div className="text-3xl tracking-tight">82%</div>
              <div className="text-sm text-muted mt-2">
                less manual research
              </div>
            </div>

            <div>
              <div className="text-3xl tracking-tight">24/7</div>
              <div className="text-sm text-muted mt-2">automated execution</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";

// import LoginModal from "@/components/modals/loginModal";
// import SignUpModal from "@/components/modals/signUpModal";

// import axiosInstance from "@/lib/axiosInstance";

// import { useDispatch, useSelector } from "react-redux";
// import { clearUser, setUsersList } from "../../src/store/userSlice";

// import Navbar from "@/components/landing/navbar";
// import Hero from "@/components/landing/hero";
// import Problem from "@/components/landing/problem";
// import Workflow from "@/components/landing/workflow";
// import Outcomes from "@/components/landing/outcomes";
// import Analytics from "@/components/landing/analytics";
// import Closing from "@/components/landing/closing";
// import Footer from "@/components/landing/footer";

// export default function LandingPage() {
//   const [showSignUpModal, setShowSignUpModal] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);

//   const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

//   const dispatch = useDispatch();
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage?.getItem("token");

//     if (!token) return;

//     axiosInstance
//       .get("/auth/all-users")
//       .then((res) => {
//         dispatch(setUsersList(res.data.users));
//       })
//       .catch(console.error);
//   }, [dispatch]);

//   const logout = useCallback(() => {
//     localStorage.clear();
//     dispatch(clearUser());
//     router.push("/");
//   }, [dispatch, router]);

//   const navigateTo = useCallback(
//     (url, requireAuth = false) => {
//       if (requireAuth) {
//         const token = localStorage?.getItem("token");

//         if (!token) {
//           setShowSignUpModal(true);
//           return;
//         }
//       }

//       if (url.startsWith("#")) {
//         document.querySelector(url)?.scrollIntoView({
//           behavior: "smooth",
//         });
//       } else {
//         router.push(url);
//       }
//     },
//     [router],
//   );

//   return (
//     <>
//       <main className="bg-background text-foreground">
//         <Navbar
//           isLoggedIn={isLoggedIn}
//           logout={logout}
//           navigateTo={navigateTo}
//           openLogin={() => setShowLoginModal(true)}
//           openSignup={() => setShowSignUpModal(true)}
//         />

//         <Hero
//           openSignup={() => setShowSignUpModal(true)}
//           navigateTo={navigateTo}
//         />

//         <Problem />

//         <Workflow />

//         <Outcomes />

//         <Analytics />

//         <Closing openSignup={() => setShowSignUpModal(true)} />

//         <Footer router={router} />
//       </main>

//       <SignUpModal
//         showModal={showSignUpModal}
//         onClose={() => setShowSignUpModal(false)}
//         onLoginClick={() => {
//           setShowSignUpModal(false);
//           setShowLoginModal(true);
//         }}
//       />

//       <LoginModal
//         showModal={showLoginModal}
//         onClose={() => setShowLoginModal(false)}
//         onSignUpClick={() => {
//           setShowLoginModal(false);
//           setShowSignUpModal(true);
//         }}
//       />
//     </>
//   );
// }
