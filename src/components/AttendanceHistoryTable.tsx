"use client";

import { useState, useEffect } from "react";

interface AttendanceRecord {
  id: string;
  date: string | Date;
  checkIn: string | Date | null;
  checkOut: string | Date | null;
  totalHours: number | null;
  status: string;
}

export default function AttendanceHistoryTable() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("ALL");

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (status && status !== "ALL") params.append("status", status);

      const res = await fetch(`/api/attendance/history?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch attendance history.");
        setLoading(false);
        return;
      }

      setRecords(data.records || []);
      setLoading(false);
    } catch (err) {
      setError("Network error fetching attendance history.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [startDate, endDate, status]);

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "PRESENT":
        return <span className="role-badge" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399" }}>Present</span>;
      case "HALF_DAY":
        return <span className="role-badge" style={{ background: "rgba(245, 158, 11, 0.2)", color: "#fbbf24" }}>Half Day</span>;
      case "ABSENT":
        return <span className="role-badge" style={{ background: "rgba(239, 68, 68, 0.2)", color: "#f87171" }}>Absent</span>;
      case "LEAVE":
        return <span className="role-badge role-badge-hr">Leave</span>;
      default:
        return <span className="role-badge" style={{ background: "rgba(255, 255, 255, 0.1)", color: "var(--text-secondary)" }}>{st}</span>;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.2rem" }}>Attendance History & Filters</h3>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.2rem" }}>From Date</label>
            <input
              type="date"
              className="form-input"
              style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem", width: "auto" }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.2rem" }}>To Date</label>
            <input
              type="date"
              className="form-input"
              style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem", width: "auto" }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.2rem" }}>Status</label>
            <select
              className="form-select"
              style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem", width: "auto" }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PRESENT">Present</option>
              <option value="HALF_DAY">Half Day</option>
              <option value="ABSENT">Absent</option>
              <option value="LEAVE">Leave</option>
            </select>
          </div>

          {(startDate || endDate || status !== "ALL") && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setStatus("ALL");
              }}
              className="btn-secondary"
              style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", marginTop: "1rem" }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">⚠️ {error}</div>}

      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
          Loading attendance history...
        </div>
      ) : records.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          No historical attendance records matching the selected filters.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                <th style={{ padding: "0.75rem" }}>Date</th>
                <th style={{ padding: "0.75rem" }}>Check In</th>
                <th style={{ padding: "0.75rem" }}>Check Out</th>
                <th style={{ padding: "0.75rem" }}>Working Duration</th>
                <th style={{ padding: "0.75rem" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 600 }}>
                    {new Date(r.date).toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td style={{ padding: "0.75rem", color: "var(--success)" }}>
                    {r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                  </td>
                  <td style={{ padding: "0.75rem", color: "#60a5fa" }}>
                    {r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : r.checkIn ? "Active Session" : "—"}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    {r.totalHours ? `${r.totalHours} hrs` : "—"}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    {getStatusBadge(r.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
