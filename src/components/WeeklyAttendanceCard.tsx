"use client";

import { useState, useEffect } from "react";

interface WeeklySummary {
  presentCount: number;
  halfDayCount: number;
  leaveCount: number;
}

interface WeeklyRecord {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number | null;
  status: string;
}

export default function WeeklyAttendanceCard() {
  const [weeklyData, setWeeklyData] = useState<{
    startDate: string;
    endDate: string;
    totalShifts: number;
    totalHours: number;
    summary: WeeklySummary;
    records: WeeklyRecord[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWeekly = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/attendance/weekly");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch weekly attendance.");
        setLoading(false);
        return;
      }

      setWeeklyData(data);
      setLoading(false);
    } catch (err) {
      setError("Network error fetching weekly attendance.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekly();
  }, []);

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

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
        Loading weekly attendance aggregation...
      </div>
    );
  }

  if (error || !weeklyData) {
    return (
      <div className="glass-panel" style={{ padding: "2rem" }}>
        <div className="alert alert-danger">⚠️ {error || "Failed to load weekly data."}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Weekly Metrics Overview */}
      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        <div className="stat-card">
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>TOTAL SHIFTS</h3>
          <div className="stat-val" style={{ color: "var(--accent-primary)" }}>{weeklyData.totalShifts}</div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.4rem" }}>
            This Week ({weeklyData.startDate} to {weeklyData.endDate})
          </p>
        </div>

        <div className="stat-card">
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>TOTAL HOURS LOGGED</h3>
          <div className="stat-val" style={{ color: "#60a5fa" }}>{weeklyData.totalHours} hrs</div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.4rem" }}>
            Cumulative Shift Time
          </p>
        </div>

        <div className="stat-card">
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>PRESENT DAYS</h3>
          <div className="stat-val" style={{ color: "var(--success)" }}>{weeklyData.summary.presentCount}</div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.4rem" }}>
            Full Shifts (≥ 4.0 hrs)
          </p>
        </div>

        <div className="stat-card">
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>HALF DAY SHIFTS</h3>
          <div className="stat-val" style={{ color: "var(--warning)" }}>{weeklyData.summary.halfDayCount}</div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.4rem" }}>
            Short Shifts (&lt; 4.0 hrs)
          </p>
        </div>
      </div>

      {/* Weekly Day-by-Day Breakdown Table */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1.25rem" }}>
          Weekly Shifts Breakdown ({weeklyData.startDate} - {weeklyData.endDate})
        </h3>

        {weeklyData.records.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
            No shift logs found for the current week. Check in to record your attendance.
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
                {weeklyData.records.map((r) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "0.75rem", fontWeight: 600 }}>
                      {new Date(r.date).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
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
    </div>
  );
}
