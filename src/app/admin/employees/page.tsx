"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EmployeeCard from "@/components/EmployeeCard";
import EmployeeDetailModal from "@/components/EmployeeDetailModal";
import LogoutButton from "@/components/LogoutButton";

export default function AdminEmployeeManagementPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (selectedDepartment) params.set("department", selectedDepartment);

      const res = await fetch(`/api/employees?${params.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setEmployees(data.employees || []);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedDepartment]);

  return (
    <div>
      <header className="app-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="auth-brand" style={{ fontSize: "1.5rem", margin: 0 }}>
            DAYFLOW
          </div>
          <span className="role-badge role-badge-hr">EMPLOYEE DIRECTORY</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/admin/dashboard" className="btn-secondary">
            ⬅ Dashboard
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="dashboard-container">
        <div className="glass-panel" style={{ padding: "1.5rem 2rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>
                Personnel & Profile Directory 👥
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                Search, inspect, and manage employee records across your organization.
              </p>
            </div>

            <Link href="/register" className="btn-primary" style={{ width: "auto" }}>
              ➕ Register New Employee
            </Link>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div
          className="glass-panel"
          style={{
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            display: "grid",
            gridTemplateColumns: "1fr 240px",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div className="form-group" style={{ margin: 0 }}>
            <input
              type="text"
              className="form-input"
              placeholder="🔍 Search employees by name, Employee ID, designation, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <select
              className="form-select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
        </div>

        {/* Directory Grid View */}
        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-secondary)" }}>
            ⏳ Searching and loading employee records...
          </div>
        ) : employees.length === 0 ? (
          <div
            className="glass-panel"
            style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h3>No Employee Records Found</h3>
            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
              No employee matches your current search criteria &quot;{searchQuery}&quot;.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {employees.map((emp) => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                onSelect={(id) => setSelectedEmployeeId(id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Selected Employee Detail Modal */}
      {selectedEmployeeId && (
        <EmployeeDetailModal
          employeeId={selectedEmployeeId}
          currentUserRole="HR_ADMIN"
          onClose={() => setSelectedEmployeeId(null)}
          onUpdated={fetchEmployees}
        />
      )}
    </div>
  );
}
