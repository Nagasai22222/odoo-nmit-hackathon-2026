import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import AttendanceClientController from "@/components/AttendanceClientController";

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

  return (
    <div>
      <header className="app-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="auth-brand" style={{ fontSize: "1.5rem", margin: 0 }}>
            DAYFLOW
          </div>
          <span className="role-badge role-badge-emp">ATTENDANCE MANAGEMENT</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/employee/dashboard" className="btn-secondary">
            ⬅ Dashboard
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="dashboard-container">
        <div className="glass-panel" style={{ padding: "1.75rem 2rem", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>
            Employee Attendance Portal ⏱️
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Logged in as <strong style={{ color: "var(--text-primary)" }}>{user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user.email}</strong> (ID: {user.employeeId})
          </p>
        </div>

        <AttendanceClientController user={user as any} />
      </main>
    </div>
  );
}
