import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/AdminHeader";
import EmployeeDetailModal from "@/components/EmployeeDetailModal";
import AdminEmployeeDetailClient from "@/components/AdminEmployeeDetailClient";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AdminEmployeeDetailPage({ params }: PageProps) {
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

  const targetEmployee = await prisma.user.findUnique({
    where: { id: params.id },
    include: { profile: true },
  });

  if (!targetEmployee) {
    notFound();
  }

  // Fetch employee attendance history
  const attendanceLogs = await prisma.attendance.findMany({
    where: { userId: targetEmployee.id },
    orderBy: { date: "desc" },
    take: 10,
  });

  // Fetch employee leave requests history
  const leaveLogs = await prisma.leaveRequest.findMany({
    where: { userId: targetEmployee.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div>
      <AdminHeader employeeId={adminUser.employeeId} activePath="employees" />

      <main className="dashboard-container">
        <div style={{ marginBottom: "1.5rem" }}>
          <Link href="/admin/employees" className="btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
            ⬅ Back to Personnel Directory
          </Link>
        </div>

        <AdminEmployeeDetailClient
          employee={targetEmployee as any}
          attendanceLogs={attendanceLogs as any}
          leaveLogs={leaveLogs as any}
        />
      </main>
    </div>
  );
}
