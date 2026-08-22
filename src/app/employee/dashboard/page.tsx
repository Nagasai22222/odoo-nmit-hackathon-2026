import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function EmployeeDashboardPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const session = await getAuthSession();
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true },
  });

  if (!user) {
    redirect("/login");
  }

  const displayName = user.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`.trim()
    : user.email;

  return (
    <div>
      <header className="app-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="auth-brand" style={{ fontSize: "1.5rem", margin: 0 }}>
            DAYFLOW
          </div>
          <span className="role-badge role-badge-emp">EMPLOYEE DASHBOARD</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            ID: <strong style={{ color: "var(--text-primary)" }}>{user.employeeId}</strong>
          </span>
          <LogoutButton />
        </div>
      </header>

      <main className="dashboard-container">
        {searchParams?.error === "unauthorized_admin_access" && (
          <div className="alert alert-danger" style={{ marginBottom: "1.5rem" }}>
            ⛔ Access Denied: You do not have HR/Admin privileges to access management routes.
          </div>
        )}

        <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
            Welcome back, {displayName}! 👋
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            Dayflow Human Resource Management System — Employee Portal
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>EMPLOYEE ID</h3>
            <div className="stat-val" style={{ fontSize: "1.5rem" }}>{user.employeeId}</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Email: {user.email}
            </p>
          </div>

          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>ATTENDANCE STATUS</h3>
            <div className="stat-val" style={{ color: "var(--success)" }}>PRESENT</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Daily/Weekly Tracking Ready
            </p>
          </div>

          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>LEAVE BALANCE</h3>
            <div className="stat-val">14 Days</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Paid & Sick Leaves Available
            </p>
          </div>

          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>PAYROLL STATUS</h3>
            <div className="stat-val" style={{ color: "var(--accent-secondary)" }}>ACTIVE</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Read-Only Personal View
            </p>
          </div>
        </div>

        <h2 style={{ marginTop: "2.5rem", marginBottom: "1rem", fontSize: "1.3rem" }}>
          Quick Management Actions
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h4>👤 Profile</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0.5rem 0 1rem 0" }}>
              View and manage your contact details.
            </p>
            <button className="btn-secondary" style={{ width: "100%" }}>View Profile</button>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h4>⏱️ Attendance</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0.5rem 0 1rem 0" }}>
              Check-in / check-out daily tracking.
            </p>
            <button className="btn-secondary" style={{ width: "100%" }}>Check In / Out</button>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h4>📅 Leave Requests</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0.5rem 0 1rem 0" }}>
              Apply for paid, sick, or unpaid leave.
            </p>
            <button className="btn-secondary" style={{ width: "100%" }}>Apply Leave</button>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <h4>💰 Salary View</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "0.5rem 0 1rem 0" }}>
              View your monthly salary structure.
            </p>
            <button className="btn-secondary" style={{ width: "100%" }}>View Salary</button>
          </div>
        </div>
      </main>
    </div>
  );
}
