"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  ArrowRight,
  CheckCircle,
  Zap,
  ArrowLeft,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@autoflow.com",
      description: "For questions and partnerships",
    },
    {
      icon: Phone,
      title: "Sales",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri, 9am-5pm PT",
    },
    {
      icon: MessageSquare,
      title: "Support",
      value: "support@autoflow.com",
      description: "We reply within hours",
    },
  ];

  const faqs = [
    {
      question: "How fast do you respond?",
      answer:
        "Usually within a few hours during business days. Weekends might take a bit longer.",
    },
    {
      question: "Can I get a demo?",
      answer:
        "Yep. Just fill out the form and mention 'demo' - someone will reach out to schedule.",
    },
    {
      question: "Do you work with enterprises?",
      answer:
        "Absolutely. We have custom plans for bigger teams. Email us and we'll figure it out.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "14 days, no credit card required. Enough time to see if it works for you.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Simple navbar */}
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => router.push("/")}
            >
              <Zap className="w-7 h-7 text-purple-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AutoFlow
              </span>
            </div>

            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero - simpler */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
            <Mail className="w-3 h-3" />
            Get in touch
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Want to talk?
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent p-4">
              We're listening
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Questions, feedback, or just want to say hi. We reply to everything.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Send a message</h2>
            <p className="text-gray-500 text-sm mb-6">
              Fill this out and we'll get back to you.
            </p>

            {formSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Thanks!</h3>
                <p className="text-gray-600">We'll reply as soon as we can.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100"
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Company (optional)"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100"
                />

                <select className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 bg-white">
                  <option>Question</option>
                  <option>Demo request</option>
                  <option>Sales</option>
                  <option>Support</option>
                  <option>Partnership</option>
                </select>

                <textarea
                  rows={5}
                  placeholder="What's on your mind?"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100"
                  required
                />

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
                >
                  Send
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Contact Cards */}
          <div className="lg:col-span-2 space-y-4">
            {contactMethods.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <div className="text-purple-600 font-medium text-sm mb-1">
                  {item.value}
                </div>
                <p className="text-gray-500 text-xs">{item.description}</p>
              </div>
            ))}

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-5 text-white">
              <Clock className="w-6 h-6 mb-3" />
              <h3 className="font-bold text-lg mb-1">Fast replies</h3>
              <p className="text-purple-100 text-sm">
                Most emails get a response within a few hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Common questions</h2>
            <p className="text-gray-600">Stuff people usually ask us</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - simpler */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Ready to try AutoFlow?</h2>
            <p className="text-purple-100 mb-6">
              Start your free trial. No commitment.
            </p>
            <button
              onClick={() => router.push("/signup")}
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:shadow-md transition-all"
            >
              Start free trial
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-purple-100">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                No credit card
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                14-day trial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>© 2025 AutoFlow. Built with ☕️ and 🎧.</p>
        </div>
      </footer>
    </div>
  );
}
