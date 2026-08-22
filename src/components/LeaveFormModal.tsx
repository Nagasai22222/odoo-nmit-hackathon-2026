"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LeaveFormModalProps {
  onClose: () => void;
  onSubmitted: () => void;
}

export default function LeaveFormModal({ onClose, onSubmitted }: LeaveFormModalProps) {
  const router = useRouter();
  const [leaveType, setLeaveType] = useState("PAID");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!startDate || !endDate) {
      setError("Please select both start date and end date.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before start date.");
      return;
    }

    if (!reason.trim()) {
      setError("Please provide a reason for your leave request.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leaveType, startDate, endDate, reason }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit leave request.");
        setLoading(false);
        return;
      }

      setLoading(false);
      onSubmitted();
      router.refresh();
    } catch (err) {
      setError("Network error submitting leave request.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "1rem",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "540px",
          padding: "2rem",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          ✖
        </button>

        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
          Submit New Leave Request 🌴
        </h2>

        {error && <div className="alert alert-danger">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Leave Category</label>
            <select
              className="form-select"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value="PAID">Paid Annual Leave</option>
              <option value="SICK">Sick Medical Leave</option>
              <option value="UNPAID">Unpaid Casual Leave</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Absence</label>
            <textarea
              className="form-input"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide context or explanation for HR review..."
              maxLength={500}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Submitting Request..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
