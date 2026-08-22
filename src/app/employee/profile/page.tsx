import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import EmployeeProfileEditor from "@/components/EmployeeProfileEditor";

export default async function EmployeeProfilePage() {
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

  return (
    <div>
      <header className="app-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="auth-brand" style={{ fontSize: "1.5rem", margin: 0 }}>
            DAYFLOW
          </div>
          <span className="role-badge role-badge-emp">PERSONAL PROFILE</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/employee/dashboard" className="btn-secondary">
            ⬅ Dashboard
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="dashboard-container">
        <EmployeeProfileEditor user={user as any} />
      </main>
    </div>
  );
}
