"use client";

import { useState } from "react";
import LeaveFormModal from "./LeaveFormModal";

interface LeaveItem {
  id: string;
  leaveType: string;
  startDate: Date | string;
  endDate: Date | string;
  reason: string;
  status: string;
  adminComment?: string | null;
  createdAt: Date | string;
}

interface EmployeeLeaveClientProps {
  initialLeaves: LeaveItem[];
}

export default function EmployeeLeaveClient({ initialLeaves }: EmployeeLeaveClientProps) {
  const [leaves, setLeaves] = useState<LeaveItem[]>(initialLeaves);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeaves = async () => {
    try {
      const res = await fetch("/api/leaves");
      const data = await res.json();
      if (res.ok) {
        setLeaves(data.leaves || []);
      }
    } catch (err) {
      console.error("Error refreshing leaves:", err);
    }
  };

  const pendingCount = leaves.filter((l) => l.status === "PENDING").length;
  const approvedCount = leaves.filter((l) => l.status === "APPROVED").length;
  const rejectedCount = leaves.filter((l) => l.status === "REJECTED").length;

  return (
    <div>
      <div className="glass-panel" style={{ padding: "1.5rem 2rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>
              My Leave Requests & Balance 🌴
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Request time off, track approval progress, and review leave history.
            </p>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ width: "auto" }}>
            ➕ Request New Leave
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        <div className="stat-card">
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>PENDING REQUESTS</h3>
          <div className="stat-val" style={{ color: "var(--warning)" }}>{pendingCount}</div>
        </div>

        <div className="stat-card">
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>APPROVED LEAVES</h3>
          <div className="stat-val" style={{ color: "var(--success)" }}>{approvedCount}</div>
        </div>

        <div className="stat-card">
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>REJECTED REQUESTS</h3>
          <div className="stat-val" style={{ color: "var(--danger)" }}>{rejectedCount}</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "1.5rem", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
              <th style={{ padding: "0.75rem" }}>Category</th>
              <th style={{ padding: "0.75rem" }}>Duration</th>
              <th style={{ padding: "0.75rem" }}>Reason</th>
              <th style={{ padding: "0.75rem" }}>Status</th>
              <th style={{ padding: "0.75rem" }}>Submitted On</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                  No leave requests submitted yet. Click &quot;Request New Leave&quot; above to submit your first application.
                </td>
              </tr>
            ) : (
              leaves.map((l) => (
                <tr key={l.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "0.75rem", fontWeight: 600 }}>{l.leaveType} LEAVE</td>
                  <td style={{ padding: "0.75rem", color: "var(--text-secondary)" }}>
                    {new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "0.75rem", color: "var(--text-primary)" }}>{l.reason}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <span
                      className="role-badge"
                      style={{
                        background:
                          l.status === "APPROVED"
                            ? "rgba(16, 185, 129, 0.2)"
                            : l.status === "PENDING"
                            ? "rgba(245, 158, 11, 0.2)"
                            : "rgba(239, 68, 68, 0.2)",
                        color:
                          l.status === "APPROVED"
                            ? "#34d399"
                            : l.status === "PENDING"
                            ? "#fbbf24"
                            : "#f87171",
                        fontSize: "0.75rem",
                      }}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {new Date(l.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <LeaveFormModal
          onClose={() => setIsModalOpen(false)}
          onSubmitted={() => {
            setIsModalOpen(false);
            fetchLeaves();
          }}
        />
      )}
    </div>
  );
}
