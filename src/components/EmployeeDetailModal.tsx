"use client";

import { useState, useEffect } from "react";

interface EmployeeDetailModalProps {
  employeeId: string | null;
  currentUserRole: string;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EmployeeDetailModal({
  employeeId,
  currentUserRole,
  onClose,
  onUpdated,
}: EmployeeDetailModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"personal" | "job" | "system">("personal");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    email: "",
    role: "EMPLOYEE",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    designation: "",
    department: "",
    jobPosition: "",
    manager: "",
    company: "",
    location: "",
    dateOfJoining: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    maritalStatus: "",
    avatarUrl: "",
  });

  const isHrAdmin = currentUserRole === "HR_ADMIN";

  useEffect(() => {
    if (!employeeId) return;

    async function fetchDetails() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/employees/${employeeId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load employee details.");
          setLoading(false);
          return;
        }

        const emp = data.employee;
        const p = emp.profile || {};

        setFormData({
          employeeId: emp.employeeId || "",
          email: emp.email || "",
          role: emp.role || "EMPLOYEE",
          firstName: p.firstName || "",
          lastName: p.lastName || "",
          phone: p.phone || "",
          address: p.address || "",
          designation: p.designation || "",
          department: p.department || "",
          jobPosition: p.jobPosition || p.designation || "",
          manager: p.manager || "",
          company: p.company || "Dayflow HRMS",
          location: p.location || "",
          dateOfJoining: p.dateOfJoining ? p.dateOfJoining.split("T")[0] : "",
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split("T")[0] : "",
          gender: p.gender || "MALE",
          nationality: p.nationality || "Indian",
          maritalStatus: p.maritalStatus || "SINGLE",
          avatarUrl: p.avatarUrl || "",
        });
        setLoading(false);
      } catch (err) {
        setError("Network error loading employee details.");
        setLoading(false);
      }
    }

    fetchDetails();
  }, [employeeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/employees/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update profile.");
        setSaving(false);
        return;
      }

      setSuccess("Profile updated successfully!");
      setSaving(false);
      setIsEditing(false);
      onUpdated();
    } catch (err) {
      setError("An unexpected error occurred while saving.");
      setSaving(false);
    }
  };

  if (!employeeId) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "1rem",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "750px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          ✖
        </button>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
            ⏳ Loading employee information...
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt={formData.firstName}
                  style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "var(--accent-gradient)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {formData.firstName[0]}
                  {formData.lastName[0]}
                </div>
              )}
              <div>
                <h2 style={{ fontSize: "1.6rem" }}>
                  {formData.firstName} {formData.lastName}
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  {formData.jobPosition || "Staff Member"} • {formData.department || "No Dept"}
                </p>
              </div>
            </div>

            {error && <div className="alert alert-danger">⚠️ {error}</div>}
            {success && <div className="alert alert-success">✅ {success}</div>}

            {/* Tab Navigation */}
            <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--border-color)", marginBottom: "1.5rem" }}>
              <button
                type="button"
                className="btn-secondary"
                style={{
                  borderColor: activeTab === "personal" ? "var(--accent-primary)" : "transparent",
                  color: activeTab === "personal" ? "var(--accent-primary)" : "var(--text-secondary)",
                }}
                onClick={() => setActiveTab("personal")}
              >
                Personal Details
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{
                  borderColor: activeTab === "job" ? "var(--accent-primary)" : "transparent",
                  color: activeTab === "job" ? "var(--accent-primary)" : "var(--text-secondary)",
                }}
                onClick={() => setActiveTab("job")}
              >
                Job Information
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{
                  borderColor: activeTab === "system" ? "var(--accent-primary)" : "transparent",
                  color: activeTab === "system" ? "var(--accent-primary)" : "var(--text-secondary)",
                }}
                onClick={() => setActiveTab("system")}
              >
                System Info
              </button>
            </div>

            <form onSubmit={handleSave}>
              {activeTab === "personal" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-input"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isHrAdmin}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-input"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isHrAdmin}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-input"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      className="form-select"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-input"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street, Suite 100"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      className="form-input"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Marital Status</label>
                    <select
                      name="maritalStatus"
                      className="form-select"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                    >
                      <option value="SINGLE">Single</option>
                      <option value="MARRIED">Married</option>
                      <option value="DIVORCED">Divorced</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nationality</label>
                    <input
                      type="text"
                      name="nationality"
                      className="form-input"
                      value={formData.nationality}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Avatar Picture URL</label>
                    <input
                      type="url"
                      name="avatarUrl"
                      className="form-input"
                      value={formData.avatarUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>
              )}

              {activeTab === "job" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Job Position / Title</label>
                    <input
                      type="text"
                      name="jobPosition"
                      className="form-input"
                      value={formData.jobPosition}
                      onChange={handleChange}
                      disabled={!isHrAdmin}
                      placeholder="Senior Software Engineer"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      name="department"
                      className="form-input"
                      value={formData.department}
                      onChange={handleChange}
                      disabled={!isHrAdmin}
                      placeholder="Engineering"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Reporting Manager</label>
                    <input
                      type="text"
                      name="manager"
                      className="form-input"
                      value={formData.manager}
                      onChange={handleChange}
                      disabled={!isHrAdmin}
                      placeholder="Sarah Connor"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      name="company"
                      className="form-input"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={!isHrAdmin}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Work Location</label>
                    <input
                      type="text"
                      name="location"
                      className="form-input"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isHrAdmin}
                      placeholder="Headquarters - New York"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date of Joining</label>
                    <input
                      type="date"
                      name="dateOfJoining"
                      className="form-input"
                      value={formData.dateOfJoining}
                      onChange={handleChange}
                      disabled={!isHrAdmin}
                    />
                  </div>
                </div>
              )}

              {activeTab === "system" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Employee ID</label>
                    <input
                      type="text"
                      name="employeeId"
                      className="form-input"
                      value={formData.employeeId}
                      onChange={handleChange}
                      disabled={!isHrAdmin}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isHrAdmin}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">System Role</label>
                    <select
                      name="role"
                      className="form-select"
                      value={formData.role}
                      onChange={handleChange}
                      disabled={!isHrAdmin}
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="HR_ADMIN">HR / Admin</option>
                    </select>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem" }}>
                <button type="button" onClick={onClose} className="btn-secondary">
                  Close
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
