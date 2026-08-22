import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import AdminAttendanceClient from "@/components/AdminAttendanceClient";

export default async function AdminAttendancePage() {
  const session = await getAuthSession();
  if (!session || session.role !== "HR_ADMIN") {
    redirect("/login");
  }

  const adminUser = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!adminUser) {
    redirect("/login");
  }

  const employees = await prisma.user.findMany({
    include: { profile: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminHeader employeeId={adminUser.employeeId} activePath="attendance" />

      <main className="dashboard-container">
        <div className="glass-panel" style={{ padding: "1.75rem 2rem", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>
            Personnel Attendance Management ⏱️
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            HR Admin Portal — Monitor daily check-ins, weekly shift totals, and history records for all organization staff.
          </p>
        </div>

        <AdminAttendanceClient employees={employees as any} />
      </main>
    </div>
  );
}
