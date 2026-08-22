"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AttendanceQuickActionProps {
  initialState: "NOT_CHECKED_IN" | "CHECKED_IN" | "CHECKED_OUT" | "ON_LEAVE";
  checkInTime?: string | null;
  checkOutTime?: string | null;
}

export default function AttendanceQuickAction({
  initialState,
  checkInTime,
  checkOutTime,
}: AttendanceQuickActionProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleCheckIn = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/attendance/check-in", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to check in.");
        setLoading(false);
        return;
      }

      setStatus("CHECKED_IN");
      setMessage("Checked in successfully!");
      setLoading(false);
      router.refresh();
    } catch (err) {
      setError("Network error during check-in.");
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/attendance/check-out", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to check out.");
        setLoading(false);
        return;
      }

      setStatus("CHECKED_OUT");
      setMessage("Checked out successfully!");
      setLoading(false);
      router.refresh();
    } catch (err) {
      setError("Network error during check-out.");
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.2rem" }}>Today&apos;s Attendance Status</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            {new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div>
          {status === "NOT_CHECKED_IN" && (
            <span className="role-badge" style={{ background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.4)" }}>
              NOT CHECKED IN
            </span>
          )}
          {status === "CHECKED_IN" && (
            <span className="role-badge" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.4)" }}>
              CHECKED IN
            </span>
          )}
          {status === "CHECKED_OUT" && (
            <span className="role-badge" style={{ background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.4)" }}>
              COMPLETED
            </span>
          )}
          {status === "ON_LEAVE" && (
            <span className="role-badge role-badge-hr">
              ON APPROVED LEAVE
            </span>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger" style={{ marginBottom: "1rem" }}>⚠️ {error}</div>}
      {message && <div className="alert alert-success" style={{ marginBottom: "1rem" }}>✅ {message}</div>}

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {status === "NOT_CHECKED_IN" && (
          <button onClick={handleCheckIn} className="btn-primary" disabled={loading} style={{ width: "auto" }}>
            {loading ? "Checking In..." : "🟢 Check In Now"}
          </button>
        )}

        {status === "CHECKED_IN" && (
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Checked in at: <strong style={{ color: "var(--success)" }}>{checkInTime || "Today"}</strong>
            </span>
            <button onClick={handleCheckOut} className="btn-secondary" disabled={loading} style={{ borderColor: "#f87171", color: "#f87171" }}>
              {loading ? "Checking Out..." : "🔴 Check Out Now"}
            </button>
          </div>
        )}

        {status === "CHECKED_OUT" && (
          <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Attendance logged for today (In: {checkInTime} • Out: {checkOutTime}). Have a great evening! 🎉
          </div>
        )}

        {status === "ON_LEAVE" && (
          <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            You are currently on approved leave for today. Enjoy your day! 🌴
          </div>
        )}
      </div>
    </div>
  );
}
