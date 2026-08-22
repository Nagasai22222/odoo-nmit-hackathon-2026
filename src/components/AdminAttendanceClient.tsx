"use client";

import { useState, useEffect } from "react";

interface EmployeeOption {
  id: string;
  employeeId: string;
  email: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    department?: string;
  } | null;
}

interface AdminAttendanceClientProps {
  employees: EmployeeOption[];
}

export default function AdminAttendanceClient({ employees }: AdminAttendanceClientProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"DAILY" | "WEEKLY" | "HISTORY">("DAILY");

  // Daily View state
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [dailyRecords, setDailyRecords] = useState<any[]>([]);
  const [loadingDaily, setLoadingDaily] = useState(false);
  const [dailyError, setDailyError] = useState("");

  // Weekly View state
  const [weeklyData, setWeeklyData] = useState<any>(null);
  const [loadingWeekly, setLoadingWeekly] = useState(false);
  const [weeklyError, setWeeklyError] = useState("");

  // History View state
  const [historyRecords, setHistoryRecords] = useState<any[]>([]);
  const [historyStatus, setHistoryStatus] = useState("ALL");
  const [historyStartDate, setHistoryStartDate] = useState("");
  const [historyEndDate, setHistoryEndDate] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");

  // Filter employees matching searchQuery
  const filteredEmployees = employees.filter((emp) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = emp.profile ? `${emp.profile.firstName} ${emp.profile.lastName}`.toLowerCase() : "";
    const email = emp.email.toLowerCase();
    const empId = emp.employeeId.toLowerCase();
    const dept = (emp.profile?.department || "").toLowerCase();
    return name.includes(q) || email.includes(q) || empId.includes(q) || dept.includes(q);
  });

  const selectedEmployeeObj = employees.find((e) => e.id === selectedUserId);
  const selectedEmployeeName = selectedEmployeeObj
    ? selectedEmployeeObj.profile
      ? `${selectedEmployeeObj.profile.firstName} ${selectedEmployeeObj.profile.lastName}`
      : selectedEmployeeObj.email
    : "";

  // 1. Fetch Daily Records
  const fetchDaily = async () => {
    setLoadingDaily(true);
    setDailyError("");
    try {
      const params = new URLSearchParams();
      if (selectedDate) params.append("date", selectedDate);
      if (selectedUserId) params.append("targetUserId", selectedUserId);

      const res = await fetch(`/api/attendance/daily?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setDailyError(data.error || "Failed to fetch daily attendance.");
        setLoadingDaily(false);
        return;
      }

      setDailyRecords(data.records || []);
      setLoadingDaily(false);
    } catch (err) {
      setDailyError("Network error fetching daily attendance.");
      setLoadingDaily(false);
    }
  };

  // 2. Fetch Weekly Records
  const fetchWeekly = async () => {
    setLoadingWeekly(true);
    setWeeklyError("");
    try {
      const params = new URLSearchParams();
      if (selectedUserId) params.append("targetUserId", selectedUserId);

      const res = await fetch(`/api/attendance/weekly?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setWeeklyError(data.error || "Failed to fetch weekly attendance.");
        setLoadingWeekly(false);
        return;
      }

      setWeeklyData(data);
      setLoadingWeekly(false);
    } catch (err) {
      setWeeklyError("Network error fetching weekly attendance.");
      setLoadingWeekly(false);
    }
  };

  // 3. Fetch History Records
  const fetchHistory = async () => {
    setLoadingHistory(true);
    setHistoryError("");
    try {
      const params = new URLSearchParams();
      if (selectedUserId) params.append("targetUserId", selectedUserId);
      if (historyStatus && historyStatus !== "ALL") params.append("status", historyStatus);
      if (historyStartDate) params.append("startDate", historyStartDate);
      if (historyEndDate) params.append("endDate", historyEndDate);

      const res = await fetch(`/api/attendance/history?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setHistoryError(data.error || "Failed to fetch attendance history.");
        setLoadingHistory(false);
        return;
      }

      setHistoryRecords(data.records || []);
      setLoadingHistory(false);
    } catch (err) {
      setHistoryError("Network error fetching attendance history.");
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "DAILY") fetchDaily();
    if (activeTab === "WEEKLY") fetchWeekly();
    if (activeTab === "HISTORY") fetchHistory();
  }, [activeTab, selectedDate, selectedUserId, historyStatus, historyStartDate, historyEndDate]);

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "PRESENT":
        return <span className="role-badge" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399" }}>Present</span>;
      case "HALF_DAY":
        return <span className="role-badge" style={{ background: "rgba(245, 158, 11, 0.2)", color: "#fbbf24" }}>Half Day</span>;
      case "ABSENT":
        return <span className="role-badge" style={{ background: "rgba(239, 68, 68, 0.2)", color: "#f87171" }}>Absent</span>;
      case "LEAVE":
        return <span className="role-badge role-badge-hr">Leave</span>;
      default:
        return <span className="role-badge" style={{ background: "rgba(255, 255, 255, 0.1)", color: "var(--text-secondary)" }}>{st}</span>;
    }
  };

  return (
    <div>
      {/* Scope Banner & Filter Section */}
      <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              CURRENT INSPECTION SCOPE
            </span>
            <h2 style={{ fontSize: "1.3rem", marginTop: "0.2rem" }}>
              {selectedUserId ? (
                <span>
                  Target Employee: <strong style={{ color: "var(--accent-primary)" }}>{selectedEmployeeName}</strong> ({selectedEmployeeObj?.employeeId})
                </span>
              ) : (
                <span>Scope: <strong style={{ color: "var(--success)" }}>All Personnel ({employees.length} Staff Members)</strong></span>
              )}
            </h2>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setActiveTab("DAILY")}
              className={activeTab === "DAILY" ? "btn-primary" : "btn-secondary"}
              style={{ padding: "0.45rem 1rem", fontSize: "0.85rem", width: "auto" }}
            >
              📅 Daily Attendance
            </button>
            <button
              onClick={() => setActiveTab("WEEKLY")}
              className={activeTab === "WEEKLY" ? "btn-primary" : "btn-secondary"}
              style={{ padding: "0.45rem 1rem", fontSize: "0.85rem", width: "auto" }}
            >
              📊 Weekly Summary
            </button>
            <button
              onClick={() => setActiveTab("HISTORY")}
              className={activeTab === "HISTORY" ? "btn-primary" : "btn-secondary"}
              style={{ padding: "0.45rem 1rem", fontSize: "0.85rem", width: "auto" }}
            >
              📋 Attendance History
            </button>
          </div>
        </div>

        {/* Employee Selection Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>🔍 Search Staff:</span>
            <input
              type="text"
              placeholder="Filter by name, ID, email..."
              className="form-input"
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.85rem", width: "220px" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>👤 Target Employee:</span>
            <select
              className="form-select"
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.85rem", width: "auto" }}
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">All Personnel ({employees.length} Employees)</option>
              {filteredEmployees.map((emp) => {
                const name = emp.profile ? `${emp.profile.firstName} ${emp.profile.lastName}` : emp.email;
                return (
                  <option key={emp.id} value={emp.id}>
                    {emp.employeeId} - {name} ({emp.profile?.department || "General"})
                  </option>
                );
              })}
            </select>
          </div>

          {(selectedUserId || searchQuery) && (
            <button
              onClick={() => {
                setSelectedUserId("");
                setSearchQuery("");
              }}
              className="btn-secondary"
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: DAILY ATTENDANCE */}
      {activeTab === "DAILY" && (
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.2rem" }}>
              Daily Shift Attendance Records ({selectedDate})
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Select Date:</label>
              <input
                type="date"
                className="form-input"
                style={{ padding: "0.35rem 0.75rem", fontSize: "0.85rem", width: "auto" }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          {dailyError && <div className="alert alert-danger">⚠️ {dailyError}</div>}

          {loadingDaily ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
              Loading daily attendance logs...
            </div>
          ) : dailyRecords.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              No attendance records found for {selectedDate} {selectedUserId ? `for ${selectedEmployeeName}` : ""}.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                    <th style={{ padding: "0.75rem" }}>Employee ID</th>
                    <th style={{ padding: "0.75rem" }}>Name</th>
                    <th style={{ padding: "0.75rem" }}>Check In</th>
                    <th style={{ padding: "0.75rem" }}>Check Out</th>
                    <th style={{ padding: "0.75rem" }}>Working Duration</th>
                    <th style={{ padding: "0.75rem" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyRecords.map((r) => {
                    const empName = r.user?.profile ? `${r.user.profile.firstName} ${r.user.profile.lastName}` : r.user?.email || "—";
                    return (
                      <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "0.75rem", fontWeight: 600 }}>{r.user?.employeeId}</td>
                        <td style={{ padding: "0.75rem", fontWeight: 500 }}>{empName}</td>
                        <td style={{ padding: "0.75rem", color: "var(--success)" }}>
                          {r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                        </td>
                        <td style={{ padding: "0.75rem", color: "#60a5fa" }}>
                          {r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : r.checkIn ? "Active Session" : "—"}
                        </td>
                        <td style={{ padding: "0.75rem" }}>{r.totalHours ? `${r.totalHours} hrs` : "—"}</td>
                        <td style={{ padding: "0.75rem" }}>{getStatusBadge(r.status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WEEKLY OVERVIEW */}
      {activeTab === "WEEKLY" && (
        <div>
          {weeklyError && <div className="alert alert-danger" style={{ marginBottom: "1.5rem" }}>⚠️ {weeklyError}</div>}

          {loadingWeekly ? (
            <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
              Loading weekly summary aggregation...
            </div>
          ) : !weeklyData ? (
            <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              No weekly data available.
            </div>
          ) : (
            <div>
              <div className="stats-grid" style={{ marginBottom: "2rem" }}>
                <div className="stat-card">
                  <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>TOTAL SHIFTS</h3>
                  <div className="stat-val" style={{ color: "var(--accent-primary)" }}>{weeklyData.totalShifts}</div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.4rem" }}>
                    Week: {weeklyData.startDate} to {weeklyData.endDate}
                  </p>
                </div>

                <div className="stat-card">
                  <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>TOTAL HOURS LOGGED</h3>
                  <div className="stat-val" style={{ color: "#60a5fa" }}>{weeklyData.totalHours} hrs</div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.4rem" }}>
                    Cumulative Organization Time
                  </p>
                </div>

                <div className="stat-card">
                  <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>FULL PRESENT SHIFTS</h3>
                  <div className="stat-val" style={{ color: "var(--success)" }}>{weeklyData.summary.presentCount}</div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.4rem" }}>
                    Full Shifts (&ge; 4.0 hrs)
                  </p>
                </div>

                <div className="stat-card">
                  <h3 style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>HALF DAY SHIFTS</h3>
                  <div className="stat-val" style={{ color: "var(--warning)" }}>{weeklyData.summary.halfDayCount}</div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.4rem" }}>
                    Short Shifts (&lt; 4.0 hrs)
                  </p>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: "1.5rem" }}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "1.25rem" }}>Weekly Shift Records</h3>
                {weeklyData.records.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                    No shift logs recorded for this week.
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                          <th style={{ padding: "0.75rem" }}>Date</th>
                          <th style={{ padding: "0.75rem" }}>Employee</th>
                          <th style={{ padding: "0.75rem" }}>Check In</th>
                          <th style={{ padding: "0.75rem" }}>Check Out</th>
                          <th style={{ padding: "0.75rem" }}>Duration</th>
                          <th style={{ padding: "0.75rem" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {weeklyData.records.map((r: any) => {
                          const empName = r.user?.profile ? `${r.user.profile.firstName} ${r.user.profile.lastName}` : r.user?.email || "—";
                          return (
                            <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                              <td style={{ padding: "0.75rem", fontWeight: 600 }}>{new Date(r.date).toLocaleDateString()}</td>
                              <td style={{ padding: "0.75rem" }}>{empName} ({r.user?.employeeId})</td>
                              <td style={{ padding: "0.75rem", color: "var(--success)" }}>
                                {r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                              </td>
                              <td style={{ padding: "0.75rem", color: "#60a5fa" }}>
                                {r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : r.checkIn ? "Active Session" : "—"}
                              </td>
                              <td style={{ padding: "0.75rem" }}>{r.totalHours ? `${r.totalHours} hrs` : "—"}</td>
                              <td style={{ padding: "0.75rem" }}>{getStatusBadge(r.status)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HISTORY LOGS */}
      {activeTab === "HISTORY" && (
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.2rem" }}>Attendance History & Date Range Filters</h3>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>From Date</label>
                <input
                  type="date"
                  className="form-input"
                  style={{ padding: "0.35rem 0.6rem", fontSize: "0.85rem", width: "auto" }}
                  value={historyStartDate}
                  onChange={(e) => setHistoryStartDate(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>To Date</label>
                <input
                  type="date"
                  className="form-input"
                  style={{ padding: "0.35rem 0.6rem", fontSize: "0.85rem", width: "auto" }}
                  value={historyEndDate}
                  onChange={(e) => setHistoryEndDate(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>Status Filter</label>
                <select
                  className="form-select"
                  style={{ padding: "0.35rem 0.75rem", fontSize: "0.85rem", width: "auto" }}
                  value={historyStatus}
                  onChange={(e) => setHistoryStatus(e.target.value)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PRESENT">Present</option>
                  <option value="HALF_DAY">Half Day</option>
                  <option value="ABSENT">Absent</option>
                  <option value="LEAVE">Leave</option>
                </select>
              </div>
            </div>
          </div>

          {historyError && <div className="alert alert-danger">⚠️ {historyError}</div>}

          {loadingHistory ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
              Loading attendance history records...
            </div>
          ) : historyRecords.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              No attendance logs found matching the selected filters.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                    <th style={{ padding: "0.75rem" }}>Date</th>
                    <th style={{ padding: "0.75rem" }}>Employee ID</th>
                    <th style={{ padding: "0.75rem" }}>Name</th>
                    <th style={{ padding: "0.75rem" }}>Check In</th>
                    <th style={{ padding: "0.75rem" }}>Check Out</th>
                    <th style={{ padding: "0.75rem" }}>Working Duration</th>
                    <th style={{ padding: "0.75rem" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historyRecords.map((r) => {
                    const empName = r.user?.profile ? `${r.user.profile.firstName} ${r.user.profile.lastName}` : r.user?.email || "—";
                    return (
                      <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "0.75rem", fontWeight: 600 }}>{new Date(r.date).toLocaleDateString()}</td>
                        <td style={{ padding: "0.75rem", fontWeight: 600 }}>{r.user?.employeeId}</td>
                        <td style={{ padding: "0.75rem", fontWeight: 500 }}>{empName}</td>
                        <td style={{ padding: "0.75rem", color: "var(--success)" }}>
                          {r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                        </td>
                        <td style={{ padding: "0.75rem", color: "#60a5fa" }}>
                          {r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : r.checkIn ? "Active Session" : "—"}
                        </td>
                        <td style={{ padding: "0.75rem" }}>{r.totalHours ? `${r.totalHours} hrs` : "—"}</td>
                        <td style={{ padding: "0.75rem" }}>{getStatusBadge(r.status)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
