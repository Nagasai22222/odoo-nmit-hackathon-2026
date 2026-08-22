import Link from "next/link";
import LogoutButton from "./LogoutButton";

interface AdminHeaderProps {
  employeeId: string;
  activePath?: "dashboard" | "employees" | "attendance" | "leaves" | "payroll";
}

export default function AdminHeader({ employeeId, activePath = "dashboard" }: AdminHeaderProps) {
  return (
    <header className="app-header" style={{ flexWrap: "wrap", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div className="auth-brand" style={{ fontSize: "1.5rem", margin: 0 }}>
          DAYFLOW
        </div>
        <span className="role-badge role-badge-hr">HR ADMIN PORTAL</span>
      </div>

      <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <Link
          href="/admin/dashboard"
          className={activePath === "dashboard" ? "btn-primary" : "btn-secondary"}
          style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", width: "auto" }}
        >
          🏠 Dashboard
        </Link>
        <Link
          href="/admin/employees"
          className={activePath === "employees" ? "btn-primary" : "btn-secondary"}
          style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", width: "auto" }}
        >
          👥 Employees
        </Link>
        <Link
          href="/admin/attendance"
          className={activePath === "attendance" ? "btn-primary" : "btn-secondary"}
          style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", width: "auto" }}
        >
          ⏱️ All Attendance
        </Link>
        <Link
          href="/admin/leaves"
          className={activePath === "leaves" ? "btn-primary" : "btn-secondary"}
          style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", width: "auto" }}
        >
          🌴 Leave Control
        </Link>
        <Link
          href="/admin/payroll"
          className={activePath === "payroll" ? "btn-primary" : "btn-secondary"}
          style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", width: "auto" }}
        >
          💰 Payroll Control
        </Link>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          HR ID: <strong style={{ color: "var(--text-primary)" }}>{employeeId}</strong>
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}
