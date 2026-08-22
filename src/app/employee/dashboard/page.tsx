import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import AttendanceQuickAction from "@/components/AttendanceQuickAction";

export default async function EmployeeDashboardPage() {
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

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  // 1. Fetch today's attendance record
  const todayAttendance = await prisma.attendance.findFirst({
    where: {
      userId: session.userId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  // 2. Fetch approved leave covering today
  const activeLeaveToday = await prisma.leaveRequest.findFirst({
    where: {
      userId: session.userId,
      status: "APPROVED",
      startDate: { lte: now },
      endDate: { gte: startOfDay },
    },
  });

  // Calculate live state
  let attendanceState: "NOT_CHECKED_IN" | "CHECKED_IN" | "CHECKED_OUT" | "ON_LEAVE" = "NOT_CHECKED_IN";
  let checkInFormatted: string | null = null;
  let checkOutFormatted: string | null = null;

  if (activeLeaveToday) {
    attendanceState = "ON_LEAVE";
  } else if (todayAttendance) {
    if (todayAttendance.checkOut) {
      attendanceState = "CHECKED_OUT";
      checkInFormatted = new Date(todayAttendance.checkIn!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      checkOutFormatted = new Date(todayAttendance.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (todayAttendance.checkIn) {
      attendanceState = "CHECKED_IN";
      checkInFormatted = new Date(todayAttendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  // 3. Fetch real statistics from database
  const totalAttendancesCount = await prisma.attendance.count({
    where: { userId: session.userId },
  });

  const pendingLeavesCount = await prisma.leaveRequest.count({
    where: { userId: session.userId, status: "PENDING" },
  });

  const approvedLeavesCount = await prisma.leaveRequest.count({
    where: { userId: session.userId, status: "APPROVED" },
  });

  // 4. Fetch real recent activity feed (no fake data!)
  const recentAttendances = await prisma.attendance.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentLeaves = await prisma.leaveRequest.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Combine real database records into activity timeline
  const activityFeed: Array<{
    id: string;
    type: "ATTENDANCE" | "LEAVE";
    title: string;
    timestamp: Date;
    status: string;
    details: string;
  }> = [];

  recentAttendances.forEach((att) => {
    activityFeed.push({
      id: `att-${att.id}`,
      type: "ATTENDANCE",
      title: att.checkOut ? "Checked Out" : "Checked In",
      timestamp: att.checkOut || att.checkIn || att.createdAt,
      status: att.status,
      details: att.checkOut
        ? `Logged ${att.totalHours ? att.totalHours + " hrs" : "shift"}`
        : `Check-in recorded at ${new Date(att.checkIn!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    });
  });

  recentLeaves.forEach((leave) => {
    activityFeed.push({
      id: `leave-${leave.id}`,
      type: "LEAVE",
      title: `${leave.leaveType} Leave Request`,
      timestamp: leave.createdAt,
      status: leave.status,
      details: `Period: ${new Date(leave.startDate).toLocaleDateString()} - ${new Date(leave.endDate).toLocaleDateString()}`,
    });
  });

  // Sort activity feed by date descending
  activityFeed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const displayName = user.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`.trim()
    : user.email;

  return (
    <div>
      <header className="app-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="auth-brand" style={{ fontSize: "1.5rem", margin: 0 }}>
            DAYFLOW
          </div>
          <span className="role-badge role-badge-emp">EMPLOYEE PORTAL</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Employee ID: <strong style={{ color: "var(--text-primary)" }}>{user.employeeId}</strong>
          </span>
          <LogoutButton />
        </div>
      </header>

      <main className="dashboard-container">
        {/* Welcome Header */}
        <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
            Welcome back, {displayName}! 👋
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            {(user.profile as any)?.jobPosition || user.profile?.designation || "Staff Member"} • {user.profile?.department || "General Department"}
          </p>
        </div>

        {/* Live Attendance Quick Action Banner */}
        <div style={{ marginBottom: "2rem" }}>
          <AttendanceQuickAction
            initialState={attendanceState}
            checkInTime={checkInFormatted}
            checkOutTime={checkOutFormatted}
          />
        </div>

        {/* Metrics Overview */}
        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>ATTENDANCE LOGS</h3>
            <div className="stat-val" style={{ color: "var(--accent-primary)" }}>{totalAttendancesCount}</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Total Shift Records
            </p>
          </div>

          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>PENDING LEAVES</h3>
            <div className="stat-val" style={{ color: "var(--warning)" }}>{pendingLeavesCount}</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Awaiting Approval
            </p>
          </div>

          <div className="stat-card">
            <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>APPROVED LEAVES</h3>
            <div className="stat-val" style={{ color: "var(--success)" }}>{approvedLeavesCount}</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Granted Requests
            </p>
          </div>
        </div>

        {/* Quick Access Action Cards */}
        <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>Quick Access Modules</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👤</div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>My Profile</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                View complete personal details, contact preferences, and emergency contact numbers.
              </p>
            </div>
            <Link href="/employee/profile" className="btn-secondary" style={{ textAlign: "center" }}>
              View & Edit Profile ➡
            </Link>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏱️</div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>Attendance History</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                Review daily check-ins, total hours worked, and monthly attendance logs.
              </p>
            </div>
            <Link href="/employee/attendance" className="btn-secondary" style={{ textAlign: "center" }}>
              View Attendance Logs ➡
            </Link>
          </div>

          <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌴</div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.4rem" }}>Leave Requests</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                Submit new leave requests, check leave balances, and track approval statuses.
              </p>
            </div>
            <Link href="/employee/leaves" className="btn-secondary" style={{ textAlign: "center" }}>
              Manage Leave Requests ➡
            </Link>
          </div>
        </div>

        {/* Database-Backed Activity & Alerts Timeline */}
        <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>Recent Activity & Notifications</h2>
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          {activityFeed.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📋</div>
              <p style={{ fontSize: "0.95rem" }}>No recent activity records found.</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                Check in above or submit a leave request to populate your personal timeline.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {activityFeed.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: item.type === "ATTENDANCE" ? "rgba(59, 130, 246, 0.15)" : "rgba(168, 85, 247, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                      }}
                    >
                      {item.type === "ATTENDANCE" ? "⏱️" : "🌴"}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "0.95rem", marginBottom: "0.2rem" }}>{item.title}</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{item.details}</p>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span
                      className="role-badge"
                      style={{
                        background:
                          item.status === "APPROVED" || item.status === "PRESENT"
                            ? "rgba(16, 185, 129, 0.2)"
                            : item.status === "PENDING"
                            ? "rgba(245, 158, 11, 0.2)"
                            : "rgba(239, 68, 68, 0.2)",
                        color:
                          item.status === "APPROVED" || item.status === "PRESENT"
                            ? "#34d399"
                            : item.status === "PENDING"
                            ? "#fbbf24"
                            : "#f87171",
                        fontSize: "0.75rem",
                      }}
                    >
                      {item.status}
                    </span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
                      {new Date(item.timestamp).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
