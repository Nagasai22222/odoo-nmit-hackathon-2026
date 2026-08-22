import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminDashboardPage() {
  const session = await getAuthSession();
  if (!session || session.role !== "HR_ADMIN") {
    redirect("/login");
  }

  const adminUser = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true },
  });

  if (!adminUser) {
    redirect("/login");
  }

  // Fetch all registered employees for HR overview
  const allUsers = await prisma.user.findMany({
    include: { profile: true },
    orderBy: { createdAt: "desc" },
  });

  const displayName = adminUser.profile
    ? `${adminUser.profile.firstName} ${adminUser.profile.lastName}`.trim()
    : adminUser.email;

  return (
    <div>
      <header className="app-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="auth-brand" style={{ fontSize: "1.5rem", margin: 0 }}>
            DAYFLOW
          </div>
          <span className="role-badge role-badge-hr">HR ADMIN DASHBOARD</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            HR ID: <strong style={{ color: "var(--text-primary)" }}>{adminUser.employeeId}</strong>
          </span>
          <LogoutButton />
        </div>
      </header>

      <main className="dashboard-container">
        <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
            Welcome, HR Admin {displayName}! 🛠️
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            Dayflow Human Resource Management System — Admin Control Center
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>TOTAL EMPLOYEES</h3>
            <div className="stat-val">{allUsers.length}</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Active in Organization
            </p>
          </div>

          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>PENDING LEAVES</h3>
            <div className="stat-val" style={{ color: "var(--warning)" }}>0 Requests</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Approval Workflow Ready
            </p>
          </div>

          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>TODAY ATTENDANCE</h3>
            <div className="stat-val" style={{ color: "var(--success)" }}>100%</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Check-ins Recorded
            </p>
          </div>

          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>PAYROLL CONTROL</h3>
            <div className="stat-val" style={{ color: "var(--accent-secondary)" }}>READY</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Admin Management Portal
            </p>
          </div>
        </div>

        <h2 style={{ marginTop: "2.5rem", marginBottom: "1rem", fontSize: "1.3rem" }}>
          Registered Personnel Directory
        </h2>
        <div className="glass-panel" style={{ padding: "1.5rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                <th style={{ padding: "0.75rem" }}>Employee ID</th>
                <th style={{ padding: "0.75rem" }}>Name</th>
                <th style={{ padding: "0.75rem" }}>Email</th>
                <th style={{ padding: "0.75rem" }}>Role</th>
                <th style={{ padding: "0.75rem" }}>Verification</th>
                <th style={{ padding: "0.75rem" }}>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                    No employees registered yet.
                  </td>
                </tr>
              ) : (
                allUsers.map((u: any) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "0.75rem", fontWeight: 600 }}>{u.employeeId}</td>
                    <td style={{ padding: "0.75rem" }}>
                      {u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : "—"}
                    </td>
                    <td style={{ padding: "0.75rem", color: "var(--text-secondary)" }}>{u.email}</td>
                    <td style={{ padding: "0.75rem" }}>
                      <span className={`role-badge ${u.role === "HR_ADMIN" ? "role-badge-hr" : "role-badge-emp"}`}>
                        {u.role === "HR_ADMIN" ? "HR ADMIN" : "EMPLOYEE"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {u.isVerified ? (
                        <span style={{ color: "var(--success)", fontWeight: 600 }}>Verified ✅</span>
                      ) : (
                        <span style={{ color: "var(--warning)", fontWeight: 600 }}>Pending ⏳</span>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
