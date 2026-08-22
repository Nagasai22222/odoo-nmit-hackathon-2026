import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";

export default async function AdminPayrollPage() {
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

  const totalStaff = await prisma.user.count({
    where: { role: "EMPLOYEE" },
  });

  return (
    <div>
      <AdminHeader employeeId={adminUser.employeeId} activePath="payroll" />

      <main className="dashboard-container">
        <div className="glass-panel" style={{ padding: "1.75rem 2rem", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>
            Payroll Management Control Portal 💰
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            HR Admin Portal — Registered Active Personnel: <strong style={{ color: "var(--text-primary)" }}>{totalStaff}</strong>
          </p>
        </div>

        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>TOTAL STAFF RECORDS</h3>
            <div className="stat-val" style={{ color: "var(--accent-primary)" }}>{totalStaff}</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.4rem" }}>
              Active Payroll Targets
            </p>
          </div>

          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>PAYROLL CYCLE</h3>
            <div className="stat-val" style={{ color: "var(--success)" }}>MONTHLY</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.4rem" }}>
              Standard Schedule
            </p>
          </div>

          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>PAYSLIP ENGINE</h3>
            <div className="stat-val" style={{ color: "var(--accent-secondary)" }}>READY</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.4rem" }}>
              Phase Foundation Active
            </p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💳</div>
          <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>Payroll & Salary Processing Module</h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 1.5rem auto", fontSize: "0.9rem" }}>
            The HR Admin payroll foundation portal is ready. Advanced salary structure calculations, tax deduction logic, and automatic PDF payslip generation will plug into this portal in Phase 7.
          </p>
        </div>
      </main>
    </div>
  );
}
