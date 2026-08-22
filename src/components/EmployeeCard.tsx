"use client";

interface EmployeeCardProps {
  employee: {
    id: string;
    employeeId: string;
    email: string;
    role: string;
    isVerified: boolean;
    profile: {
      firstName: string;
      lastName: string;
      department?: string | null;
      designation?: string | null;
      jobPosition?: string | null;
      avatarUrl?: string | null;
    } | null;
  };
  onSelect: (id: string) => void;
}

export default function EmployeeCard({ employee, onSelect }: EmployeeCardProps) {
  const profile = employee.profile;
  const fullName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : "Unnamed Employee";
  const initials = profile
    ? `${profile.firstName[0] || ""}${profile.lastName[0] || ""}`.toUpperCase()
    : "EMP";

  const department = profile?.department || "Unassigned Dept";
  const jobTitle = profile?.jobPosition || profile?.designation || "Staff Member";

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={fullName}
                style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--accent-primary)" }}
              />
            ) : (
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "var(--accent-gradient)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#fff",
                }}
              >
                {initials}
              </div>
            )}
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.2rem" }}>{fullName}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{jobTitle}</p>
            </div>
          </div>

          <span className={`role-badge ${employee.role === "HR_ADMIN" ? "role-badge-hr" : "role-badge-emp"}`}>
            {employee.role === "HR_ADMIN" ? "HR" : "EMP"}
          </span>
        </div>

        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem", fontSize: "0.85rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ color: "var(--text-muted)" }}>ID:</span>
            <strong style={{ color: "var(--text-primary)" }}>{employee.employeeId}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ color: "var(--text-muted)" }}>Dept:</span>
            <span style={{ color: "var(--text-secondary)" }}>{department}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ color: "var(--text-muted)" }}>Email:</span>
            <span style={{ color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>
              {employee.email}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onSelect(employee.id)}
        className="btn-secondary"
        style={{ marginTop: "1rem", width: "100%", textAlign: "center" }}
      >
        View & Edit Details
      </button>
    </div>
  );
}
