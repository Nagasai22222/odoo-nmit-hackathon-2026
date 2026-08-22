"use client";

import { useState, useEffect } from "react";
import WeeklyAttendanceCard from "./WeeklyAttendanceCard";
import AttendanceHistoryTable from "./AttendanceHistoryTable";

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number | null;
  status: string;
}

interface AttendanceClientControllerProps {
  user: {
    id: string;
    employeeId: string;
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      department?: string;
      jobPosition?: string;
    } | null;
  };
}

export default function AttendanceClientController({ user }: AttendanceClientControllerProps) {
  const [activeTab, setActiveTab] = useState<"TODAY" | "DAILY" | "WEEKLY" | "HISTORY">("TODAY");

  // Today's attendance state
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [fetchingToday, setFetchingToday] = useState(true);

  // Daily Date Picker state
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [dailyRecords, setDailyRecords] = useState<AttendanceRecord[]>([]);
  const [fetchingDaily, setFetchingDaily] = useState(false);
  const [dailyError, setDailyError] = useState("");

  // 1. Fetch Today's Attendance State on Mount
  const fetchTodayAttendance = async () => {
    setFetchingToday(true);
    setErrorMsg("");
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const res = await fetch(`/api/attendance/daily?date=${todayStr}`);
      const data = await res.json();

      if (res.ok && data.records && data.records.length > 0) {
        setTodayRecord(data.records[0]);
      } else {
        setTodayRecord(null);
      }
      setFetchingToday(false);
    } catch (err) {
      setErrorMsg("Failed to load today's attendance status.");
      setFetchingToday(false);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  // 2. Fetch Daily Attendance when date selection changes
  const fetchDailyDateRecord = async (dateStr: string) => {
    setFetchingDaily(true);
    setDailyError("");
    try {
      const res = await fetch(`/api/attendance/daily?date=${dateStr}`);
      const data = await res.json();

      if (!res.ok) {
        setDailyError(data.error || "Failed to fetch daily record.");
        setFetchingDaily(false);
        return;
      }

      setDailyRecords(data.records || []);
      setFetchingDaily(false);
    } catch (err) {
      setDailyError("Network error fetching daily attendance.");
      setFetchingDaily(false);
    }
  };

  useEffect(() => {
    if (activeTab === "DAILY") {
      fetchDailyDateRecord(selectedDate);
    }
  }, [activeTab, selectedDate]);

  // 3. Handle Check In Action
  const handleCheckIn = async () => {
    if (loadingAction) return;
    setLoadingAction(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/attendance/check-in", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Check-in failed.");
        setLoadingAction(false);
        return;
      }

      setSuccessMsg("🟢 Check-in recorded successfully!");
      setTodayRecord(data.attendance);
      setLoadingAction(false);
    } catch (err) {
      setErrorMsg("Network error during check-in.");
      setLoadingAction(false);
    }
  };

  // 4. Handle Check Out Action
  const handleCheckOut = async () => {
    if (loadingAction) return;
    setLoadingAction(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/attendance/check-out", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Check-out failed.");
        setLoadingAction(false);
        return;
      }

      setSuccessMsg(`🔴 Check-out recorded successfully! Shift Duration: ${data.workingHours} hrs.`);
      setTodayRecord(data.attendance);
      setLoadingAction(false);
    } catch (err) {
      setErrorMsg("Network error during check-out.");
      setLoadingAction(false);
    }
  };

  // State derivation for buttons & badges
  const isCheckedIn = todayRecord !== null && todayRecord.checkIn !== null;
  const isCheckedOut = todayRecord !== null && todayRecord.checkOut !== null;

  const getTodayStatusLabel = () => {
    if (!todayRecord) return "Not Checked In";
    if (todayRecord.status === "PRESENT") return "Present";
    if (todayRecord.status === "HALF_DAY") return "Half Day";
    if (todayRecord.status === "LEAVE") return "Leave";
    if (todayRecord.status === "ABSENT") return "Absent";
    return todayRecord.status;
  };

  const formatHours = (hours: number | null) => {
    if (!hours) return "—";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m (${hours} hrs)`;
  };

  return (
    <div>
      {/* Navigation Tab Bar */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", overflowX: "auto" }}>
        <button
          onClick={() => setActiveTab("TODAY")}
          className={activeTab === "TODAY" ? "btn-primary" : "btn-secondary"}
          style={{ padding: "0.6rem 1.2rem", fontSize: "0.9rem", width: "auto" }}
        >
          ⏱️ Today & Check-In Action
        </button>
        <button
          onClick={() => setActiveTab("DAILY")}
          className={activeTab === "DAILY" ? "btn-primary" : "btn-secondary"}
          style={{ padding: "0.6rem 1.2rem", fontSize: "0.9rem", width: "auto" }}
        >
          📅 Daily Search
        </button>
        <button
          onClick={() => setActiveTab("WEEKLY")}
          className={activeTab === "WEEKLY" ? "btn-primary" : "btn-secondary"}
          style={{ padding: "0.6rem 1.2rem", fontSize: "0.9rem", width: "auto" }}
        >
          📊 Weekly Summary
        </button>
        <button
          onClick={() => setActiveTab("HISTORY")}
          className={activeTab === "HISTORY" ? "btn-primary" : "btn-secondary"}
          style={{ padding: "0.6rem 1.2rem", fontSize: "0.9rem", width: "auto" }}
        >
          📋 Attendance History
        </button>
      </div>

      {/* TAB 1: TODAY & CHECK-IN QUICK ACTION */}
      {activeTab === "TODAY" && (
        <div>
          <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>
                  Today&apos;s Attendance Action Banner
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  {new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>

              <div>
                <span
                  className="role-badge"
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: "0.85rem",
                    background:
                      getTodayStatusLabel() === "Present"
                        ? "rgba(16, 185, 129, 0.2)"
                        : getTodayStatusLabel() === "Half Day"
                        ? "rgba(245, 158, 11, 0.2)"
                        : getTodayStatusLabel() === "Not Checked In"
                        ? "rgba(239, 68, 68, 0.2)"
                        : "rgba(255, 255, 255, 0.1)",
                    color:
                      getTodayStatusLabel() === "Present"
                        ? "#34d399"
                        : getTodayStatusLabel() === "Half Day"
                        ? "#fbbf24"
                        : getTodayStatusLabel() === "Not Checked In"
                        ? "#f87171"
                        : "var(--text-primary)",
                  }}
                >
                  STATUS: {getTodayStatusLabel().toUpperCase()}
                </span>
              </div>
            </div>

            {errorMsg && <div className="alert alert-danger" style={{ marginBottom: "1.5rem" }}>⚠️ {errorMsg}</div>}
            {successMsg && <div className="alert alert-success" style={{ marginBottom: "1.5rem" }}>{successMsg}</div>}

            {fetchingToday ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                Loading current attendance status from database...
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
                  <div style={{ background: "rgba(255,255,255,0.03)", padding: "1.25rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>CHECK IN TIME</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--success)" }}>
                      {todayRecord?.checkIn ? new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Not Checked In"}
                    </div>
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.03)", padding: "1.25rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>CHECK OUT TIME</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 600, color: "#60a5fa" }}>
                      {todayRecord?.checkOut ? new Date(todayRecord.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : isCheckedIn ? "Active Session" : "—"}
                    </div>
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.03)", padding: "1.25rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>TOTAL WORKING HOURS</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--accent-primary)" }}>
                      {formatHours(todayRecord?.totalHours || null)}
                    </div>
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                  <button
                    onClick={handleCheckIn}
                    disabled={loadingAction || isCheckedIn}
                    className="btn-primary"
                    style={{
                      width: "auto",
                      padding: "0.75rem 2rem",
                      fontSize: "1rem",
                      opacity: isCheckedIn ? 0.5 : 1,
                      cursor: isCheckedIn ? "not-allowed" : "pointer",
                    }}
                  >
                    {loadingAction ? "Processing..." : isCheckedIn ? "✓ CHECKED IN" : "🟢 CHECK IN NOW"}
                  </button>

                  <button
                    onClick={handleCheckOut}
                    disabled={loadingAction || !isCheckedIn || isCheckedOut}
                    className="btn-secondary"
                    style={{
                      width: "auto",
                      padding: "0.75rem 2rem",
                      fontSize: "1rem",
                      borderColor: !isCheckedIn || isCheckedOut ? "var(--border-color)" : "#f87171",
                      color: !isCheckedIn || isCheckedOut ? "var(--text-muted)" : "#f87171",
                      opacity: !isCheckedIn || isCheckedOut ? 0.5 : 1,
                      cursor: !isCheckedIn || isCheckedOut ? "not-allowed" : "pointer",
                    }}
                  >
                    {loadingAction ? "Processing..." : isCheckedOut ? "✓ CHECKED OUT" : "🔴 CHECK OUT NOW"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DAILY SEARCH DATE PICKER */}
      {activeTab === "DAILY" && (
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>Daily Attendance Search</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Select a date to inspect recorded check-in, check-out, and shift status.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Select Date:</label>
              <input
                type="date"
                className="form-input"
                style={{ width: "auto", padding: "0.4rem 0.8rem" }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          {dailyError && <div className="alert alert-danger">⚠️ {dailyError}</div>}

          {fetchingDaily ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
              Loading attendance record for {selectedDate}...
            </div>
          ) : dailyRecords.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              No attendance record found for {selectedDate}.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                    <th style={{ padding: "0.75rem" }}>Date</th>
                    <th style={{ padding: "0.75rem" }}>Check In</th>
                    <th style={{ padding: "0.75rem" }}>Check Out</th>
                    <th style={{ padding: "0.75rem" }}>Working Duration</th>
                    <th style={{ padding: "0.75rem" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyRecords.map((r) => (
                    <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "0.75rem", fontWeight: 600 }}>{selectedDate}</td>
                      <td style={{ padding: "0.75rem", color: "var(--success)" }}>
                        {r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                      <td style={{ padding: "0.75rem", color: "#60a5fa" }}>
                        {r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : r.checkIn ? "Active Session" : "—"}
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        {r.totalHours ? `${r.totalHours} hrs` : "—"}
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <span
                          className="role-badge"
                          style={{
                            background: r.status === "PRESENT" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                            color: r.status === "PRESENT" ? "#34d399" : "#fbbf24",
                          }}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WEEKLY SUMMARY */}
      {activeTab === "WEEKLY" && <WeeklyAttendanceCard />}

      {/* TAB 4: ATTENDANCE HISTORY TABLE */}
      {activeTab === "HISTORY" && <AttendanceHistoryTable />}
    </div>
  );
}
