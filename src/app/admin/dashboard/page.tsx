import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/AdminHeader";

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

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  // REAL DATABASE METRICS CALCULATIONS (NO FAKE DATA)
  const totalEmployees = await prisma.user.count({
    where: { role: "EMPLOYEE" },
  });

  const todayCheckIns = await prisma.attendance.count({
    where: {
      date: { gte: startOfDay, lte: endOfDay },
      checkIn: { not: null },
    },
  });

  const todayPresent = await prisma.attendance.count({
    where: {
      date: { gte: startOfDay, lte: endOfDay },
      status: "PRESENT",
    },
  });

  const pendingLeaves = await prisma.leaveRequest.count({
    where: { status: "PENDING" },
  });

  // Fetch all employees for directory overview
  const allEmployees = await prisma.user.findMany({
    include: { profile: true },
    orderBy: { createdAt: "desc" },
  });

  const displayName = adminUser.profile
    ? `${adminUser.profile.firstName} ${adminUser.profile.lastName}`.trim()
    : adminUser.email;

  return (
    <div>
      <AdminHeader employeeId={adminUser.employeeId} activePath="dashboard" />

      <main className="dashboard-container">
        {/* Welcome Banner */}
        <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
            Welcome, HR Admin {displayName}! 🛠️
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            Dayflow Human Resource Management System — Admin Control Center
          </p>
        </div>

        {/* Real Database Stats Overview */}
        <div className="stats-grid" style={{ marginBottom: "2.5rem" }}>
          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>TOTAL EMPLOYEES</h3>
            <div className="stat-val">{totalEmployees}</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Active Staff Records
            </p>
          </div>

          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>TODAY CHECK-INS</h3>
            <div className="stat-val" style={{ color: "var(--success)" }}>{todayCheckIns}</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Logged Shifts Today
            </p>
          </div>

          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>FULL-DAY PRESENT</h3>
            <div className="stat-val" style={{ color: "var(--accent-primary)" }}>{todayPresent}</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Shifts &ge; 4.0 Hours
            </p>
          </div>

          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>PENDING LEAVES</h3>
            <div className="stat-val" style={{ color: "var(--warning)" }}>{pendingLeaves}</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Awaiting HR Review
            </p>
          </div>
        </div>

        {/* Quick Access Module Navigation Cards */}
        <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>Administrative Controls</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👥</div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>Personnel Directory</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                Browse, search, edit, and manage comprehensive staff profile records and job metadata.
              </p>
            </div>
            <Link href="/admin/employees" className="btn-secondary" style={{ textAlign: "center" }}>
              Manage Employees ➡
            </Link>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏱️</div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>Personnel Attendance</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                Inspect daily check-ins, weekly aggregates, and individual employee shift histories.
              </p>
            </div>
            <Link href="/admin/attendance" className="btn-secondary" style={{ textAlign: "center" }}>
              View All Attendance ➡
            </Link>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌴</div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>Leave Approval Center</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                Review pending time off requests, approve or reject leave applications.
              </p>
            </div>
            <Link href="/admin/leaves" className="btn-secondary" style={{ textAlign: "center" }}>
              Leave Control Portal ➡
            </Link>
          </div>
        </div>

        {/* Quick Employee Selection Table */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.3rem" }}>Quick Employee Selection & Details</h2>
          <Link href="/admin/employees" className="btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
            Full Directory ➡
          </Link>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                <th style={{ padding: "0.75rem" }}>Employee ID</th>
                <th style={{ padding: "0.75rem" }}>Name</th>
                <th style={{ padding: "0.75rem" }}>Job Title</th>
                <th style={{ padding: "0.75rem" }}>Department</th>
                <th style={{ padding: "0.75rem" }}>Role</th>
                <th style={{ padding: "0.75rem" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {allEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                    No employees registered yet.
                  </td>
                </tr>
              ) : (
                allEmployees.map((u: any) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "0.75rem", fontWeight: 600 }}>{u.employeeId}</td>
                    <td style={{ padding: "0.75rem", fontWeight: 500 }}>
                      {u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : u.email}
                    </td>
                    <td style={{ padding: "0.75rem", color: "var(--text-secondary)" }}>
                      {u.profile?.jobPosition || u.profile?.designation || "Staff Member"}
                    </td>
                    <td style={{ padding: "0.75rem", color: "var(--text-secondary)" }}>
                      {u.profile?.department || "General"}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span className={`role-badge ${u.role === "HR_ADMIN" ? "role-badge-hr" : "role-badge-emp"}`}>
                        {u.role === "HR_ADMIN" ? "HR ADMIN" : "EMPLOYEE"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <Link
                        href={`/admin/employees/${u.id}`}
                        className="btn-secondary"
                        style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem" }}
                      >
                        Inspect Details 🔍
                      </Link>
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
