"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const [recipientId, setRecipientId] = useState(null);
  const [trackingId, setTrackingId] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const rId = searchParams.get("recipientId");
    const tId = searchParams.get("trackingId");
    setRecipientId(rId);
    setTrackingId(tId);
  }, [searchParams]);

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axiosInstance.post(
        `/track/unsubscribe/${recipientId}/${trackingId}`,
        { reason },
      );
      setMessage("You have been unsubscribed successfully.");
    } catch (err) {
      setMessage("Error while unsubscribing. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!recipientId || !trackingId) return <p>Invalid unsubscribe link.</p>;

  return (
    <div className="unsubscribe-form">
      <h1>Unsubscribe</h1>
      <form onSubmit={handleUnsubscribe}>
        <label htmlFor="reason">Reason for Unsubscribing</label>
        <textarea
          id="reason"
          name="reason"
          rows="4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Unsubscribe"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
