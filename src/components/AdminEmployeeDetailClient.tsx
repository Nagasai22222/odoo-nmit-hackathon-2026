"use client";

import { useState } from "react";
import EmployeeDetailModal from "./EmployeeDetailModal";

interface AdminEmployeeDetailClientProps {
  employee: any;
  attendanceLogs: any[];
  leaveLogs: any[];
}

export default function AdminEmployeeDetailClient({
  employee: initialEmployee,
  attendanceLogs,
  leaveLogs,
}: AdminEmployeeDetailClientProps) {
  const [employee, setEmployee] = useState(initialEmployee);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"PROFILE" | "ATTENDANCE" | "LEAVES">("PROFILE");

  const p = employee.profile || {};
  const fullName = `${p.firstName || ""} ${p.lastName || ""}`.trim() || employee.email;

  return (
    <div>
      {/* Hero Card */}
      <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {fullName.charAt(0).toUpperCase()}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
                <h1 style={{ fontSize: "1.6rem", margin: 0 }}>{fullName}</h1>
                <span className={`role-badge ${employee.role === "HR_ADMIN" ? "role-badge-hr" : "role-badge-emp"}`}>
                  {employee.role === "HR_ADMIN" ? "HR ADMIN" : "EMPLOYEE"}
                </span>
              </div>

              <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.9rem", color: "var(--text-secondary)", flexWrap: "wrap" }}>
                <span>ID: <strong style={{ color: "var(--text-primary)" }}>{employee.employeeId}</strong></span>
                <span>Email: <strong style={{ color: "var(--text-primary)" }}>{employee.email}</strong></span>
                <span>Dept: <strong style={{ color: "var(--text-primary)" }}>{p.department || "General"}</strong></span>
                <span>Title: <strong style={{ color: "var(--text-primary)" }}>{p.jobPosition || p.designation || "Staff Member"}</strong></span>
              </div>
            </div>
          </div>

          <button onClick={() => setIsEditModalOpen(true)} className="btn-primary" style={{ width: "auto" }}>
            ✏️ Edit Profile Information
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
        <button
          onClick={() => setActiveTab("PROFILE")}
          className={activeTab === "PROFILE" ? "btn-primary" : "btn-secondary"}
          style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", width: "auto" }}
        >
          👤 Complete Profile
        </button>
        <button
          onClick={() => setActiveTab("ATTENDANCE")}
          className={activeTab === "ATTENDANCE" ? "btn-primary" : "btn-secondary"}
          style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", width: "auto" }}
        >
          ⏱️ Attendance History ({attendanceLogs.length})
        </button>
        <button
          onClick={() => setActiveTab("LEAVES")}
          className={activeTab === "LEAVES" ? "btn-primary" : "btn-secondary"}
          style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", width: "auto" }}
        >
          🌴 Leave Records ({leaveLogs.length})
        </button>
      </div>

      {/* TAB 1: PROFILE DETAILS */}
      {activeTab === "PROFILE" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--accent-primary)" }}>Personal Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
              <div><span style={{ color: "var(--text-secondary)" }}>First Name:</span> <strong>{p.firstName || "—"}</strong></div>
              <div><span style={{ color: "var(--text-secondary)" }}>Last Name:</span> <strong>{p.lastName || "—"}</strong></div>
              <div><span style={{ color: "var(--text-secondary)" }}>Date of Birth:</span> <strong>{p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : "—"}</strong></div>
              <div><span style={{ color: "var(--text-secondary)" }}>Gender:</span> <strong>{p.gender || "—"}</strong></div>
              <div><span style={{ color: "var(--text-secondary)" }}>Nationality:</span> <strong>{p.nationality || "—"}</strong></div>
              <div><span style={{ color: "var(--text-secondary)" }}>Marital Status:</span> <strong>{p.maritalStatus || "—"}</strong></div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--accent-primary)" }}>Job & Organization Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
              <div><span style={{ color: "var(--text-secondary)" }}>Job Position:</span> <strong>{p.jobPosition || p.designation || "—"}</strong></div>
              <div><span style={{ color: "var(--text-secondary)" }}>Department:</span> <strong>{p.department || "—"}</strong></div>
              <div><span style={{ color: "var(--text-secondary)" }}>Manager:</span> <strong>{p.manager || "—"}</strong></div>
              <div><span style={{ color: "var(--text-secondary)" }}>Company:</span> <strong>{p.company || "Dayflow Enterprise"}</strong></div>
              <div><span style={{ color: "var(--text-secondary)" }}>Work Location:</span> <strong>{p.location || "—"}</strong></div>
              <div><span style={{ color: "var(--text-secondary)" }}>Date of Joining:</span> <strong>{p.dateOfJoining ? new Date(p.dateOfJoining).toLocaleDateString() : "—"}</strong></div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--accent-primary)" }}>Contact & System Metadata</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
              <div><span style={{ color: "var(--text-secondary)" }}>Phone Number:</span> <strong>{p.phone || "—"}</strong></div>
              <div><span style={{ color: "var(--text-secondary)" }}>Address:</span> <strong>{p.address || "—"}</strong></div>
              <div><span style={{ color: "var(--text-secondary)" }}>Email Address:</span> <strong>{employee.email}</strong></div>
              <div><span style={{ color: "var(--text-secondary)" }}>System Role:</span> <strong>{employee.role}</strong></div>
              <div><span style={{ color: "var(--text-secondary)" }}>Account Verified:</span> <strong>{employee.isVerified ? "Yes ✅" : "No ⏳"}</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE HISTORY */}
      {activeTab === "ATTENDANCE" && (
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Recorded Shift Attendance Logs</h3>
          {attendanceLogs.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
              No attendance records found for this employee.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                    <th style={{ padding: "0.6rem" }}>Date</th>
                    <th style={{ padding: "0.6rem" }}>Check In</th>
                    <th style={{ padding: "0.6rem" }}>Check Out</th>
                    <th style={{ padding: "0.6rem" }}>Total Hours</th>
                    <th style={{ padding: "0.6rem" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceLogs.map((att: any) => (
                    <tr key={att.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "0.6rem", fontWeight: 600 }}>{new Date(att.date).toLocaleDateString()}</td>
                      <td style={{ padding: "0.6rem", color: "var(--success)" }}>
                        {att.checkIn ? new Date(att.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                      <td style={{ padding: "0.6rem", color: "#60a5fa" }}>
                        {att.checkOut ? new Date(att.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Active Session"}
                      </td>
                      <td style={{ padding: "0.6rem" }}>{att.totalHours ? `${att.totalHours} hrs` : "—"}</td>
                      <td style={{ padding: "0.6rem" }}>
                        <span className="role-badge" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399", fontSize: "0.75rem" }}>
                          {att.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LEAVE RECORDS */}
      {activeTab === "LEAVES" && (
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Leave Requests History</h3>
          {leaveLogs.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
              No leave requests submitted by this employee.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                    <th style={{ padding: "0.6rem" }}>Type</th>
                    <th style={{ padding: "0.6rem" }}>Period</th>
                    <th style={{ padding: "0.6rem" }}>Reason</th>
                    <th style={{ padding: "0.6rem" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveLogs.map((l: any) => (
                    <tr key={l.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "0.6rem", fontWeight: 600 }}>{l.leaveType}</td>
                      <td style={{ padding: "0.6rem", color: "var(--text-secondary)" }}>
                        {new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "0.6rem" }}>{l.reason}</td>
                      <td style={{ padding: "0.6rem" }}>
                        <span className="role-badge" style={{ background: "rgba(245, 158, 11, 0.2)", color: "#fbbf24", fontSize: "0.75rem" }}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Inline Edit Modal */}
      {isEditModalOpen && (
        <EmployeeDetailModal
          employeeId={employee.id}
          currentUserRole="HR_ADMIN"
          onClose={() => setIsEditModalOpen(false)}
          onUpdated={() => {
            setIsEditModalOpen(false);
            if (typeof window !== "undefined") {
              window.location.reload();
            }
          }}
        />
      )}
    </div>
  );
}
