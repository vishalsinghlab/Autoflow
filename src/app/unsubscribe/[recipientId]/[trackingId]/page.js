// app/unsubscribe/[recipientId]/[trackingId]/page.js
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function UnsubscribePage() {
  const { recipientId, trackingId } = useParams();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(`/track/unsubscribe/${recipientId}/${trackingId}`, {
        reason,
      });
      setMessage("You have been unsubscribed successfully.");
    } catch (err) {
      setMessage("Error while unsubscribing. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center tracking-tight">
          We're sorry to see you go
        </h1>
        <form onSubmit={handleUnsubscribe} className="space-y-5">
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Let us know why you're unsubscribing <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="reason"
              name="reason"
              rows="4"
              className="block w-full rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 p-3 transition-all resize-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-200 ${loading
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
              }`}
          >
            {loading ? "Processing..." : "Unsubscribe"}
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center">
          <p
              className={`text-sm font-medium ${message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
          </div>
        )}
      </div>
    </div>

  );
}
