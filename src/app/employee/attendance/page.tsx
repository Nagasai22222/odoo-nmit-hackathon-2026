import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function EmployeeAttendancePage() {
  const session = await getAuthSession();
  if (!session || session.role !== "EMPLOYEE") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true },
  });

  if (!user) {
    redirect("/login");
  }

  const attendances = await prisma.attendance.findMany({
    where: { userId: session.userId },
    orderBy: { date: "desc" },
  });

  const totalHoursWorked = attendances.reduce((acc, curr) => acc + (curr.totalHours || 0), 0);

  return (
    <div>
      <header className="app-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="auth-brand" style={{ fontSize: "1.5rem", margin: 0 }}>
            DAYFLOW
          </div>
          <span className="role-badge role-badge-emp">ATTENDANCE LOGS</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/employee/dashboard" className="btn-secondary">
            ⬅ Dashboard
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="dashboard-container">
        <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>
            Personal Attendance Records ⏱️
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Track daily check-ins, check-outs, and shift hours logged in the system.
          </p>
        </div>

        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>TOTAL SHIFTS</h3>
            <div className="stat-val">{attendances.length}</div>
          </div>

          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>TOTAL HOURS WORKED</h3>
            <div className="stat-val" style={{ color: "var(--accent-primary)" }}>
              {Math.round(totalHoursWorked * 10) / 10} hrs
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                <th style={{ padding: "0.75rem" }}>Date</th>
                <th style={{ padding: "0.75rem" }}>Check In</th>
                <th style={{ padding: "0.75rem" }}>Check Out</th>
                <th style={{ padding: "0.75rem" }}>Total Hours</th>
                <th style={{ padding: "0.75rem" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                    No attendance records found yet. Use the Check In button on your dashboard to log your first shift.
                  </td>
                </tr>
              ) : (
                attendances.map((att) => (
                  <tr key={att.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "0.75rem", fontWeight: 600 }}>
                      {new Date(att.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                    </td>
                    <td style={{ padding: "0.75rem", color: "var(--success)" }}>
                      {att.checkIn ? new Date(att.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                    <td style={{ padding: "0.75rem", color: "#60a5fa" }}>
                      {att.checkOut ? new Date(att.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Active Session"}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {att.totalHours ? `${att.totalHours} hrs` : "—"}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span className="role-badge" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399", fontSize: "0.75rem" }}>
                        {att.status}
                      </span>
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
