import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";

export default async function AdminLeavesPage() {
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

  const pendingCount = await prisma.leaveRequest.count({
    where: { status: "PENDING" },
  });

  const allLeaves = await prisma.leaveRequest.findMany({
    include: {
      user: {
        select: {
          employeeId: true,
          email: true,
          profile: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminHeader employeeId={adminUser.employeeId} activePath="leaves" />

      <main className="dashboard-container">
        <div className="glass-panel" style={{ padding: "1.75rem 2rem", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>
            Leave Approval & Time Off Control 🌴
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            HR Admin Portal — Pending requests awaiting review: <strong style={{ color: "var(--warning)" }}>{pendingCount}</strong>
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1.25rem" }}>Submitted Time Off Applications</h3>

          {allLeaves.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              No leave requests have been submitted by employees yet.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                    <th style={{ padding: "0.75rem" }}>Employee</th>
                    <th style={{ padding: "0.75rem" }}>Leave Type</th>
                    <th style={{ padding: "0.75rem" }}>Start Date</th>
                    <th style={{ padding: "0.75rem" }}>End Date</th>
                    <th style={{ padding: "0.75rem" }}>Reason</th>
                    <th style={{ padding: "0.75rem" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allLeaves.map((l: any) => {
                    const empName = l.user?.profile ? `${l.user.profile.firstName} ${l.user.profile.lastName}` : l.user?.email || "—";
                    return (
                      <tr key={l.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "0.75rem", fontWeight: 500 }}>
                          {empName} ({l.user?.employeeId})
                        </td>
                        <td style={{ padding: "0.75rem", fontWeight: 600 }}>{l.leaveType}</td>
                        <td style={{ padding: "0.75rem" }}>{new Date(l.startDate).toLocaleDateString()}</td>
                        <td style={{ padding: "0.75rem" }}>{new Date(l.endDate).toLocaleDateString()}</td>
                        <td style={{ padding: "0.75rem", color: "var(--text-secondary)" }}>{l.reason}</td>
                        <td style={{ padding: "0.75rem" }}>
                          <span
                            className="role-badge"
                            style={{
                              background: l.status === "APPROVED" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                              color: l.status === "APPROVED" ? "#34d399" : "#fbbf24",
                            }}
                          >
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
