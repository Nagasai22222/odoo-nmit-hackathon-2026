"use client";

import { useState } from "react";

interface EmployeeProfileEditorProps {
  user: {
    id: string;
    employeeId: string;
    email: string;
    role: string;
    profile: {
      firstName: string;
      lastName: string;
      phone?: string | null;
      address?: string | null;
      designation?: string | null;
      department?: string | null;
      jobPosition?: string | null;
      manager?: string | null;
      company?: string | null;
      location?: string | null;
      dateOfJoining?: Date | string | null;
      dateOfBirth?: Date | string | null;
      gender?: string | null;
      nationality?: string | null;
      maritalStatus?: string | null;
      avatarUrl?: string | null;
    } | null;
  };
}

export default function EmployeeProfileEditor({ user }: EmployeeProfileEditorProps) {
  const p: any = user.profile || {};
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [phone, setPhone] = useState(p.phone || "");
  const [address, setAddress] = useState(p.address || "");
  const [avatarUrl, setAvatarUrl] = useState(p.avatarUrl || "");
  const [gender, setGender] = useState(p.gender || "MALE");
  const [maritalStatus, setMaritalStatus] = useState(p.maritalStatus || "SINGLE");

  const fullName = `${p.firstName || ""} ${p.lastName || ""}`.trim() || user.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/employees/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          address,
          avatarUrl,
          gender,
          maritalStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update personal details.");
        setSaving(false);
        return;
      }

      setSuccess("Your personal contact details have been updated successfully!");
      setSaving(false);
    } catch (err) {
      setError("An unexpected network error occurred.");
      setSaving(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={fullName}
            style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--accent-primary)" }}
          />
        ) : (
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "var(--accent-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.8rem",
              color: "#fff",
            }}
          >
            {p.firstName ? p.firstName[0] : "E"}
            {p.lastName ? p.lastName[0] : ""}
          </div>
        )}

        <div>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "0.25rem" }}>{fullName}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            {p.jobPosition || p.designation || "Staff Member"} • {p.department || "General"}
          </p>
        </div>
      </div>

      {error && <div className="alert alert-danger">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      <form onSubmit={handleSubmit}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--accent-primary)" }}>
          Contact Information (Editable)
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Avatar URL</label>
            <input
              type="url"
              className="form-input"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Home Address</label>
            <input
              type="text"
              className="form-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, City, State, ZIP Code"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Marital Status</label>
            <select className="form-select" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
              <option value="SINGLE">Single</option>
              <option value="MARRIED">Married</option>
              <option value="DIVORCED">Divorced</option>
            </select>
          </div>
        </div>

        <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--text-secondary)" }}>
          Organization & System Details (Read-Only)
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          <div className="form-group">
            <label className="form-label">Employee ID</label>
            <input type="text" className="form-input" value={user.employeeId} disabled />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="text" className="form-input" value={user.email} disabled />
          </div>

          <div className="form-group">
            <label className="form-label">Job Position</label>
            <input type="text" className="form-input" value={p.jobPosition || p.designation || "Staff Member"} disabled />
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <input type="text" className="form-input" value={p.department || "Unassigned"} disabled />
          </div>

          <div className="form-group">
            <label className="form-label">Reporting Manager</label>
            <input type="text" className="form-input" value={p.manager || "Unassigned"} disabled />
          </div>

          <div className="form-group">
            <label className="form-label">Company</label>
            <input type="text" className="form-input" value={p.company || "Dayflow HRMS"} disabled />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" className="form-input" value={p.location || "Main Office"} disabled />
          </div>

          <div className="form-group">
            <label className="form-label">Date of Joining</label>
            <input
              type="text"
              className="form-input"
              value={p.dateOfJoining ? new Date(p.dateOfJoining).toLocaleDateString() : "N/A"}
              disabled
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving Changes..." : "Save Personal Profile Changes"}
        </button>
      </form>
    </div>
  );
}
